const validaor = require("validator");
const bcrypt = require("bcrypt");

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

const validateUserProfileEditData = (data) => {
  const allowedUpdates = ["age", "skills", "about", "photoUrl"];
  const isValidUpdate = Object.keys(data).every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    throw new Error("Invalid updates");
  }
  return isValidUpdate;
};

const validatePasswordChangeData = async (newPassword, user) => {
  const isValidPassword = false
  const isPasswordMatched = await bcrypt.compare(newPassword, user.password);
  if (validaor.isStrongPassword(newPassword) && !isPasswordMatched) {
    isValidPassword = true;
  }
  return isValidPassword;
};

module.exports = {
  validateUserSignUpData,
  validateUserProfileEditData,
  validatePasswordChangeData,
};
