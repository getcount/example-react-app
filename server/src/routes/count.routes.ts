import { Router } from "express";
import * as countController from "../controllers/count.controller";

const router = Router();

router.route("/exchange-code").post(countController.exchagneAccessToken);

router.route("/connection-details").get(countController.countWorkspaceDetails);

router.route("/chart-of-accounts").get(countController.chartOfAccounts);

router.route("/vendors").get(countController.vendors);

router.route("/transactions").post(countController.createTransaction);

router.route("/bills").post(countController.createBill);

export default router;
