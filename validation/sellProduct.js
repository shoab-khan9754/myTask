const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateSellProduct(data) {
  let errors = {};
  //convert int to string
  data.price=data.price+"";
  data.discount_price=data.discount_price+"";
  data.totalPrice=data.totalPrice+"";
  data.quantity=data.quantity+"";
  // Convert empty fields to an empty string so we can use validator functions
  data.productId= !isEmpty(data.productId)? data.productId: "" ;
  data.quantity=! isEmpty(data.quantity)? data.quantity: "";
  data.totalPrice= !isEmpty(data.totalPrice)? data.totalPrice: "";
  data.price=!isEmpty(data.price)? data.price: "";
  data.discount_price= !isEmpty(data.discount_price)? data.discount_price: "" ;
  
  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = "quantity is required";
  } 
  if (Validator.isEmpty(data.productId)) {
    errors.productId = "Product Id is required";
  } 
  
  if (Validator.isEmpty(data.totalPrice)) {
    errors.totalPrice = "totalPrice is required";
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "price is required";
  }

  if (Validator.isEmpty(data.discount_price)) {
    errors.discount_price = "discount price is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

