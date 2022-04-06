import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./authors/authors.js";
import blogPostsRouter from "./blogPost/blogPost.js";

const server = express();

const port = 3001;

server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogPost", blogPostsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
