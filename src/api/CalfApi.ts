import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { AuthenticationService } from "src/domain/Authentication/authentication.service";
import { CalfService } from "src/domain/Calf/calf.service";
import { authClientMiddleware } from "../middlewares/AuthMiddleware";

export default class CalfApi {
  public router: Router;
  private calfService = new CalfService();
  private authService = new AuthenticationService();
  constructor() {
    this.router = Router();
    this.router.post("/calf", authClientMiddleware, this.createCalf);
    this.router.put("/calf/:id", authClientMiddleware, this.updateCalf);
    this.router.get("/calfs", authClientMiddleware, this.listCalf);
    this.router.get("/calf/all", authClientMiddleware, this.calf);
    this.router.get("/calf/:id", authClientMiddleware, this.getCalfById);
    this.router.get("/calf/:id/pdf", this.generatePdf);
    this.router.get("/health", (req, res) => {
      return res.send("Health ok");
    });
  }

  private createCalf = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.calfService.create(req.body);
      return res.json({
        msg: "Criado com sucesso",
      });
    } catch (e) {
      next(e);
    }
  };
  private updateCalf = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = this.authService.getPayload(req);
      await this.calfService.update(req.body, payload.calfId);
      return res.json({
        msg: "Atualizado com sucesso",
      });
    } catch (e) {
      next(e);
    }
  };

  private listCalf = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.json(await this.calfService.getCalfs());
    } catch (err) {
      next(err);
    }
  };

  private calf = async (req: any, res: Response, next: NextFunction) => {
    try {
      return res.json(await this.calfService.calfAll());
    } catch (err) {
      next(err);
    }
  };

  private getCalfById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res
        .status(200)
        .json(
          await this.calfService.getCalfById(Types.ObjectId(req.params.id))
        );
    } catch (e) {
      next(e);
    }
  };

  private generatePdf = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const buffer = await this.calfService.generatePdf(
        Types.ObjectId(req.params.id)
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.params.id}.pdf`
      );
      res.type("application/pdf");
      res.write(buffer);
      res.end();
    } catch (err) {
      next(err);
    }
  };
}
