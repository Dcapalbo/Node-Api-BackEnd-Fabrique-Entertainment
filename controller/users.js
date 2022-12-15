const User = require("../model/user");
const { validationResult } = require("express-validator");

// POST => Adding a User
exports.postAddUser = (req, res) => {
  // req.body it is a request which fly to the name of the views input and take the informations from there (look inside the view edit-product)
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

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
  // req.body it is a request which fly to the name of the views input and take the informations from there (look inside the view edit-product)
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    console.log("Here my User data: ", user);
    return res.json({ status: "ok", user: "User found" });
  } else {
    console.log("Here my User error: ", user);
    return res.json({
      status: "ko",
      user: "User not found",
    });
  }
};
