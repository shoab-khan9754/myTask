const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const cors = require("cors");
var fs = require("fs");
var app = express();
var ObjectId = require("mongodb").ObjectID;
const passport=require("passport")

app.use(cors());
const multer = require("multer");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
// Image Upload with Multer
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      
      const path = `public/uploads/profilePictures/`;
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/GIF" ||
      file.mimetype == "image/PNG" ||
      file.mimetype == "image/JPG" ||
      file.mimetype == "image/JPEG"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .gif, .jpg and .jpeg format allowed!"));
    }
    cb(undefined, true); // continue with upload
  },
});

// @route POST api/users/uploadProfilePic
// @desc  before Register user
// @access Public
//this responce used to api/users/register api as a image
router.post( "/uploadProfilePic",
  upload.single("file"),
  async (req, res, next) => {
    const { path, mimetype } = req.file;
    const { email } = req.body;
    res.status(200).send(path);
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", cors(), (req, res, next) => {
  // Form validation
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name, 
          profileImage: req.body.image,
          mobileNumber:req.body.mobileNumber
        });

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                var resetToken = user._id;
                console.log(resetToken);
                const nodemailer = require("nodemailer");
                async function main() {
                  // create reusable transporter object using the default SMTP transport
                  let transporter = nodemailer.createTransport({
                    host: "smtp.office365.com",
                    port: 587,
                    secure: false,
                    auth: {
                      user: "nagios@apoyar.eu",
                      pass: "Ap0yar4321",
                    },
                  });

                  let info = await transporter.sendMail({
                    from: '"Purchase Order" <no-reply@supportpod.com>',
                    to: req.body.email,
                    subject: "Dignizant Technologies Purchase Order Email Verification ",
                    html:
                      '<table style="border: 4px solid #348cce;padding:25px; margin: 0 auto;"><tr><th style="border-bottom: 1px solid lightgrey;text-align:left;padding: 8px;"></th></tr><tbody style="border: none!important"><tr><td> </td> </tr><tr  style="border: none!important"><td  style="height:40px;border: none!important">Dear ' +
                      user.firstname + " " + user.lastname +
                      ',</td></tr><tr><td style="height:35px;">Please click the below link to verify your email id, you will be redirected to the login page after successful verification of your email id <a href="http://localhost:4000/api/users/confirmEmail?confirmId=' +
                      resetToken +
                      '">Click Here</a>. </td> </tr><tr><td style="height:100px;">Regards,<br><br>Dignizant Technologies Purchase Order teams</td></tr><tr></tr></tbody></table>',
                  });

                  if (info.messageId) {
                    res.send("email sent");
                  } else {
                    res.send("email not sent");
                  }
                }

                main().catch(console.error);
                res.json(user);
              })
              .catch((err) => {
                console.log(err);
                  return res
                    .status(500)
                    .json({ err: err });
                // }
              });
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      // success: false,
      data: error,
    });
  }
});

// confirm email verification

router.get("/confirmEmail", cors(), (req, res, next) => {
  // console.log("req", req);
  try {
    User.findOne({ _id: ObjectId(req.query.confirmId) }).then((user) => {
      if (!user) {
        return res.status(400).json({ email: "Confirmation code invalid" });
      } else {
        User.findOneAndUpdate(
          { _id: ObjectId(req.query.confirmId) },
          { $set: { isEmailVerified: true } },
          { new: true }
        )
          .then((user) => {
            res.json(user);
          })
          .catch((err) => console.log(err));
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      // success: false,
      data: error,
    });
  }
});
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", cors(), (req, res, next) => {
  // Form validation
  try {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.user;
    const query={};
    if(email.includes('@')==true){
        query.email=req.body.user;
    }else{
      query.mobileNumber=parseInt(req.body.user);
    }
    const password = req.body.password;
    let users;
    // Find user by email
    User.findOne( query).then(async(user) => {
      // Check if user exists
      if (!user) {
            return res
            .status(404)
            .json({ emailAndMobileNotFound: "Please enter a valid email or Mobile Number" });
           }
      if (!user.isEmailVerified) {
        return res
          .status(404)
          .json({ emailnotVerified: "Please verify your email" });
      }
      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            mobileNumber: user.mobileNumber,
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                user: user,
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Please provide correct password" });
        }
      });
    });
  } catch (error) {
    console.log(error);
    return res.json({
      // success: false,
      data: error,
    });
  }
});

router.post("/updateProfile",passport.authenticate("jwt", { session: false }), cors(), async (req, res, next) => {
  try {
    User.findOne({ email: req.user.email }).then((user) => {
      // console.log("update profile user", user);

      if (!user) {
        return res.status(400).json({ email: "Email does not exists" });
      } else {

        User.findOneAndUpdate(
          { email: req.user.email },
          {
            $set:{ 
              name: req.body.name ||req.user.name, 
              profileImage: req.body.image || req.user.profileImage,
              mobileNumber:req.body.mobileNumber || req.user.mobileNumber},
          },
          { new: true }
        )
          .then(async (result) => {
                  return res.json(result)
          })
          .catch((error) => console.error(error.response.data));
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "something went wrong!", error: error });
  }
});

module.exports = router;
