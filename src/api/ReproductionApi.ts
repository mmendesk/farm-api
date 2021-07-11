import { Router, Request, Response, NextFunction } from "express";
import { AuthenticationService } from "src/domain/Authentication/authentication.service";
import { ReproctionService } from "src/domain/Reproduction/reproduction.service";
import { authClientMiddleware } from "../middlewares/AuthMiddleware";

export default class ReproductionApi {
  public router: Router;
  private reproctionService = new ReproctionService();
  private authService = new AuthenticationService();
  constructor() {
    this.router = Router();
    this.router.post("/reproduction", authClientMiddleware, this.create);
    this.router.get(
      "/reproduction/all",
      authClientMiddleware,
      this.reproduction
    );
    this.router.put("/reproduction/:id", authClientMiddleware, this.update);
    this.router.get(
      "/reproduction",
      authClientMiddleware,
      this.listReproduction
    );
    this.router.get("/health", (req, res) => {
      return res.send("Health ok");
    });
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.reproctionService.create(req.body);
      return res.json({
        msg: "Criado com sucesso",
      });
    } catch (e) {
      next(e);
    }
  };
  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = this.authService.getPayload(req);
      await this.reproctionService.update(req.body, payload.reproId);
      return res.json({
        msg: "Atualizado com sucesso",
      });
    } catch (e) {
      next(e);
    }
  };

  private listReproduction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.json(await this.reproctionService.getReproduction());
    } catch (err) {
      next(err);
    }
  };

  private reproduction = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.json(await this.reproctionService.reproAll());
    } catch (err) {
      next(err);
    }
  };
}
