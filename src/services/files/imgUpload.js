// import express from "express";
// import multer from "multer";
// import { saveBlogPostCover, saveAuthorAvatar } from "../../fs-tools/fs-tools";

// const authorsAvatarUpload = express.Router();

// authorsAvatarUpload.post(
//   "/:authorId/uploadAvatar",
//   multer().single("avatar"),
//   async (req, res, next) => {
//     try {
//       await saveAuthorAvatar(req.file.originalname, req.file.buffer);
//       res.send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );
