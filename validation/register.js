const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.mobileNumber=data.mobileNumber+""
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.mobileNumber = !isEmpty(data.mobileNumber) ? data.mobileNumber : "";
  data.image = !isEmpty(data.image) ? data.image : "";

  // Name checks
  // if (Validator.isEmpty(data.name)) {
  //   errors.name = "Name field is required";
  // }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "A valid email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "A valid email is required";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "A Password must contain between 6 to 30 characters, at least 1number, 1 uppercase and 1 lowercase letter";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "A Password must contain between 6 to 30 characters, at least 1number, 1 uppercase and 1 lowercase letter";
  }
  if (!Validator.isLength(data.password2, { min: 6, max: 30 })) {
    errors.password = "A Password must contain between 6 to 30 characters, at least 1number, 1 uppercase and 1 lowercase letter";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }
  if (Validator.isEmpty(data.mobileNumber)) {
    errors.mobileNumber = "mobileNumber is required";
  }
  if (!Validator.isLength(data.mobileNumber+"", { min: 12, max: 12 })) {
    errors.mobileNumber = "A mobileNumber  with country code for example 919********6";
  }
  if (Validator.isEmpty(data.image)) {
    errors.image = "Image is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
