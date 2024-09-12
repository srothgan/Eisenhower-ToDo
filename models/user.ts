import mongoose, { Schema, type Document, type Model } from 'mongoose';


// Define the User interface based on your structure
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'employee' | 'lecturer' | 'student'; // User role
  organization: string;
  resetpassword : string;
}

// Create the User schema
const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['employee', 'lecturer', 'student'], // Allowed roles
    default: 'student',
  },
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  resetpassword: {
    type: String,
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
});

// Create the model using the schema and the interface
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
