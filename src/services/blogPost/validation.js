import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";

const blogPostSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category field is missing or is invalid, put a string",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Category field is missing or is invalid, put a string",
    },
  },
  cover: {
    in: ["body"],
    isURL: {
      errorMessage: "Cover field is missing or is invalid, put a valid link",
    },
  },
  "readTime.value": {
    in: ["body"],
    isNumeric: {
      errorMessage:
        "Invalid value, put the amount of minute you need to read this article",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage: "insert a valid time reference(minutes or hours)",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "insert the author name",
    },
  },
};

export const checkBlogPostSchema = checkSchema(blogPostSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    next(
      createError(400, "Validation problems in req.body", {
        errorList: errors.array(),
      })
    );
  } else {
    next();
  }
};
