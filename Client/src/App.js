import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import "./App.css";
import Todo from "./components/Todo";
import Login from "./components/Login";
import Reg from "./components/Reg"; // Import the Reg component
import TodoPage from "./components/TodoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
        {/* Render Login component for the home page */}
        <Route path="/register" element={<Reg />} />{" "}
        <Route path="/todopage" element={<TodoPage />} />
        <Route
          path="/todo/:taskId/edit"
          element={<TodoPage editMode={true} />}
        />
        {/* Render Reg component for registration */}
        {/* Add more routes if needed */}
      </Routes>
    </Router>
  );
}

export default App;
