import express from "express";
import { fileURLToPath } from "url";
import fs from "fs";
import { dirname, join } from "path";
import uniqid from "uniqid";

const blogPostsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);

const parentFolder = dirname(currentFilePath);

const blogPostsJSONPath = join(parentFolder, "blogPost.json");

blogPostsRouter.post("/", (req, res) => {
  const newBlogPost = {
    ...req.body,
    _id: uniqid(),
    author: {
      avatar: `https://ui-avatars.com/api/?name=${req.body.name}`,
    },
    content: "HTML",
    createdAt: new Date(),
  };

  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath));
  blogPostsArray.push(newBlogPost);
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));
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
});
blogPostsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(blogPostsJSONPath);
  const blogPostsArray = JSON.parse(fileContent);
  res.send(blogPostsArray);
});
blogPostsRouter.get("/:blogPostId", (req, res) => {
  const blogPostId = req.params.blogPostId;
  const fileContent = fs.readFileSync(blogPostsJSONPath);
  const blogPostsArray = JSON.parse(fileContent);
  const findAuthor = blogPostsArray.find((author) => author.id === blogPostId);
  res.send(findAuthor);
});
blogPostsRouter.put("/:blogPostId", (req, res) => {
  const fileContent = fs.readFileSync(blogPostsJSONPath);
  const blogPostsArray = JSON.parse(fileContent);
  const index = blogPostsArray.findIndex(
    (blogPost) => blogPost._id === req.params.blogPostId
  );
});
blogPostsRouter.delete("/:blogPostId", (req, res) => {
  const fileContent = fs.readFileSync(blogPostsJSONPath);
  const blogPostsArray = JSON.parse(fileContent);
  const remainingBlogPosts = blogPostsArray.filter(
    (blogPost) => blogPost._id !== req.params._id
  );
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(remainingBlogPosts));
  res.status(201).send();
});

export default blogPostsRouter;
