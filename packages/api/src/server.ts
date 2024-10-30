import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes";
import v1Routes from "./routes/v1Routes";
import setsRoutes from "./routes/setsRoutes";

export const createServer = (): Express => {
  const app = express();
  app
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(v1Routes)
    .use(healthRoutes)
    .use(setsRoutes);

  return app;
};
