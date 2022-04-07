import express from "express";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  getAuthors,
  writeAuthors,
  saveAuthorAvatar,
} from "../../fs-tools/fs-tools.js";
import uniqid from "uniqid";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res) => {
  try {
    const newAuthor = {
      ...req.body,
      id: uniqid(),
      avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
    };

    const authorsArray = await getAuthors();
    authorsArray.push(newAuthor);
    await writeAuthors(authorsArray);
    res.status(201).send({
      name: newAuthor.name,
      surname: newAuthor.surname,
      email: newAuthor.email,
      dateOfBirth: newAuthor.dateOfBirth,
      id: newAuthor.id,
      avatar: newAuthor.avatar,
    });
  } catch (error) {
    next(err);
  }
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

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    if (req.query && req.query.category) {
      const filteredAuthors = authors.filter(
        (author) => author.category.name === req.query.category
      );
      res.send(filteredBlogPosts);
    } else {
      res.send(authors);
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const findAuthors = authors.find(
      (authors) => authors._id === req.params.authorsId
    );
    if (findAuthors) {
      res.send(findAuthors);
    } else {
      next(createError(404, `Book with id ${req.params.authorsId}`));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const index = authors.findIndex(
      (authors) => authors._id === req.params.authorsId
    );
    const oldAuthors = authors[index];
    const updatedAuthors = {
      ...oldAuthors,
      ...req.body,
      updatedAt: new Date(),
    };

    authors[index] = updatedAuthors;
    await writeAuthors(authors);
    res.send(updatedAuthors);
  } catch (error) {
    next(error);
  }
});
authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const remainingAuthors = authors.filter(
      (authors) => authors._id !== req.params.authorsId
    );
    await writeAuthors(remainingAuthors);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
