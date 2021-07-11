import * as express from "express";
import UserApi from "../api/UserApi";
import CalfApi from "../api/CalfApi";
import MedicineApi from "src/api/MedicineApi";
import ReproductionApi from "src/api/ReproductionApi";
const router = express.Router();

router.use("/", new UserApi().router);
router.use("/", new CalfApi().router);
router.use("/", new MedicineApi().router);
router.use("/", new ReproductionApi().router);

module.exports = router;
