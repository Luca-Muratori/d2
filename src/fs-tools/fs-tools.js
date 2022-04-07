import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const authorsJSONPath = join(dataFolderPath, "authors.json");
console.log(authorsJSONPath);
const blogPostsJSONPath = join(dataFolderPath, "blogPost.json");
console.log(blogPostsJSONPath);

const authorsFolderPath = join(process.cwd(), "../../public/img/avatar");
const blogPostFolderPath = join(process.cwd(), "../../public/img/blogPost");

export const getBlogPosts = () => readJSON(blogPostsJSONPath);
export const writeBlogPosts = (content) =>
  writeJSON(blogPostsJSONPath, content);
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);

export const saveBlogPostCover = (filename, contentAsBuffer) =>
  writeFile(join(blogPostFolderPath, filename), contentAsBuffer);
export const saveAuthorAvatar = (filename, contentAsBuffer) =>
  writeFile(join(authorsFolderPath, filename), contentAsBuffer);
