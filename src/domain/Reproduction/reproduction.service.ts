import { Utils } from "../Utils/index";
import reproductionEntity from "./reproduction.entity";
import { Types } from "mongoose";
import { createValidator, updateValidator } from "./reproduction.validators";

interface IReproduction {
  earringId: string;
  date?: Date;
  winDate?: Date;
}

export class ReproctionService {
  private utils = new Utils();

  constructor() {
    this.utils = new Utils();
  }

  async create(data: IReproduction) {
    try {
      await createValidator(data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    await reproductionEntity.create({ ...data });
    return { msg: "Criado com sucesso" };
  }
  async update(data: IReproduction, reproId: string) {
    try {
      await updateValidator(data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    let response;
    try {
      response = await reproductionEntity.updateOne({ _id: reproId }, data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }
    return response;
  }

  async getCalfById(reproId: Types.ObjectId) {
    return await reproductionEntity.find({ _id: reproId });
  }

  async getReproduction() {
    return await reproductionEntity.find({}).sort({ _id: -1 });
  }
}
