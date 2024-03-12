const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const { request } = require('http');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Error',
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password)
      return next(new AppError('Please provide a email and a password', 400));

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(
        new AppError(
          'Please provide a email and a passwordIncorrect email or password'
        )
      );

    // 3) If everything is ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in!',
      id: user._id,
      username: user.username,
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Error',
    });
  }
};
exports.protect = async (req, res, next) => {

  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }


    if (!token) {
      return next(
        new AppError('You are not logged in. Please log in to get access.', 401)
      );
    }

    // 2) Verificaiton token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(
        new AppError('The user belonging to this token does no longer exist'),
        401
      );

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Error',
    });
  }
};