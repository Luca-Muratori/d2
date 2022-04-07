import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./services/authors/authors.js";
import blogPostsRouter from "./services/blogPost/blogPost.js";
import {
  badRequestErrorHandler,
  unauthorizedErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./handleError.js";
import { join } from "path";

const server = express();

const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

//middleWare------------------------------------------------
const loggerMiddleware = (req, res, next) => {
  next();
};

server.use(express.static(publicFolderPath));
server.use(loggerMiddleware);
server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

//handleError middleware-------------------------------
server.use(badRequestErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
