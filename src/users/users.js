import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const userRouter = express();

const currentFilePath = fileURLToPath(import.meta.url);

const parentFolder = dirname(currentFilePath);

const usersJSONpath = join(parentFolder, "user.json");

userRouter.post("/", (req, res) => {
  console.log(req.body);
});

userRouter.get("/", (req, res) => {});

userRouter.get("/", (req, res) => {});

userRouter.put("/", (req, res) => {});
userRouter.delete("/", (req, res) => {});

export default userRouter;
