const express = require("express");
const router = express.Router();
const { verifyJWT_MW } = require("../auth/middleware");
const validator = require("validator").default;
var fs = require('fs');
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "client/public/uploads/");
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

// @route   GET /api/cars/:id
// @desc    Get a specific user
// @access  Public
router.delete("/:id/:carId", async (req, res) => {
  console.log(req.params)
  Cars.findOneAndDelete({userId: req.params.id, _id: req.params.carId})
  .then((cars)=>{
    fs.unlinkSync(`client\\public\\uploads\\${cars.image}`);
    res.status(200).send({ cars });
  })
  .catch((err)=>{
    res.status(404).send({ message: "Car with that Id coul not be found!" });
  })
  
});

// @route   GET /api/cars/:id
// @desc    Get a specific user
// @access  Public
router.get("/:id", async (req, res) => {
  console.log(req.params)
  Cars.find({userId: req.params.id})
  .then((cars)=>{
    res.status(200).send({ cars });
  })
  .catch((err)=>{
    res.status(404).send({ message: "No Cars found!" });
  })
  
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
          chassisNo: req.body.chassisNo,
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
            res.status(500).json({ error: err })
          });
      }
    }
  });
});

module.exports = router;
