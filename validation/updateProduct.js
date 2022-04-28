const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateProduct(data) {
  let errors = {};
  //convert int to string
  data.price=data.price+"";
  data.discount_price=data.discount_price+"";
  data.stock=data.stock+"";
  // Convert empty fields to an empty string so we can use validator functions
  data.productId= !isEmpty(data.productId)? data.productId: "" ;
  data.title=! isEmpty(data.title)? data.title: "";
  data.description= !isEmpty(data.description)? data.description: "";
  data.price=!isEmpty(data.price)? data.price: "";
  data.discount_price= !isEmpty(data.discount_price)? data.discount_price: "" ;
  data.stock=!isEmpty(data.stock)? data.stock: "" ;
  
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title is required";
  } 
  if (Validator.isEmpty(data.productId)) {
    errors.productId = "Product Id is required";
  } 
  
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description is required";
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "price is required";
  }

  if (Validator.isEmpty(data.discount_price)) {
    errors.discount_price = "discount price is required";
  }
  if (Validator.isEmpty(data.stock)) {
    errors.stock = "Stock is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

