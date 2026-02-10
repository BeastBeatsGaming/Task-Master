export const TODO_STATUS_CLIENT = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type TodoStatusTypeClient =
  (typeof TODO_STATUS_CLIENT)[keyof typeof TODO_STATUS_CLIENT];

export interface ITodoClient {
  _id: string;
  user: string; // User ID
  text: string;
  description?: string;
  targetDate?: string | null; // Dates will be strings from JSON
  status: TodoStatusTypeClient;
  completedDate?: string | null; // Dates will be strings from JSON
  createdAt: string;
  updatedAt: string;
}
