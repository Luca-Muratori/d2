import express from "express";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { saveAuthorAvatar } from "../../fs-tools/fs-tools.js";
import uniqid from "uniqid";

const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);

const parentFolder = dirname(currentFilePath);

const authorsJSONpath = join(parentFolder, "authors.json");

authorsRouter.post("/", (req, res) => {
  const newAuthor = {
    ...req.body,
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONpath, JSON.stringify(authorsArray));
  res.status(201).send({
    name: newAuthor.name,
    surname: newAuthor.surname,
    email: newAuthor.email,
    dateOfBirth: newAuthor.dateOfBirth,
    id: newAuthor.id,
    avatar: newAuthor.avatar,
  });
});

authorsRouter.post(
  "/:authorId/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      await saveAuthorAvatar(req.file.originalname, req.file.buffer);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONpath);
  const authorsArray = JSON.parse(fileContent);
  res.send(authorsArray);
});

authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const foundauthor = authorsArray.find((author) => author.id === authorId);
  res.send(foundauthor);
});

authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );
  const prePutauthor = authorsArray[index];
  const updatedauthor = { ...prePutauthor, ...req.body, updateAt: new Date() };
  authorsArray[index] = updatedauthor;
  fs.writeFileSync(authorsJSONpath, JSON.stringify(authorsArray));
  res.send(updatedauthor);
});
authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const remainingauthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );
  fs.writeFileSync(authorsJSONpath, JSON.stringify(remainingauthors));
  res.status(204).send();
});

export default authorsRouter;
