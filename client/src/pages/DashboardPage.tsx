// client/src/pages/DashboardPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TodoItemCard from "../components/TodoItemCard";
import {
  type ITodoClient,
  TODO_STATUS_CLIENT,
  type TodoStatusTypeClient,
} from "../types/todo";
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [todos, setTodos] = useState<ITodoClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !authLoading && user) {
      fetchTodos();
    } else if (!authLoading && !isAuthenticated) {
      setTodos([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, user]);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ITodoClient[]>("/api/todos");
      // Sort by creation date by default, newest first for visual stacking
      const sortedTodos = response.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTodos(sortedTodos);
    } catch (err: any) {
      console.error("Failed to fetch todos:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch todos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: TodoStatusTypeClient
  ) => {
    setError(null);
    try {
      const response = await axios.put<ITodoClient>(`/api/todos/${id}`, {
        status: newStatus,
      });
      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((t) =>
          t._id === id ? response.data : t
        );
        // Re-sort after update to maintain visual consistency if needed, or rely on category re-evaluation
        return updatedTodos.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update status."
      );
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setError(null);
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((t) => t._id !== id));
    } catch (err: any) {
      console.error("Failed to delete todo:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to delete todo."
      );
    }
  };

  const isTaskOverdue = (todo: ITodoClient): boolean => {
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

  const categorizedTodos = useMemo(() => {
    const overdue: ITodoClient[] = [];
    const inProgress: ITodoClient[] = [];
    const completed: ITodoClient[] = [];
    // const cancelled: ITodoClient[] = []; // Keep if you might add it back

    // Sort todos before categorizing to ensure consistent order within columns (e.g., newest first)
    // The fetchTodos already sorts by createdAt descending.
    // If you want a different order within columns (e.g. by targetDate), sort here.
    const sortedForCategorization = [...todos].sort((a, b) => {
      // Example: sort by targetDate ascending within categories, nulls last
      const dateA = a.targetDate ? new Date(a.targetDate).getTime() : Infinity;
      const dateB = b.targetDate ? new Date(b.targetDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // fallback to newest
    });

    sortedForCategorization.forEach((todo) => {
      if (todo.status === TODO_STATUS_CLIENT.COMPLETED) {
        completed.push(todo);
      } else if (todo.status === TODO_STATUS_CLIENT.CANCELLED) {
        // cancelled.push(todo);
      } else if (isTaskOverdue(todo)) {
        overdue.push(todo);
      } else {
        inProgress.push(todo);
      }
    });
    return { overdue, inProgress, completed };
  }, [todos]); // Removed `cancelled` from dependencies if not used

  if (authLoading)
    return <div className="global-loader">Authenticating...</div>;
  if (!isAuthenticated)
    return (
      <div className="page-container">
        <p>
          Please <Link to="/login">login</Link> to see your dashboard.
        </p>
      </div>
    );
  if (loading)
    return (
      <div className="page-container">
        <p>Loading tasks...</p>
      </div>
    );

  return (
    <div
      className="page-container dashboard-container"
      style={{ maxWidth: "80vw" }}
    >
      <div className="dashboard-header">
        <h1>Task Dashboard</h1>
        <Link to="/add-todo" className="btn btn-primary">
          Add New Task
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}

      {todos.length === 0 && !loading && (
        <p className="no-todos-message">
          You have no tasks yet. <Link to="/add-todo">Add one!</Link>
        </p>
      )}

      {todos.length > 0 && ( // Only render columns if there are todos
        <div className="dashboard-columns-container">
          {" "}
          {/* Column Order: Overdue, In Progress, Completed */}
          <div className="dashboard-column overdue-column">
            <h3>Overdue ({categorizedTodos.overdue.length})</h3>
            <div className="column-content">
              {categorizedTodos.overdue.length > 0 ? (
                categorizedTodos.overdue.map((todo) => (
                  <TodoItemCard
                    key={todo._id}
                    todo={todo}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteTodo}
                  />
                ))
              ) : (
                <p className="empty-column-message">No overdue tasks!</p>
              )}
            </div>
          </div>
          <div className="dashboard-column in-progress-column">
            <h3>In Progress ({categorizedTodos.inProgress.length})</h3>
            <div className="column-content">
              {categorizedTodos.inProgress.length > 0 ? (
                categorizedTodos.inProgress.map((todo) => (
                  <TodoItemCard
                    key={todo._id}
                    todo={todo}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteTodo}
                  />
                ))
              ) : (
                <p className="empty-column-message">No tasks in progress.</p>
              )}
            </div>
          </div>
          <div className="dashboard-column completed-column">
            <h3>Completed ({categorizedTodos.completed.length})</h3>
            <div className="column-content">
              {categorizedTodos.completed.length > 0 ? (
                categorizedTodos.completed.map((todo) => (
                  <TodoItemCard
                    key={todo._id}
                    todo={todo}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteTodo}
                  />
                ))
              ) : (
                <p className="empty-column-message">No completed tasks yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
