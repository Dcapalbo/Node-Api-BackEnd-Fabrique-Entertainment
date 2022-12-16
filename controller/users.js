const { validationResult } = require("express-validator");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// POST => Adding a User
exports.postAddUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  const errors = validationResult(req);

  // if there are errors
  if (!errors.isEmpty()) {
    console.log("POST adding users errors: ", errors.array());
    res.status(422).send("input users it's invalid");
    // then return the status and the route
    return {
      //   hasError: true,
      user: {
        name,
        email,
        password,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    };
  }

  const user = new User({
    name,
    email,
    password,
  });
  // saving the data inside the db
  user
    .save()
    .then((users) => {
      // response from the server with the render method and passing an object
      console.log("User has been created");
      res.status(201).send(users);
    })
    // catching errors
    .catch((err) => {
      console.log("something went wrong, here the error: ", err);
      res.status(500).send(err);
    });
};
// POST => Login in the User
exports.postLoginUser = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (user && isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret1992_25_03"
    );

    console.log("Here my login token: ", token);
    return res.json({ status: "ok", token });
  } else {
    console.log("Here my User error: ", token);
    return res.json({
      status: "ko",
      user: token,
    });
  }
};
