import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const usersRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);

const parentFolder = dirname(currentFilePath);

const usersJSONpath = join(parentFolder, "user.json");

usersRouter.post("/", (req, res) => {
  const newUser = {
    ...req.body,
    id: uniqid(),
    dateOfBirth: new Date(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

  const usersArray = JSON.parse(fs.readFileSync(usersJSONpath));
  usersArray.push(newUser);
  fs.writeFileSync(usersJSONpath, JSON.stringify(usersArray));
  res.status(201).send({ id: newUser.id });
});

usersRouter.get("/", (req, res) => {
  console.log("hello");
  const fileContent = fs.readFileSync(usersJSONpath);
  const usersArray = JSON.parse(fileContent);
  res.send(usersArray);
});

usersRouter.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const usersArray = JSON.parse(fs.readFileSync(usersJSONpath));
  const foundUser = usersArray.find((user) => user.id === userId);
  res.send(foundUser);
});

usersRouter.put("/:userId", (req, res) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONpath));
  const index = usersArray.findIndex((user) => user.id === req.params.userId);
  const prePutUser = usersArray[index];
  const updatedUser = { ...prePutUser, ...req.body, updateAt: new Date() };
  usersArray[index] = updatedUser;
  fs.writeFileSync(usersJSONpath, JSON.stringify(usersArray));
  res.send(updatedUser);
});
usersRouter.delete("/:userId", (req, res) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONpath));
  const remainingUsers = usersArray.filter(
    (user) => user.id !== req.params.userId
  );
  fs.writeFileSync(usersJSONpath, JSON.stringify(remainingUsers));
  res.status(204).send();
});

export default usersRouter;
