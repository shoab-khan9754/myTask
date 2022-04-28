const express = require("express");
const router = express.Router();
const cors = require("cors");
var app = express();
var ObjectId = require("mongodb").ObjectID;
var cron = require("node-cron");
app.use(cors());

// Load input validation
const validateSellProduct = require("../../validation/sellProduct");
// const 
// Load User model
const SellProduct = require("../../models/SellProduct");
const Product = require("../../models/Product");

//update cron every 5 minutes
cron.schedule("*/30 * * * * *", () => {
    console.log("update status cron running");
    SellProduct.find({ isStockAdded: false }).then(async (pro) => {
        
        for(const product1 of pro){
            // console.log('dddddddddd',product1.productId)
            await Product.findOne({ _id: ObjectId(product1.productId) }).then(async (product) => {
                // console.log(product.stock-product1.quantity)
                const stock=product.stock-product1.quantity;
                Product.findOneAndUpdate({ _id: ObjectId(product1.productId) }, {
                    $set: {
                        stock:stock
            },
                }, {
                    new: true
                }).then((r)=>{
                    // console.log('fffffff',r)
                })
            })
            SellProduct.findOneAndUpdate({ _id: ObjectId(product1._id) }, {
                $set: {
                    isStockAdded:true
        },
            }, {
                new: true
            })
        }
        
    })
});
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/addSellProduct", cors(), (req, res, next) => {
    // Form validation
    try {
        const { errors, isValid } = validateSellProduct(req.body);
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const newSellProduct = new SellProduct({
            productId: req.body.productId,
            quantity: req.body.quantity,
            price: req.body.price,
            discount_price: req.body.discount_price,
            totalPrice: req.body.totalPrice,
            isStockAdded: false
        });

        newSellProduct
            .save()
            .then((sellProduct) => {
                return res.json("Purchase Successsfully");
            });
    } catch (error) {
        console.log(error);
        return res.json({
            // success: false,
            data: error,
        });
    }
});

module.exports = router;