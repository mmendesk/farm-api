import { Utils } from "../Utils/index";
import medicineEntity from "./medicine.entity";
import { Types } from "mongoose";
import { createValidator, updateValidator } from "./medicine.validators";

interface IMedicine {
  earringId: string;
  remedy: string;
  remedyId: string;
  date?: Date;
  dateValidate?: Date;
}

export class MedicineService {
  private utils = new Utils();

  constructor() {
    this.utils = new Utils();
  }

  async create(data: IMedicine) {
    try {
      await createValidator(data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    await medicineEntity.create({ ...data });
    return { msg: "Criado com sucesso" };
  }
  async update(data: IMedicine, medicineId: string) {
    try {
      await updateValidator(data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    let response;
    try {
      response = await medicineEntity.updateOne({ _id: medicineId }, data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }
    return response;
  }

  async getCalfById(medicineId: Types.ObjectId) {
    return await medicineEntity.find({ _id: medicineId });
  }

  async getMedicines() {
    return await medicineEntity.find({}).sort({ _id: -1 });
  }
}
