const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const COST_BCRYPT = 10;
const secretKey = process.env.JWT_SECRET;

async function register({name,firstName,email,password, nip}){
    if (password.length < 8) throw new Error("Password needs to be more than 8 characters");
    const passwordHash = await bcrypt.hash(password,COST_BCRYPT);
    const nipHash = await bcrypt.hash(nip,COST_BCRYPT);
    const user = await User.create({
        name,
        firstName,
        email,
        passwordHash,
        nipHash,
    });
    return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+passwordHash +loginAttempts +lockedUntil");
  if (!user) throw new Error("Invalid identifiers");

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil - new Date()) / 60000);
    throw new Error(`Account locked. Try again in ${minutesLeft} minute(s).`);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 3) {
      user.lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
    }
    await user.save();
    throw new Error("Invalid identifiers");
  }

  user.loginAttempts = 0;
  user.lockedUntil = null;
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "24h" }
  );

  return { token, user };
}

async function verify(token) {
  return jwt.verify(token, secretKey);
}

module.exports = { register, login, verify };