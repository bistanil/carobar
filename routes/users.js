const express = require("express");
const router = express.Router();
const secretKey = require("../config.json").secretKey;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User model
const Users = require("../models/users");

// @route   GET /api/users/
// @desc    Get all users
// @access  Public
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
  Users.findOne({ email }).then((user) => {
    // console.log(newUser);
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    user.comparePassword(password, function (err, isMatch) {
      console.log(err, isMatch);
      if (err) return err;
      console.log(password, isMatch); // -&gt; Password123: true
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user["_id"],
          first_name: user["first_name"],
          last_name: user["last_name"],
          email: user["email"],
          phone: user["phone"],
          user_type: user["user_type"],
        };
        // Sign token
        jwt.sign(
          payload,
          secretKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
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

          jwt.sign(
            payload,
            secretKey,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              return res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
          // return res.json(payload)
        })
        .catch((err) => res.json({ error: err }));
    }
  });
  
});

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body);
    res.send({ message: "The user was updated" });
  } catch (err) {
    res.status(400).send({ error: err });
  }
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
