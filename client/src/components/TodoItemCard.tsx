import React from "react";
import {
  type ITodoClient,
  TODO_STATUS_CLIENT,
  type TodoStatusTypeClient,
} from "../types/todo"; // Import client type
import "./TodoItemCard.css"; // We'll create this

interface TodoItemCardProps {
  todo: ITodoClient;
  onUpdateStatus: (
    id: string,
    newStatus: TodoStatusTypeClient
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

// Helper to format dates
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const TodoItemCard: React.FC<TodoItemCardProps> = ({
  todo,
  onUpdateStatus,
  onDelete,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateStatus(todo._id, e.target.value as TodoStatusTypeClient);
  };

  const isOverdue = (): boolean => {
    if (
      todo.status === TODO_STATUS_CLIENT.COMPLETED ||
      todo.status === TODO_STATUS_CLIENT.CANCELLED
    ) {
      return false;
    }
    if (!todo.targetDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(todo.targetDate);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };

  return (
    <div className={`todo-card ${todo.status.toLowerCase().replace(" ", "-")}`}>
      <div className="todo-card-header">
        <h4>{todo.text}</h4>
        <button
          onClick={() => onDelete(todo._id)}
          className="delete-todo-btn"
          title="Delete Task"
        >
          ×
        </button>
      </div>
      {todo.description && (
        <p className="todo-card-description">{todo.description}</p>
      )}
      <div className="todo-card-details">
        <p>
          <strong>Target:</strong> {formatDate(todo.targetDate)}
          {isOverdue() && <span className="overdue-tag">OVERDUE</span>}
        </p>
        {todo.status === TODO_STATUS_CLIENT.COMPLETED && todo.completedDate && (
          <p>
            <strong>Completed:</strong> {formatDate(todo.completedDate)}
          </p>
        )}
        <div className="form-group">
          <label htmlFor={`status-${todo._id}`}>Status:</label>
          <select
            id={`status-${todo._id}`}
            value={todo.status}
            onChange={handleStatusChange}
            className="form-control status-select"
          >
            {Object.values(TODO_STATUS_CLIENT).map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TodoItemCard;
