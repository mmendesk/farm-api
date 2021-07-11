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
    remedy: Yup.string().required("Remédio é obrigatório"),
    remedyId: Yup.string().required("Código do remédio é obrigatório"),
  });

  return medicineCreateSchema.validate(data, yupConfig);
};

export const updateValidator = (data: any) => {
  const medicineCreateSchema = Yup.object({
    dateValidate: Yup.string().required("Data é obrigatório"),
  });

  return medicineCreateSchema.validate(data, yupConfig);
};
