const express = require("express");
const router = express.Router();
const { createJWToken } = require("../auth/auth");
const bodyParser = require("body-parser");

// User model
const Users = require("../models/users");

// @route   GET /api/users/
// @desc    Get all users
// @access  Public
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.get("/", async (req, res) => {
  try {
    const users = await Users.find({});
    res.send({ users });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @route   GET /api/users/:id
// @desc    Get a specific user
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    res.status(404).send({ message: "User not found!" });
  }
});

// @route   POST /api/users/llogin
// @desc    Create a user
// @access  Public
router.post("/login", async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  Users.findOne({ email })
    .then((user) =>
      !user ? Promise.reject("User with that email coult not be found.") : user
    )
    .then((user) =>
      !user.comparePassword(password)
        ? Promise.reject("Password incorrect")
        : user
    )
    .then((user) => {
      const payload = {
        id: user["_id"],
        first_name: user["first_name"],
        last_name: user["last_name"],
        email: user["email"],
        phone: user["phone"],
        user_type: user["user_type"],
      };
      res.status(200).json({
        success: true,
        token: createJWToken({
          sessionData: payload,
          maxAge: 3600,
        }),
      });
    })
    .catch((err) => {
      res.status(401).json({
        message:
          err || "Validation failed. Given email and password aren't matching.",
      });
    });
});

// @route   POST /api/users/register
// @desc    Create a user
// @access  Public
router.post("/register", async (req, res) => {
  console.log(req.body);
  Users.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new Users({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        user_type: req.body.user_type,
      });

      newUser
        .save()
        .then((user) => {
          let payload = {
            id: user["_id"],
            first_name: user["first_name"],
            last_name: user["last_name"],
            email: user["email"],
            phone: user["phone"],
            user_type: user["user_type"],
          };

          res.status(200).json({
            success: true,
            token: createJWToken({
              sessionData: payload,
              maxAge: 3600,
            }),
          });
        })
        .catch((err) => res.json({ error: err }));
    }
  });
});

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Public
router.put("/:id", async (req, res) => {
  console.log(req.params, req.body);
  // res.status(400).json({error:new Error("No Error")})
  Users.findOne({ _id: req.params.id }, function (err, user) {
    if (err) {
      res.status(400).json({
        success: false,
      });
      // next(err);
    }
    console.log(user);
    if (user.comparePassword(req.body.currentPassword)) {
      console.log("Matched");
      user.password = req.body.password;
      user.save(function (err) {
        if (err)
          res.status(400).json({
            success: false,
          });
        res.status(200).json({
          success: true,
        });
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Current password did not match",
      });
    }
  });
  // Users.findByIdAndUpdate(
  //   req.params.id,
  //   { password: req.body.currentPassword },
  //   function (err, user) {
  //     if (err) {
  //       return next(err);
  //     } else {
  //       console.log(user.password, req.body.currentPassword);
  //       if (user.comparePassword(req.body.currentPassword)) {
  //         user.password = req.body.password;
  //         user.save(function (err, user) {
  //           if (err) {
  //             res.status(200).json({
  //               success: false,
  //               error: err,
  //             });
  //           } else {
  //             res.status(200).json({
  //               success: true,
  //             });
  //           }
  //         })
  // user
  //   .save()
  //   .then((user) => {
  //     res.status(200).json({
  //       success: true,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(200).json({
  //       success: false,
  //       error: err,
  //     });
  //   });
  //     } else {
  //       res.status(400).json({ error: "Current Password did not match" });
  //     }
  //   }
  // }
  // );
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const removeUser = await Users.findByIdAndRemove(req.params.id);
    res.send({ message: "The user was removed" });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = router;
