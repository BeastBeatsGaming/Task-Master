import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import axios from "axios"; // Auth token is now set globally by AuthContext
import { useAuth } from "../context/AuthContext"; // To check if user is loaded
import "./TodoListPage.css";
import { Link } from "react-router-dom";

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth(); // Get auth state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState(true); // For todo fetching
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch todos if authenticated and user data is loaded
    if (isAuthenticated && !authLoading && user) {
      fetchTodos();
    } else if (!authLoading && !isAuthenticated) {
      // User is not authenticated, clear todos or handle accordingly
      setTodos([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, user]); // Depend on auth state

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Todo[]>("/api/todos");
      setTodos(response.data);
    } catch (err: any) {
      console.error("Failed to fetch todos:", err);
      // Handle 401 specifically if token expires during session
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
        // Optionally, trigger logout from AuthContext here
      } else {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch todos"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ... (handleAddTodo, handleToggleComplete, handleDeleteTodo remain largely the same)
  // Ensure they handle errors gracefully, especially auth errors
  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setError(null);
    try {
      const response = await axios.post<Todo>("/api/todos", {
        text: newTodoText,
      });
      setTodos([response.data, ...todos]);
      setNewTodoText("");
    } catch (err: any) {
      console.error("Failed to add todo:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to add todo"
      );
    }
  };

  const handleToggleComplete = async (
    id: string,
    currentCompletedStatus: boolean
  ) => {
    setError(null);
    try {
      const response = await axios.put<Todo>(`/api/todos/${id}`, {
        completed: !currentCompletedStatus,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (err: any) {
      console.error("Failed to update todo:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update todo"
      );
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err: any) {
      console.error("Failed to delete todo:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to delete todo"
      );
    }
  };

  // If auth is still loading, show a message
  if (authLoading) {
    return <div className="global-loader">Authenticating...</div>;
  }

  // If not authenticated (should be redirected, but as a fallback)
  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <p>
          Please <Link to="/login">login</Link> to see your todos.
        </p>
      </div>
    );
  }

  // If todo data is loading
  if (loading) return <p>Loading todos...</p>;

  return (
    <div className="page-container">
      <div className="todo-app-container">
        <h1>My To-Do List</h1>
        {error && <p className="error-message">Error: {error}</p>}

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodoText}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTodoText(e.target.value)
            }
            placeholder="Add a new todo..."
            className="todo-input"
            required
          />
          <button type="submit" className="todo-button">
            Add Todo
          </button>
        </form>

        {todos.length > 0 ? (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    handleToggleComplete(todo._id, todo.completed)
                  }
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="delete-button"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
