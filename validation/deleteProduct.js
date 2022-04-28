const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateDeleteProduct(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.productId= !isEmpty(data.productId)? data.productId: "" ;
 
  
  if (Validator.isEmpty(data.productId)) {
    errors.title = "product Id is required";
  } 

  return {
    errors,
    isValid: isEmpty(errors)
  };
};