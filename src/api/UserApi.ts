import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { AuthenticationService } from "src/domain/Authentication/authentication.service";
import { UserService } from "../domain/User/user.service";
import { authClientMiddleware } from "../middlewares/AuthMiddleware";
export default class UserApi {
  public router: Router;
  private userService = new UserService();
  private authService = new AuthenticationService();
  constructor() {
    this.router = Router();
    this.router.post("/users", this.createUser);
    this.router.post("/auth", this.session);
    this.router.get("/users", authClientMiddleware, this.listUsers);
    this.router.get("/user/me", authClientMiddleware, this.me);
    this.router.put("/users/:id", authClientMiddleware, this.updateUser);
    this.router.get("/users/:id", authClientMiddleware, this.getUserById);
    this.router.get("/health", (req, res) => {
      return res.send("Health ok");
    });
  }

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.userService.create(req.body);
      return res.json({
        msg: "Criado com sucesso",
      });
    } catch (e) {
      next(e);
    }
  };

  private me = async (req: any, res: Response, next: NextFunction) => {
    try {
      return res.json(
        await this.userService.getUserMe({ payload: req.payload })
      );
    } catch (e) {
      console.log(e);
      return res.status(404).json({
        msg: "Usuário não encontrado",
      });
    }
  };

  private updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = this.authService.getPayload(req);
      await this.userService.update(req.body, payload.clientId);
      return res.json({
        msg: "Atualizado com sucesso",
      });
    } catch (e) {
      next(e);
    }
  };

  private listUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.json(await this.userService.getUsers());
    } catch (err) {
      next(err);
    }
  };

  private getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res
        .status(200)
        .json(
          await this.userService.getUserById(Types.ObjectId(req.params.id))
        );
    } catch (e) {
      next(e);
    }
  };
  private session = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.json({
        token: await this.userService.createSession(req.body),
      });
    } catch (e) {
      next(e);
    }
  };
}
