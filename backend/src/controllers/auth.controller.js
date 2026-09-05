const authService = require("../services/auth.service");
const User =  require("../models/User");

async function register(req, res, next){
    try{
        const user = await authService.register(req.body);
        res.status(201).json({user});
    }catch(err){
        next(err);
    }
}

async function login(req, res, next) {
  try {
    const { token, user } = await authService.login(req.body);
    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };