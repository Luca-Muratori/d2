import express from "express";
import listEndpoints from "express-list-endpoints";
import userRouter from "./users/users.js";

const server = express();

const port = 3000;

server.use(express.json());

server.use("/users", userRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on ${port}`);
});

console.log(userRouter);
