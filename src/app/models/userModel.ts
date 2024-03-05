import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  prename: string;
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  avatar: string;
  iban: number;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  passwordChangedAt?: Date;
  changedPasswordAfter(this: IUser, JWTTimestamp: number): boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  prename: {
    type: String,
    required: [true, 'Please provide your prename'],
  },
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please tell us a username'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  avatar: {
    type: String,
  },
  iban: {
    type: Number,
    required: [true, 'Please provide your IBAN number'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = '';
  next();
});

userSchema.methods['correctPassword'] = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods['changedPasswordAfter'] = function (this: IUser, JWTTimestamp: number) {
//     if (this.passwordChangedAt) {
//       const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
//       return JWTTimestamp < changedTimestamp;
//     }
  
//     return false;
//   };
  
//   if (currentUser.changedPasswordAfter(decoded.iat!)) {
//     return next(new AppError('User recently changed password! Please log in again.', 401));
//   }
  

const User = mongoose.model<IUser>('User', userSchema);
export default User;
