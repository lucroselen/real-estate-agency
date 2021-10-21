const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must populate your first and your last name!"],
    validate: {
      validator: function (v) {
        return /^[A-Z][a-z]* [A-Z][a-z]*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  username: {
    type: String,
    required: [true, "Username should not be empty!"],
    minLength: [5, "Username should be at least 5 characters long!"],
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
});

userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;

    next();
  });
});

userSchema.method("validatePassword", function (password) {
  return bcrypt.compare(password, this.password);
});
const User = mongoose.model("User", userSchema);

module.exports = User;
