import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("student");
    if (user) navigate("/dashboard");
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Invalid credentials");
      return;
    }

    localStorage.setItem("student", email);
    navigate("/dashboard");
  }

  return (
    <div className="login-wrapper">

      <div className="login-card">

        <h2>🎓 Student Login</h2>
        <p className="login-sub">Welcome back, please sign in</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-input"
            required
          />

          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
            required
          />

          <label className="showpass">
            <input type="checkbox" onChange={() => setShow(!show)} /> Show Password
          </label>

          <button className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Not registered? <Link to="/register">Create account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
