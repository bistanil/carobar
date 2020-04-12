const express = require("express");
const router = express.Router();
const { verifyJWT_MW } = require("../auth/middleware");
const validator = require("validator").default;
var fs = require('fs');
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

router.all("*", verifyJWT_MW);

// User model
const Cars = require("../models/cars");

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

router.post("/add", (req, res) => {
  
  upload(req, res, function (err) {
    console.log(req.body, req.file);
    if (err instanceof multer.MulterError) {
      res.status(500).json({ message: err });
    } else if (err) {
      res.status(500).json({ message: err });
    } else {
      if (
        !validator.isNumeric(req.body.amount) &&
        validator.isEmpty(req.body.carName) &&
        validator.isEmpty(req.body.userId)
      ) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({
          success: false,
          message: "One or more fields could not be validated",
        });
      } else {
        const newCar = new Cars({
          carName: req.body.carName,
          userId: req.body.userId,
          amount: req.body.amount,
          image: req.file.filename,
        });

        newCar
          .save()
          .then((car) => {
            res.status(200).json({
              success: true,
              car: car,
            });
          })
          .catch((err) => {
            fs.unlinkSync(req.file.path)
            res.json({ error: err })
          });
      }
      // res.status(200).json({message:"Some Error Occurred"})
    }
  });
  // res.status(200).json({message:"Got Some Erros"})
});

module.exports = router;
