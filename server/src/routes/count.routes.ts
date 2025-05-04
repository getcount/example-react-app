import { Router } from "express";
import * as countController from "../controllers/count.controller";

const router = Router();

router.route("/exchange-code").post(countController.exchagneAccessToken);

router.route("/chart-of-accounts").get(countController.chartOfAccounts);

router.route("/vendors").get(countController.vendors);

router.route("/transactions").post(countController.createTransaction);

export default router;
