import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="page-container">
      <h1>About TaskMaster</h1>
      <p>
        TaskMaster is a modern To-Do application built to demonstrate the power
        of the MERN stack (MongoDB, Express.js, React, Node.js) combined with
        Vite for a fast development experience and TypeScript for robust,
        maintainable code.
      </p>
      <p>
        It features user authentication, allowing each user to manage their own
        private list of tasks. You can add, complete, and delete tasks with
        ease.
      </p>
      <h2>Key Technologies Used:</h2>
      <ul>
        <li>
          <strong>Frontend:</strong> React, Vite, TypeScript, React Router,
          Axios, CSS
        </li>
        <li>
          <strong>Backend:</strong> Node.js, Express.js, TypeScript
        </li>
        <li>
          <strong>Database:</strong> MongoDB with Mongoose
        </li>
        <li>
          <strong>Authentication:</strong> JWT (JSON Web Tokens), bcryptjs
        </li>
      </ul>
      <p style={{ marginTop: "2rem" }}>
        This is a personal project created by{" "}
        <a href="https://github.com/BeastBeatsGaming">Sai Mayank</a>
      </p>
    </div>
  );
};
export default AboutPage;
