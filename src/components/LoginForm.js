import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginForm.css";
import NavigationIcons from "./NavigationIcons";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({ onLoginSuccess }) => {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://tssezl-invoice-system.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, password }),
      });

      const data = await res.json();
      console.log("🔐 Login response:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const decoded = JSON.parse(atob(data.token.split(".")[1]));
        const role = decoded.role;
        if (onLoginSuccess) {
          onLoginSuccess(role);
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Server error: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <NavigationIcons />
      <img src="/logo.png" alt="Company Logo" className="logo-top-left" />
      <img src="/tata-logo.png" alt="Company Logo" className="logo-top-right" />
      <div className="login-box">
        <h2>Secure Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
