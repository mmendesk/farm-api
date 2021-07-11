import * as axios from "axios";
import { Utils } from "../domain/Utils";

interface ILulamolusco {
  message: string;
  cellphone: string;
}

export class LulamoluscoService {
  private utils: Utils;
  constructor() {
    this.utils = new Utils();
  }

  async sendSms(message: string, cellphone: string) {
    const headers = {
      Authorization: process.env.LULAMOLUSCO_APPLICATION,
    };

    let lulamoluscoResponse: ILulamolusco;
    try {
      lulamoluscoResponse = await axios.default.post(
        `${process.env.LULAMOLUSCO_API}/sms`,
        {
          message: message,
          cellphone: cellphone,
        },
        {
          headers: headers,
        }
      );
      console.log(lulamoluscoResponse);
    } catch (e) {
      console.log(e);
      this.utils.makeException(400, [
        "Ocorreu um erro ao enviar o token, tente novamente",
      ]);
    }
  }
}
