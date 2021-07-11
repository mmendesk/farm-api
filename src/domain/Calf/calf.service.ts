import { Utils } from "../Utils/index";
import * as ejs from "ejs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as PromiseBB from "bluebird";
import * as hb from "handlebars";
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

  public async generatePdf(calfId: Types.ObjectId) {
    const calf: any = await calfEntity.findOne({ _id: calfId });
    const history = [];
    calf.history.forEach((hist: any) => {
      return hist.answers.forEach((ans) => {
        if (!!ans.unit) {
          history.push({
            weightOne: hist.weightOne,
            weightTwo: ans.weightTwo,
          });
        } else {
          history.push({
            weightOne: hist.weightOne,
            weightTwo: ans.weightTwo,
          });
        }
      });
    });

    const patient = await calfEntity.findById(calf.earringId);
    patient.weightOne = this.utils.cepMask(patient.weightOne);
    const dateWeightOne = patient.dateWeightOne;
    const dpsFormated = {
      history: history,
      patient: patient,
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "/../../views/dpsPdf/", "index.ejs"),
      { dps: dpsFormated }
    );

    const buffer = await this.generatePdfWithPuppeteer(html);
    return buffer;
  }

  private async generatePdfWithPuppeteer(html) {
    let args = ["--no-sandbox", "--disable-setuid-sandbox"];

    const browser = await puppeteer.launch({
      args: args,
      executablePath: "/usr/bin/chromium",
    });
    const page = await browser.newPage();

    console.log("Compiling the template with handlebars");
    // we have compile our code with handlebars
    const template = hb.compile(html, { strict: true });
    const result = template(html);

    // We set the page content as the generated html by handlebars
    await page.setContent(result);
    const options: any = { format: "A4" };
    return PromiseBB.props(page.pdf(options)).then(async (data: Object) => {
      await browser.close();

      return Buffer.from(Object.values(data));
    });
  }
}
