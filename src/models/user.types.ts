import { HydratedDocument, Model } from 'mongoose';
import { USER_ROLES } from './user.constants';

export type UserRole = (typeof USER_ROLES)[number];

export interface UserAttributes {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserDocument extends UserAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type UserHydratedDocument = HydratedDocument<UserDocument>;

export interface UserModel extends Model<UserDocument> {}