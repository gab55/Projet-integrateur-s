const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const COST_BCRYPT = 10;

async function register({name,firstName,email,password}){
    const passwordHash = await bcrypt.hash(password,COST_BCRYPT);
    const user = await User.create({
        name,
        firstName,
        email,
        passwordHash,
    });
    return user;
}

async function login({email,password}){
    const user = await User.findOne({email}).select("+passwordHash");
    if (!user) throw new Error("Invalid identifiers");

    const valid = await bcrypt.compare(password,user.passwordHash);
    if (!valid) throw new Error("Invalid identifiers");

    const token = jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE || "2h"}
    );

    return { token, user };
}

async function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { register, login, verify };