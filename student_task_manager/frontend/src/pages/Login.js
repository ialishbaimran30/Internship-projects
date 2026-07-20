import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    api.post("/api/token/", { username, password }).then((response) => {
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    }).catch((error) => {
      console.log(error.response);
      alert("Login Failed");
    });
  };

  return (
    <div className="auth-screen">
      <div className="glass-panel-strong auth-card">
        <div className="auth-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="6" r="2.3" fill="currentColor" />
            <circle cx="18" cy="6" r="2.3" fill="currentColor" />
            <circle cx="6" cy="18" r="2.3" fill="currentColor" />
            <circle cx="18" cy="18" r="2.3" fill="currentColor" />
          </svg>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to keep tasks moving</p>

        <form onSubmit={handleLogin} className="auth-form">
          <label className="field">
            <span>Username</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button className="btn btn-primary auth-submit" type="submit">Login</button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button type="button" className="link-btn" onClick={() => navigate("/register")}>Register</button>
        </p>
      </div>
    </div>
  );
}

export default Login;