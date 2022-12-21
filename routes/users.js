const usersController = require("../controller/users");
const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

//sign-up => POST
router.post(
  "/sign-up",
  [
    check("name").isString().isLength({ min: 3, max: 30 }).trim(),
    check("email").isString().isLength({ min: 10, max: 40 }).trim(),
    check("password").isString().isLength({ min: 10, max: 30 }).trim(),
  ],
  usersController.postAddUser
);
//login => POST
router.post(
  "/login",
  [
    check("email").isString().isLength({ min: 10, max: 40 }).trim(),
    check("password").isString().isLength({ min: 3, max: 30 }).trim(),
  ],
  usersController.postLoginUser
);

module.exports = router;
