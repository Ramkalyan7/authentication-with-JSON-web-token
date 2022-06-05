import React, { useState } from "react";
import axios from "axios";
function Login() {
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState("");
  async function loginUser(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/login",
        { email, password },
        { headers: { "content-Type": "application/json" } }
      );
      if (data.user) {
        localStorage.setItem("token", data.user);
        alert("Login sucessful");
        window.location.href = "/quote";
      } else {
        console.log(data);
        alert("please check your username and password");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
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

export default Login;
