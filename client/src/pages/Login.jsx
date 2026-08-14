import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api_real_fixed4";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("Login response:", data);

      if (!data || !data.user) {
        throw new Error("Invalid login response from server");
      }

      // Store ONLY user information.
      // JWT token is NOT stored in localStorage.
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      alert("Login Successful!");

      // Redirect according to role
      if (data.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login Error:", error);

      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your LMS account
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;