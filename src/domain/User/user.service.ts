import {
  createValidator,
  createSessionValidator,
  updateValidator,
} from "./user.validators";
import { Utils } from "../Utils/index";
import { generate, verify } from "password-hash";
import userEntity from "./user.entity";
import { Types } from "mongoose";
import { AuthenticationService } from "../Authentication/authentication.service";
interface iUser {
  name: string;
  login: string;
  email?: string;
  type: string;
  password: string;
  status?: boolean;
}

export class UserService {
  private utils = new Utils();
  private authenticationService: AuthenticationService;

  constructor() {
    this.utils = new Utils();
    this.authenticationService = new AuthenticationService();
  }
  ////Create User
  async create(data: iUser) {
    try {
      await createValidator(data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    data.password = generate(data.password);
    await userEntity.create({ ...data });
    return { msg: "Criado com sucesso" };
  }
  ////Update User
  async update(data: iUser, userId: string) {
    try {
      await updateValidator(data, userId);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }

    if (data.password) {
      data.password = generate(data.password);
    }

    let response;
    try {
      response = await userEntity.updateOne({ _id: userId }, data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }
    return response;
  }
  ////Get user by Id
  async getUserById(userId: Types.ObjectId) {
    return await userEntity.find({ _id: userId });
  }

  async getUsers() {
    return await userEntity.find({}).sort({ _id: -1 });
  }

  async getUserMe(data: { payload: any }) {
    try {
      console.log(data.payload);
      let me = await userEntity.findOne({ _id: data.payload._id });
      return me;
    } catch (e) {
      console.log(e);
    }
  }

  ////Session user
  async createSession(data: { login: string; password: string }) {
    try {
      await createSessionValidator(data);
    } catch (e) {
      this.utils.makeException(401, e.errors);
    }
    let userExist = await userEntity.findOne({
      login: data.login,
    });

    console.log(userExist);

    if (!userExist) {
      this.utils.makeException(401, ["Usuário não cadastrado"]);
    }
    if (!verify(data.password, userExist.password)) {
      this.utils.makeException(404, ["Usuário ou senha incorreto"]);
    }
    const token = this.authenticationService.generate(userExist);
    return `Bearer ${token}`;
  }
}
