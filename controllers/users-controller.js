const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch(err) {
        return next(new HttpError("Fetching users failed, please try again later.", 500));
    }

    res.json({users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input.", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Signing up failed."), 500);
  }

  if (existingUser) {
    return next(new HttpError("Email already exists, please login", 422));
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://en.wikipedia.org/wiki/Drexel_University#/media/File:Anthony_J._Drexel_by_Moses_Ezekiel_(1844-1917)_-_Drexel_University_-_IMG_7320.JPG",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Logging in failed."), 500);
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Email or password not correct, please try again.", 401));
  }

  res.json({ message: "Logged in." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
