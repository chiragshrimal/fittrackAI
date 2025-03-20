import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    userType: "trainee",
    gender: "male",
  });

  const [SIGNUP_URL, setSIGNUP_URL] = useState("http://192.168.133.164:5000/api/trainee/register");

  useEffect(() => {
    if (formData.userType === "trainee") {
      setSIGNUP_URL("http://localhost:5000/api/trainee/register");
    } else {
      setSIGNUP_URL("http://192.168.133.164:5000/api/trainer/register");
    }
  }, [formData.userType]);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isValid =
      Object.values(errors).every((error) => !error) &&
      Object.values(formData).every((value) => value !== "");
    setIsFormValid(isValid);
  }, [formData, errors]);

  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "username":
        if (value.length < 3)
          errorMessage = "Username must be at least 3 characters";
        break;
      case "name":
        if (!/^[a-zA-Z\s]+$/.test(value))
          errorMessage = "Only letters and spaces allowed";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errorMessage = "Invalid email format";
        break;
      case "password":
        if (value.length < 8)
          errorMessage = "Password must be at least 8 characters";
        break;
      case "age":
        if (value < 13) errorMessage = "You must be at least 13 years old";
        break;
      case "weight":
      case "height":
        if (value <= 0) errorMessage = "Must be greater than 0";
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const newErrors = {};
    let hasErrors = false;

    // Validate all fields
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      newErrors[name] = error;
      if (error) hasErrors = true;
    });
    setErrors(newErrors);

    if (hasErrors) {
      setFormError("Please correct the errors before submitting");
      return;
    }

    // Clear any form errors
    setFormError("");

    // Make an API call to Sign Up
    try {
      const response = await axios.post(SIGNUP_URL, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("Data", response.data);
      console.log("Access Token", response.data.token);
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409) {
        setFormError("Email already exists");
      } else {
        setFormError("Sign Up failed. Try again later");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {formError && <div className="error">{formError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error-input" : ""}
              required
            />
            {errors.username && (
              <div className="input-error">{errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error-input" : ""}
              required
            />
            {errors.name && <div className="input-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
              required
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error-input" : ""}
              required
            />
            {errors.password && (
              <div className="input-error">{errors.password}</div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? "error-input" : ""}
                required
              />
              {errors.age && <div className="input-error">{errors.age}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className={errors.weight ? "error-input" : ""}
                required
              />
              {errors.weight && (
                <div className="input-error">{errors.weight}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={errors.height ? "error-input" : ""}
                required
              />
              {errors.height && (
                <div className="input-error">{errors.height}</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="userType">User Type</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="trainee">Trainee</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={!isFormValid}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;