import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = (e) => {
    e.preventDefault();
    api.post("/register/", { username, password }).then(() => {
      alert("Registration Successful");
      navigate("/");
    }).catch((err) => {
      console.log(err.response);
      alert("Registration Failed");
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
        <h1>Create account</h1>
        <p className="auth-sub">Start organizing your tasks</p>

        <form onSubmit={registerUser} className="auth-form">
          <label className="field">
            <span>Username</span>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button className="btn btn-primary auth-submit" type="submit">Register</button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button type="button" className="link-btn" onClick={() => navigate("/")}>Back to login</button>
        </p>
      </div>
    </div>
  );
}

export default Register;