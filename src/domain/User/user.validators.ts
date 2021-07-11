import { Types } from "mongoose";
import * as Yup from "yup";
import { Utils } from "../Utils";
import Entity from "./user.entity";

const yupConfig = {
  strict: false,
  abortEarly: true,
  stripUnknown: true,
  recursive: true,
};

export const createValidator = (data: {
  name: string;
  login: string;
  email?: string;
  type: string;
  password: string;
  status?: boolean;
}) => {
  const utils = new Utils();
  const userCreateSchema = Yup.object({
    name: Yup.string().required("Nome é obrigatório"),
    login: Yup.string()
      .required("Login é obrigatório")
      .test(async function (login: string) {
        let loginAlreadyExists = await Entity.findOne({ login: login });
        const { path, createError } = this;
        if (loginAlreadyExists) {
          return createError({
            path,
            message: "Login ja existente, por favor escolha outro",
          });
        }
        return true;
      }),
    password: Yup.string().required("Senha é obrigatória"),
    type: Yup.string().required("O Tipo é obrigatório"),
    email: Yup.string(),
    status: Yup.boolean(),
  });

  return userCreateSchema.validate(data, yupConfig);
};

export const updateValidator = (data: any, userId: string) => {
  const userCreateSchema = Yup.object({
    name: Yup.string().required("Nome é obrigatório"),
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório")
      .test(async function (email: string) {
        const { path, createError } = this;

        const existUsers = await Entity.findOne({
          email: email,
        });

        if (existUsers && existUsers._id.toString() !== userId.toString()) {
          return createError({ path, message: "email ja cadastrado" });
        }

        return true;
      }),
    active: Yup.boolean().required("Ativo deve ser enviado"),
  });

  return userCreateSchema.validate(data, yupConfig);
};

export const createSessionValidator = (data: {
  login: string;
  password: string;
}) => {
  const userSessionSchema = Yup.object({
    login: Yup.string().required("Senha é obrigatória"),
    password: Yup.string().required("Senha é obrigatória"),
  });
  return userSessionSchema.validate(data, yupConfig);
};
