import { Utils } from "../Utils/index";
import calfEntity from "./calf.entity";
import { Types } from "mongoose";
import { createValidator, updateValidator } from "./calf.validators";

interface ICalf {
  earringId: string;
  weightOne: string;
  weightTwo: string;
  weightThree: string;
  sex: string;
  dateWeightOne?: Date;
  dateWeightTwo?: Date;
  dateWeightThree?: Date;
}

export class CalfService {
  private utils = new Utils();

  constructor() {
    this.utils = new Utils();
  }

  async create(data: ICalf) {
    try {
      await createValidator(data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    await calfEntity.create({ ...data });
    return { msg: "Criado com sucesso" };
  }
  async update(data: ICalf, calfId: string) {
    try {
      await updateValidator(data, calfId);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    let response;
    try {
      response = await calfEntity.updateOne({ _id: calfId }, data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }
    return response;
  }

  async getCalfById(calfId: Types.ObjectId) {
    return await calfEntity.find({ _id: calfId });
  }

  async getCalfs() {
    return await calfEntity.find({}).sort({ _id: -1 });
  }

  async calfAll() {
    const query = calfEntity.find({});

    const calf = await query.sort({ _id: -1 }).exec();

    return Promise.all(
      calf.map(async (element) => {
        const calfs = await calfEntity.findOne({
          earringId: element.earringId,
        });

        const patientFormat = {
          earringId: calfs.earringId,
          sex: calfs.sex,
          weightOne: calfs.weightOne,
          weightTwo: calfs.weightTwo,
          weightThree: calfs.weightThree,
          dateWeightOne: calfs.dateWeightOne,
          dateWeightTwo: calfs.dateWeightTwo,
          dateWeightThree: calfs.dateWeightThree,
        };

        return {
          calf: element,
          calfs: patientFormat,
        };
      })
    );
  }
}
