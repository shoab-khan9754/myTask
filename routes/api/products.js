const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const cors = require("cors");
var fs = require("fs");
var app = express();
var ObjectId = require("mongodb").ObjectID;
const passport = require("passport");

app.use(cors());
const multer = require("multer");

// Load input validation
const validateCreateProduct = require("../../validation/product");
const validateUpdateProduct = require("../../validation/updateProduct");
const validateDeleteProduct = require("../../validation/deleteProduct");
const validateUploadAttachment = require("../../validation/uploadAttachments");
// const 
// Load User model
const Product = require("../../models/Product");
// const
// Image Upload with Multer
const uploadProductImage = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {

      const path = `public/uploads/${req.body.productId}/`;
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
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/addProduct", passport.authenticate("jwt", { session: false }), cors(), (req, res, next) => {
  // Form validation
  try {
    const { errors, isValid } = validateCreateProduct(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discount_price: req.body.discount_price || 0,
      stock: req.body.stock || 0,
      isDelete: false
    });

    newProduct
      .save()
      .then((product) => {
        return res.json(product);
      });
  } catch (error) {
    console.log(error);
    return res.json({
      // success: false,
      data: error,
    });
  }
});

// upload file with attachments
router.post("/uploadProductImages",
  uploadProductImage.array("file"),
  async (req, res, next) => {
    try {
      const { errors, isValid } = validateUploadAttachment(req.body);
      // Check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      Product.findOne({ _id: ObjectId(req.body.productId) }).then(async (product) => {
        if (product) {
          const paths = [];
          product.attachments.forEach((ele) => {
            if (ele != "") {
              paths.push(ele);
            }
          })
          req.files.forEach((file) => {
            const { path } = file;
            paths.push(path);
          });
          Product.findOneAndUpdate(
            { _id: ObjectId(req.body.productId) },
            {
              $set: {
                attachments: paths,
              },
            },
            { new: true }
          ).then((user) => {
            console.log(user);
            return res.status(200).send(paths);
          });

        }
      })
    } catch (error) {
      console.log(error);
      return res.json({
        // success: false,
        data: error,
      });
    }
  },
  (error, req, res, next) => {
    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
);
//update Product 
router.post("/updateProduct", passport.authenticate("jwt", { session: false }), cors(), (req, res, next) => {
  // Form validation
  try {
    const { errors, isValid } = validateUpdateProduct(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Product.findOne({ _id: ObjectId(req.body.productId) }).then((product) => {
      if (!product) {
        return res.status(400).json({ product: "Product does not exists" });
      }
      Product.findOneAndUpdate({ _id: ObjectId(req.body.productId) }, {
        $set: {
          title: req.body.title || product.title,
          description: req.body.description || product.description,
          price: req.body.price || product.price,
          discount_price: req.body.discount_price || product.discount_price,
          stock: req.body.stock || product.stock,
          attachments: req.body.attachments || product.attachments,
        }
      }, { new: true }).then((pro) => {
        return res.json(pro);
      })
    })


  } catch (error) {
    console.log(error);
    return res.json({
      // success: false,
      data: error,
    });
  }
});
// delete Product
router.post("/deleteProduct", passport.authenticate("jwt", { session: false }), cors(), (req, res, next) => {
  // Form validation
  try {
    const { errors, isValid } = validateDeleteProduct(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Product.findOne({ _id: ObjectId(req.body.productId) }).then((product) => {
      if (!product) {
        return res.status(400).json({ product: "Product does not exists" });
      }
      if (product.stock != 0) {
        return res.status(400).json({ product: "Product Can not delete Stock is available" });
      }
      Product.findOneAndUpdate({ _id: ObjectId(req.body.productId) }, {
        $set: {
          isDelete: true
        }
      }, { new: true }).then((pro) => {
        return res.json("Product Delete Successfully");
      })
    })


  } catch (error) {
    console.log(error);
    return res.json({
      // success: false,
      data: error,
    });
  }
});
// get Product 
router.get('/getProduct', cors(), (req, res, next) => {
  var perPage = 10, page = Math.max(0, req.query.page)
  var pageSize = req.query.page,nextPage;
  if(req.query.page>2){
    pageSize=pageSize-1
  }
  
  const query = {};
  if(req.query.title){
    query.title = { $regex: req.query.title, $options: "i" }
  }
  if(req.query.price){
    query.price =req.query.price

  }
  Product.find(query)
  .limit(perPage)
  .then(async(product) => {
   Product.count().then((d)=>{
    if(req.query.page<(d/10)){
      nextPage=req.query.page+1
    }
    return res.json({ rows: product, pagination: { current: req.query.page, numberPerPage:perPage , has_previous: page - 1, previous: page - 1, has_next:page+1 , next: page + 1, last_page: Math.ceil(product / 10) } })
   });
    // return res.json(product);
  })
})
module.exports = router;