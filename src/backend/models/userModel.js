const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Bitte geben Sie Ihren Vornamen an"],
  },
  lastName: {
    type: String,
    required: [true, "Bitte geben Sie Ihren Nachnamen an"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Bitte geben Sie einen Nutzernamen an"],
  },
  password: {
    type: String,
    required: [true, "Bitte geben Sie ein Passwort an"],
    minlength: 8,
    select: false,
  },
  preferredAvatar: {
    type: String,
  },
  iban: {
    type: String,
    required: [true, "Bitte geben Sie eine IBAN an"],
    validate: [validator.isIBAN, "Bitte geben Sie eine gültige IBAN ein"],
  },
  balance: {
    type: Number,
    default: 1000,
  },
});

userSchema.pre("save", async function (next) {
  if (this.password !== this.passwordConfirm) {
    console.log("isNotChanged");

    return next();
  }

  console.log("isChanged");
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
