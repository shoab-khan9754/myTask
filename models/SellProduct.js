const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Schema
const SellProductSchema = new Schema({
    productId: {
        type: String,
        required: false
    },
    quantity: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    discount_price: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isStockAdded:{
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: new Date(new Date().toUTCString())
    },
    updatedDate: {
        type: Date,
        default: new Date(new Date().toUTCString())
    },
})

SellProductSchema.pre('save', async function (next) {
    if (!this.isNew) {
        //  if the instance in modified and is not new then ----
        this.updatedDate = new Date(new Date().toUTCString());
    } else {
        return next();
    }
});
module.exports = Product = mongoose.model("sellProducts", SellProductSchema);