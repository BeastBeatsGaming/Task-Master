import React, { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./FormPage.css"; // We'll create a generic form page style

const AddTodoPage: React.FC = () => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Get today's date in YYYY-MM-DD format for min attribute of date input
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("You must be logged in to add a task.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await axios.post("/api/todos", {
        text,
        description,
        targetDate: targetDate || null, // Send null if empty
      });
      navigate("/dashboard"); // Navigate to dashboard on success
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add task. Please check your input."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-page-container">
        <h2>Add New Task</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="styled-form">
          <div className="form-group">
            <label htmlFor="text">Task Title (Max 50 chars)</label>
            <input
              type="text"
              id="text"
              className="form-control"
              value={text}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setText(e.target.value)
              }
              maxLength={50}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">
              Additional Information (Max 250 chars)
            </label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              maxLength={250}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetDate">Target Date (Optional)</label>
            <input
              type="date"
              id="targetDate"
              className="form-control"
              value={targetDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTargetDate(e.target.value)
              }
              min={getTodayDateString()} // Prevent selecting past dates
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding Task..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTodoPage;
