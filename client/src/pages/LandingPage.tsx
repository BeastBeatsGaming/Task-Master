import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css"; // We'll create this

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // If user is already authenticated, redirect them to their todos
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="animated-title">
          <span>T</span>
          <span>a</span>
          <span>s</span>
          <span>k</span>
          <span>M</span>
          <span>a</span>
          <span>s</span>
          <span>t</span>
          <span>e</span>
          <span>r</span>
        </h1>
        <p className="landing-subtitle">
          Organize Your Life, One Task at a Time.
        </p>
      </header>

      <section className="landing-about">
        <div className="about-title">
          <h2>What is TaskMaster?</h2>
        </div>
        <div className="about-description">
          <p>
            TaskMaster is a simple yet powerful To-Do List application designed
            to help you manage your daily tasks efficiently. Create an account,
            add your to-dos, mark them as complete, and stay on top of your
            goals.
          </p>
        </div>
      </section>

      <section className="landing-tech">
        <h2>Built With</h2>
        <div className="tech-logos">
          {/* You can replace these with actual SVGs or image tags for logos */}
          <span className="tech-tag">MongoDB</span>
          <span className="tech-tag">Express.js</span>
          <span className="tech-tag">React</span>
          <span className="tech-tag">Node.js</span>
          <span className="tech-tag">Vite</span>
          <span className="tech-tag">TypeScript</span>
          <span className="tech-tag">React Router</span>
        </div>
      </section>

      <section className="landing-cta">
        {!isAuthenticated && (
          <>
            <h2>Ready to Get Started?</h2>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Sign Up Now
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          </>
        )}
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} TaskMaster. Sai Mayank.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
