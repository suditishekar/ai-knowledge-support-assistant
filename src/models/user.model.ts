import { Schema, model } from 'mongoose';
import { USER_ROLES } from './user.constants';
import { UserDocument, UserModel } from './user.types';

const userSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: 'USER',
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<UserDocument, UserModel>('User', userSchema);

export default User;