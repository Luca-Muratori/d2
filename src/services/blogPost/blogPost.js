import { fileURLToPath } from "url";
import fs from "fs";
import { dirname, join } from "path";
import createError from "http-errors";
import express from "express";
import multer from "multer";
import { saveBlogPostCover } from "../../fs-tools/fs-tools.js";
import { checkBlogPostSchema, checkValidationResult } from "./validation.js";
import uniqid from "uniqid";

const blogPostsRouter = express.Router();

// const currentFilePath = fileURLToPath(import.meta.url);

// const parentFolder = dirname(currentFilePath);

// const blogPostsJSONPath = join(parentFolder, "blogPost.json");

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPost.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPosts = (content) => {
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content));
};

blogPostsRouter.post(
  "/",
  checkBlogPostSchema,
  checkValidationResult,
  (req, res, next) => {
    try {
      const newBlogPost = {
        ...req.body,
        _id: uniqid(),
        author: {
          avatar: `https://ui-avatars.com/api/?name=${req.body.author.name}`,
          name: req.body.author.name,
        },
        content: "HTML",
        createdAt: new Date(),
      };

      const blogPosts = getBlogPosts();
      blogPosts.push(newBlogPost);
      writeBlogPosts(blogPosts);
      res.status(201).send({
        _id: newBlogPost._id,
        category: newBlogPost.category,
        title: newBlogPost.title,
        cover: newBlogPost.cover,
        readTime: {
          value: newBlogPost.readTime.value,
          unit: newBlogPost.readTime.unit,
        },
        author: {
          name: newBlogPost.author.name,
          avatar: newBlogPost.author.avatar,
        },
        content: newBlogPost.content,
        createdAt: newBlogPost.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.post(
  "/:blogPostId/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      await saveBlogPostCover(req.file.originalname, req.file.buffer);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.get("/", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    if (req.query && req.query.category) {
      const filteredBlogPosts = blogPosts.filter(
        (blogPost) => blogPost.category.name == req.query.category
      );
      res.send(filteredBlogPosts);
    } else {
      res.send(blogPosts);
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const findBlogPost = blogPosts.find(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    if (findBlogPost) {
      res.send(findBlogPost);
    } else {
      next(createError(404, `Book with id ${req.params.blogPostId}`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:blogPostId", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const index = blogPosts.findIndex(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    const oldBlogPost = blogPosts[index];
    const updatedBlogPost = {
      ...oldBlogPost,
      ...req.body,
      updatedAt: new Date(),
    };

    blogPosts[index] = updatedBlogPost;
    writeBlogPosts(blogPosts);
    res.send(updatedBlogPost);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", (req, res, next) => {
  try {
    const blogPost = getBlogPosts();
    const remainingBlogposts = blogPost.filter(
      (blogPost) => blogPost._id !== req.params.blogPostId
    );
    writeBlogPosts(remainingBlogposts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
