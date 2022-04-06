import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./authors/authors.js";
import blogPostsRouter from "./blogPost/blogPost.js";
import {
  badRequestErrorHandler,
  unauthorizedErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./handleError.js";

const server = express();

const port = 3001;

//middleWare------------------------------------------------
const loggerMiddleware = (req, res, next) => {
  console.log(`Request method:${req.method}---URL ${req.url}---${new Date()}`);
  next();
};
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
