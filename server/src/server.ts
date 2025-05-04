import express from "express";
import countRouter from "./routes/count.routes";
require("dotenv").config({ path: "./.env" });
const cors = require("cors");

// intiate express
const app = express();

app.use(express.json());

app.use(cors());

// start count router
app.use("/count", countRouter);

// start server
const port: number = +(process.env.PORT || 8000);
const server = app.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
