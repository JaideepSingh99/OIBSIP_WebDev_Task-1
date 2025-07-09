import { useAuth } from "../Context/AuthContext.jsx";
import { Link, useNavigate } from "react-router";
import {useEffect, useState} from "react";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 p-8 shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-primary text-center font-secondary">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="floating-label">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </label>
          <label className="floating-label">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </label>
          <div className="text-right">
            <Link to="/forgot-password" className="link text-sm link-secondary">
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary w-full font-secondary">
            Login
          </button>
        </form>
        <div className="text-sm text-center">
          Don’t have an account?
          <Link to="/register" className="link link-secondary ml-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;