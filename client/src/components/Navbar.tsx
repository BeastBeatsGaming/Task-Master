import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Link to dashboard if logged in, else landing page */}
        <Link to={isAuthenticated ? "/dashboard" : "/"}>TaskMaster</Link>
      </div>
      <ul className="navbar-links">
        {isAuthenticated && user ? (
          <>
            <li>
              <span className="navbar-user">Hi, {user.name.split(" ")[0]}</span>
            </li>
            <li>
              <Link to="/dashboard" className="navbar-button">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/add-todo" className="navbar-button add-task-button">
                Add Task
              </Link>{" "}
              {/* NEW LINK */}
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="navbar-button logout-button"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="navbar-button">
                Register
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/about" className="navbar-button">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
