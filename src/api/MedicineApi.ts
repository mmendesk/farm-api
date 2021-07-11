import { Router, Request, Response, NextFunction } from "express";
import { AuthenticationService } from "src/domain/Authentication/authentication.service";
import { MedicineService } from "src/domain/Medicines/medicine.service";
import { authClientMiddleware } from "../middlewares/AuthMiddleware";

export default class MedicineApi {
  public router: Router;
  private medicineService = new MedicineService();
  private authService = new AuthenticationService();
  constructor() {
    this.router = Router();
    this.router.post("/medicine", authClientMiddleware, this.create);
    this.router.put("/medicine/:id", authClientMiddleware, this.update);
    this.router.get("/medicine/all", authClientMiddleware, this.medicine);
    this.router.get("/medicines", authClientMiddleware, this.listRemedy);
    this.router.get("/health", (req, res) => {
      return res.send("Health ok");
    });
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.medicineService.create(req.body);
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
      await this.medicineService.update(req.body, payload.medicineId);
      return res.json({
        msg: "Atualizado com sucesso",
      });
    } catch (e) {
      next(e);
    }
  };

  private listRemedy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.json(await this.medicineService.getMedicines());
    } catch (err) {
      next(err);
    }
  };

  private medicine = async (req: any, res: Response, next: NextFunction) => {
    try {
      return res.json(await this.medicineService.medicineAll());
    } catch (err) {
      next(err);
    }
  };
}
