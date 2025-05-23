require("dotenv").config({ path: `${__dirname}/../.env` });
console.log(process.env.PORT);
import express from "express";
import countRouter from "./routes/count.routes";
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
