//Requirements

const mongoose = require("mongoose");
const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

// validators

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const createIntern = async function (req, res) {
  try {
    const requestBody = req.body;

    // Body Validation

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide intern details" });
    }

    // Destructuring body

    const { name, email, mobile, collegeName } = requestBody;

    // Validation Starts

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a Name" });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required" });
    }
    let checkEmail = await internModel.findOne({ email: requestBody.email });
    if (checkEmail)
      return res
        .status(400)
        .send({ status: false, message: "Email already exist" });

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is not in correct format" });
    }

    if (!isValid(mobile)) {
      return res
        .status(400)
        .send({ Status: false, message: "Mobile Number is required" });
    }
    let checkMobile = await internModel.findOne({ mobile: requestBody.mobile });
    if (checkMobile)
      return res
        .status(400)
        .send({ status: false, message: "Mobile Number already exist" });

    if (!(/^((\+91?)?0?)?[6-9]\d{9}$/.test(mobile))) {
      return res.status(400).send({
        status: false,
        message: "Mobile Number is not in correct format",
      });
    }

    if (!isValid(collegeName)) {
      return res
        .status(400)
        .send({ status: false, message: "College Name is required" });
    }

    let collegeId = await collegeModel
      .findOne({ name: collegeName })
      .select({ _id: 1 });
    // console.log(collegeId)
    if (!collegeId)
      return res
        .status(400)
        .send({ status: false, message: "College doesn't exist" });

    let obj = {
      name: name,
      email: email,
      mobile: mobile,
      collegeId: collegeId._id,
    };

    //Creating Intern

    const intern = await internModel.create(obj);

    res.status(201).send({
      status: true,
      message: "Intern created successfully",
      data: intern,
    });
  } catch (error) {
    res.status(500).send({ status: false, messsage: error.message });
  }
};

module.exports.createIntern = createIntern;
