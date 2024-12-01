import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Log.css";

function Login() {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // https://todo-list-c9yo.vercel.app/
      // https://todo-list-c9yo.vercel.app/?vercelToolbarCode=Fsqd1mN9maj3t73
      const response = await axios.post(
        "https://todo-list-c9yo.vercel.app/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (data.status !== "ok" || !data.existinguser) {
        window.alert("Email does not exist or login failed. Please try again.");
        return;
      }

      if (data.existinguser) {
        localStorage.setItem("token", data.existinguser);
        history("/todo");
      } else {
        alert("Please correct your email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="container">
      <h2>Login Form</h2>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
