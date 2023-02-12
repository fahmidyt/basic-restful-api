import Express, { Request, Response } from "express";
import { APP_NAME, BASE_URL } from "../constants/ConstEnv";

const route = Express.Router();

interface IndexResponseData {
  message: string;
  maintainer: string;
  source: string;
  docs?: string;
}

// index route
route.get("/", function (req: Request, res: Response) {
  let data: IndexResponseData = {
    message: `Welcome to ${APP_NAME} Service!`,
    maintainer: "fahmidyt, <fmidyt@gmail.com> <https://github.com/fahmidyt>",
      docs: `${BASE_URL}/v1/api-docs`,
      source: "https://github.com/fahmidyt/basic-restful-api",
  };


  return res.status(200).json(data);
});

export default route;
