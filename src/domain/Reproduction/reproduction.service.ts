import { Utils } from "../Utils/index";
import reproductionEntity from "./reproduction.entity";
import { Types } from "mongoose";
import { createValidator, updateValidator } from "./reproduction.validators";

interface IReproduction {
  earringId: string;
  vermifuge: string;
  supplementation: string;
  insemination?: Date;
  winDate?: Date;
  ride?: Date;
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

  async reproAll() {
    const query = reproductionEntity.find({});

    const repros = await query.sort({ _id: -1 }).exec();

    return Promise.all(
      repros.map(async (element) => {
        const reproductions = await reproductionEntity.findOne({
          earringId: element.earringId,
        });

        const reproductionFormat = {
          earringId: reproductions.earringId,
          vermifuge: reproductions.vermifuge,
          supplementation: reproductions.supplementation,
          insemination: reproductions.insemination,
          ride: reproductions.ride,
          winDate: reproductions.winDate,
        };

        return {
          repros: element,
          reproductions: reproductionFormat,
        };
      })
    );
  }
}
