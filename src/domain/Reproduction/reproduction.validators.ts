import * as Yup from "yup";

const yupConfig = {
  strict: false,
  abortEarly: true,
  stripUnknown: true,
  recursive: true,
};

export const createValidator = (data: any) => {
  const medicineCreateSchema = Yup.object({
    earringId: Yup.string().required("Brinco é obrigatório"),
  });

  return medicineCreateSchema.validate(data, yupConfig);
};

export const updateValidator = (data: any) => {
  const medicineCreateSchema = Yup.object({
    date: Yup.string().required("Data é obrigatório"),
  });

  return medicineCreateSchema.validate(data, yupConfig);
};
