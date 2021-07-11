import * as express from "express";
import ErrorHandler from "./handlers/ErrorHandler";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { connect as MongooseConnection } from "./MongooseConnection";
const env = process.env.NODE_ENV || "development";
const app = express();

(async () => {
  console.log("Connecting in MongoDB");
  const mongoConnected = await MongooseConnection();
  if (!mongoConnected) {
    console.log("[Core] MongoDB connect failed");
    process.exit();
  }

  console.log("MongoDB connect success");

  if (env === "production") app.use(logger("common"));
  else if (env === "development") app.use(logger("dev"));
})();

const errorsHandlers = new ErrorHandler();

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", require("./routes"));
app.use(errorsHandlers.errorHandler);
app.use(errorsHandlers.router);

export default app;
