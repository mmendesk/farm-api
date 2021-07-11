import { encode as encodeJWt, decode as decodeJwt } from "jwt-simple";
import { Request } from "express";
import UserEntity from "../User/user.entity";
import { Utils } from "../Utils/index";

export class AuthenticationService {
  private jwt_key = process.env.JWT_SECRET;

  generate(payload: Object) {
    return encodeJWt(payload, this.jwt_key);
  }

  getPayload(req: Request) {
    let token = req.headers.authorization;

    if (!token) {
      token = req.cookies.Authorization;
    }
    token = token.replace("Bearer ", "");

    if (token) {
      return decodeJwt(token, this.jwt_key);
    }
    return false;
  }

  async verify(req: Request) {
    const utils = new Utils();
    try {
      let payload = this.getPayload(req);
      if (!payload) {
        return false;
      }
      const user = await UserEntity.findOne({
        _id: payload._id,
      });

      if (!user) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
