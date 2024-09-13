import mongoose, { Schema, type Document, type Model } from 'mongoose';

// Define the Task interface based on your structure
export interface ITask extends Document {
  userId: Schema.Types.ObjectId; // Reference to User
  name: string;
  description: string;
  date: string;
  container: string; // To track if the task is completed
  note : string
}

// Create the Task schema
const TaskSchema: Schema = new Schema<ITask>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  container: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
});

// Create the model using the schema and the interface
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
