const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
   data.user=data.user+"";
   console.log( typeof data.user,Validator.isEmpty(data.user))
  // Convert empty fields to an empty string so we can use validator functions
  data.user = !isEmpty(data.user) ? data.user : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email checks
  if (Validator.isEmpty(data.user)) {
    errors.user = "A valid email or mobile number is required";
  } 
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
