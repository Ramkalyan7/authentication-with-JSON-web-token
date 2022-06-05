import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Register() {
  const [userName, setUserName] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function registerUser(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/register",
        { username: userName, email, password },
        { headers: { "content-Type": "application/json" } }
      );
      if (data.user) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <input
          required
          type="text"
          name="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />{" "}
        <br />
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <br />
        <input
          required
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Register;
