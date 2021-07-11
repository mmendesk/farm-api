import { Types } from "mongoose";
import * as Yup from "yup";
import Entity from "./calf.entity";

const yupConfig = {
  strict: false,
  abortEarly: true,
  stripUnknown: true,
  recursive: true,
};

export const createValidator = (data: any) => {
  const userCreateSchema = Yup.object({
    weightOne: Yup.string().required("Peso é obrigatório"),
    earringId: Yup.string()
      .required("Brinco é obrigatório")
      .test(async function (earringId: string) {
        const { path, createError } = this;

        const existCalf = await Entity.findOne({
          earringId: earringId,
        });

        if (existCalf) {
          return createError({ path, message: "Brinco já existente" });
        }
        return true;
      }),
  });

  return userCreateSchema.validate(data, yupConfig);
};

export const updateValidator = (data: any, calfId: string) => {
  const userCreateSchema = Yup.object({
    weightOne: Yup.string().required("Peso é obrigatório"),
    earringId: Yup.string()
      .required("E-mail é obrigatório")
      .test(async function (earringId: string) {
        const { path, createError } = this;

        const existCalf = await Entity.findOne({
          email: earringId,
        });

        if (existCalf && existCalf._id.toString() !== calfId.toString()) {
          return createError({ path, message: "Brinco ja cadastrado" });
        }

        return true;
      }),
  });

  return userCreateSchema.validate(data, yupConfig);
};
