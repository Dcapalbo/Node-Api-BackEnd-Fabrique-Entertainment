const usersController = require("../controller/users");
const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

//add-users => POST
router.post(
  "/sign-up",
  [
    check("name").isString().isLength({ min: 3, max: 30 }).trim(),
    check("email").isString().isLength({ min: 10, max: 40 }).trim(),
    check("password").isString().isLength({ min: 3, max: 30 }).trim(),
  ],
  usersController.postAddUser
);

module.exports = router;
