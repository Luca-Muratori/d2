import createError from "http-errors";
import express from "express";
import multer from "multer";
import {
  getBlogPosts,
  writeBlogPosts,
  saveBlogPostCover,
} from "../../fs-tools/fs-tools.js";
import { checkBlogPostSchema, checkValidationResult } from "./validation.js";
import uniqid from "uniqid";

const blogPostsRouter = express.Router();
blogPostsRouter.post(
  "/",
  checkBlogPostSchema,
  checkValidationResult,
  async (req, res, next) => {
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

      const blogPosts = await getBlogPosts();
      console.log(blogPosts);
      blogPosts.push(newBlogPost);
      await writeBlogPosts(blogPosts);
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
      const blogPosts = await getBlogPosts();

      const cover = `http://localhost:3001/img/cover/${req.file.originalname}`;
      const findBlogPost = blogPosts.find(
        (blogPost) => blogPost._id === req.params.blogPostId
      );
      console.log(findBlogPost);
      if (findBlogPost) {
        findBlogPost.cover = cover;
        await writeBlogPosts(blogPosts);
        res.send(findBlogPost);
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.post("/:blogPostId/comments", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const findBlogPost = blogPosts.find(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    const comment = findBlogPost.comment;
    console.log(comment);
    const newComment = {
      ...req.body,
    };
    comment.push(newComment);
    res.status(201).send({
      text: newComment.text,
      title: newComment.title,
    });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostId/comments", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const findBlogPost = blogPosts.find(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    const comments = findBlogPost.comments;
    if (findBlogPost) {
      res.send(comments);
    } else {
      next(createError(404, `Book with id ${req.params.blogPostId}`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
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

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
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

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
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
    await writeBlogPosts(blogPosts);
    res.send(updatedBlogPost);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await getBlogPosts();
    const remainingBlogposts = blogPost.filter(
      (blogPost) => blogPost._id !== req.params.blogPostId
    );
    await writeBlogPosts(remainingBlogposts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
