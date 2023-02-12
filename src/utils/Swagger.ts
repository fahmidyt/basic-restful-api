import fs from "fs";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

import { APP_NAME, BASE_URL } from "../constants/ConstEnv";

const DOCS_PATH = `${__dirname}/../../docs/routes`;

// create docs directory if not exist!
if (!fs.existsSync(DOCS_PATH)) fs.mkdirSync(DOCS_PATH, { recursive: true });

const baseRoutes = path.resolve(DOCS_PATH);

// get every docs inside './docs/routes'
const getDocs = (basePath: string | Buffer): any => {
  return fs.readdirSync(basePath).reduce((acc, file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require(`${baseRoutes}/${file}`);
    acc = {
      ...acc,
      ...data,
    };
    return acc;
  }, {});
};

const docsSources = getDocs(baseRoutes);

const baseURLServer = [
  {
    url: `${BASE_URL}/v1`,
    description: `Fahmidyt Server made by ❤️`,
  },
];

const swaggerOptURL = [
  {
    url: `${BASE_URL}/v1/api-docs.json`,
    name: `Fahmidyt Server made by ❤️`,
  },
];

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    info: {
      title: `Api ${APP_NAME} Docs`,
      description: `This is Api Documentation - ${APP_NAME}`,
      version: "1.0.0",
    },
    openapi: "3.0.1",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    servers: baseURLServer,
    paths: docsSources,
  },
  apis: [],
};

export const swaggerDoc = swaggerJSDoc(swaggerOptions);
export const optionsSwaggerUI = {
  explorer: true,
  swaggerOptions: { urls: swaggerOptURL },
};
