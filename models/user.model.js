const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Parolni saqlashdan oldin hash qilish
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

// Parolni tekshirish uchun method
userSchema.methods.comparePassword = function (candidataPassword) {
  return bcrypt.compare(candidataPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);
