import { useForm } from "react-hook-form";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let res;
    try {
      res = await axios.post("http://localhost:5000/api/auth/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      console.log("login error", err);
    }

    console.log(res);
  };

  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <p>Please enter your details to log in.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email Field */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="options">
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="login-button">
          Log In
        </button>
      </form>

      <div className="signup-link">
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
