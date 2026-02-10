import mongoose, { Document, Schema, Types } from "mongoose";

// Define allowed status values
export const TODO_STATUS = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const; // Use 'as const' for stricter type checking

export type TodoStatusType = (typeof TODO_STATUS)[keyof typeof TODO_STATUS];

export interface ITodo extends Document {
  user: Types.ObjectId;
  text: string; // Task title
  description?: string; // Additional information
  targetDate?: Date | null; // Optional target date
  status: TodoStatusType;
  completedDate?: Date | null; // Automatically set when status is 'Completed'
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Task text is required"],
      trim: true,
      maxlength: [50, "Task text cannot exceed 50 characters"], // Max length
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description cannot exceed 250 characters"], // Max length
    },
    targetDate: {
      type: Date,
      default: null, // Make it optional
    },
    status: {
      type: String,
      enum: Object.values(TODO_STATUS), // Use values from our constant
      default: TODO_STATUS.IN_PROGRESS,
    },
    completedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
