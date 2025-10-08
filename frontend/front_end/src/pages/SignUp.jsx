import { useForm } from "react-hook-form";
import "../css/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let res;
    try {
      res = await axios.post(
        "https://topcoders.onrender.com/api/auth/register",
        data
      );
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      console.log("signup error", err);
    }

    console.log(res);
  };

  return (
    <div className="signup-page">
    <div className="signup-container">
      <h1>Create Account</h1>
      <p>Join our community and start your journey!</p>

      {/* The handleSubmit function validates inputs before calling onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Username Field */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Entered value does not match email format",
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
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6, // It's a good practice to have a minimum length
                message: "Password must have at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        {/* Codeforces Profile Field */}
        <div className="input-group">
          <label htmlFor="codeforcesProfile">Codeforces Profile</label>
          <input
            type="text"
            id="codeforcesProfile"
            {...register("codeforcesProfile", {
              required: "Codeforces profile is required",
            })}
          />
          {errors.codeforcesProfile && (
            <span className="error-message">
              {errors.codeforcesProfile.message}
            </span>
          )}
        </div>

        {/* CodeChef Profile Field */}
        <div className="input-group">
          <label htmlFor="codechefProfile">CodeChef Profile</label>
          <input
            type="text"
            id="codechefProfile"
            {...register("codechefProfile", {
              required: "CodeChef profile is required",
            })}
          />
          {errors.codechefProfile && (
            <span className="error-message">
              {errors.codechefProfile.message}
            </span>
          )}
        </div>

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>

      <div className="login-link">
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  </div>
)};

export default SignUp;
