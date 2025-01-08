const validaor = require("validator");
const validateUserSignUpData = (data) => {
  const { firstName, lastName, email, password } = data;
  if (!firstName || !lastName) {
    throw new Error("First name is required");
  }
  if (!validaor.isEmail(email)) {
    throw new Error("Email is required and should be valid");
  }
  if (!validaor.isStrongPassword(password)) {
    throw new Error("Password is required and should be strong");
  }
};

module.exports = { validateUserSignUpData };
