import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Reg.css";
function Reg() {
  const history = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!email.includes("@") || !email.endsWith("gmail.com")) {
        window.alert("Enter a valid Gmail address");
        return;
      }

      const response = await axios({
        method: "post",
        url: "https://todo-list-c9yo.vercel.app/register",
        data: {
          name: username,
          email,
          password,
        },
      });

      console.log(response.data);
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        history("/");
      } else if (response.status === 409) {
        window.alert("Email id already exists");
        return;
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="container">
      <h2>Registration Form</h2>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
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
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Reg;
