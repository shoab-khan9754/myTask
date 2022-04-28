const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Schema
const ProductSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    description: {
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
    stock: {
        type: Number,
        required: true
    },
    isDelete:{
        type: Boolean,
        required: true
    },
    attachments:[],
    date: {
        type: Date,
        default: new Date(new Date().toUTCString())
    },
    updatedDate: {
        type: Date,
        default: new Date(new Date().toUTCString())
    },
})

ProductSchema.pre('save', async function (next) {
    if (!this.isNew) {
        //  if the instance in modified and is not new then ----
        this.updatedDate = new Date(new Date().toUTCString());
    } else {
        return next();
    }
});
module.exports = Product = mongoose.model("products", ProductSchema);