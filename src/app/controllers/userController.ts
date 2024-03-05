import User from "../models/userModel";
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: (err as Error).message,
    });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params["id"]);

    // if (!user) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: 'User not found',
    //   });
    // }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err as Error).message,
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: (err as Error).message,
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params["id"], req.body, {
      new: true,
      runValidators: true
    });

    // if (!updatedUser) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: 'User not found',
    //   });
    // }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: (err as Error).message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params["id"]);

    // if (!deletedUser) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: 'User not found',
    //   });
    // }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err as Error).message,
    });
  }
};
