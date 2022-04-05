import express from "express";
import listEndpoints from "express-list-endpoints";
import usersRouter from "./users/users.js";

const server = express();

const port = 3001;

server.use(express.json());

server.use("/users", usersRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
