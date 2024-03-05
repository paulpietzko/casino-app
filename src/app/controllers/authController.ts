import { promisify } from 'util';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import AppError from '../utils/appError';
import { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
  user?: IUser;
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env['JWT_SECRET']!, {
    expiresIn: process.env['JWT_EXPIRES_IN'],
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
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
    next(new AppError('Error', 400));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    next(new AppError('Error', 400));
  }
};

export const protect = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token) as JwtPayload;

    const currentUser = await User.findById(decoded['id']);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(new AppError('Error', 400));
  }
};
