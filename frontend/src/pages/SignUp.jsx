import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SIGNUP_URL = 'http://localhost:5000/api/trainer/register'; // Change to your backend URL

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male'
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isValid = Object.values(errors).every(error => !error) && 
                   Object.values(formData).every(value => value !== '');
    setIsFormValid(isValid);
  }, [formData, errors]);

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'username':
        if (value.length < 3) errorMessage = 'Username must be at least 3 characters';
        break;
      case 'name':
        if (!/^[a-zA-Z\s]+$/.test(value)) errorMessage = 'Only letters and spaces allowed';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMessage = 'Invalid email format';
        break;
      case 'password':
        if (value.length < 8) errorMessage = 'Password must be at least 8 characters';
        break;
      case 'age':
        if (value < 13 || value > 120) errorMessage = 'Invalid age';
        break;
      case 'weight':
      case 'height':
        if (value <= 0) errorMessage = 'Must be greater than 0';
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
    
    const newErrors = {};
    let hasErrors = false;
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      newErrors[name] = error;
      if (error) hasErrors = true;
    });
    setErrors(newErrors);
    
    if (hasErrors) {
      setFormError('Please correct the errors before submitting');
      return;
    }
    
    setFormError('');
    try {
      const response = await axios.post(SIGNUP_URL, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 409) {
        setFormError('Email already exists');
      } else {
        setFormError('Sign Up failed. Try again later');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {formError && <div className="error">{formError}</div>}
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input 
                type={field === 'password' ? 'password' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={errors[field] ? 'error-input' : ''}
                required
              />
              {errors[field] && <div className="input-error">{errors[field]}</div>}
            </div>
          ))}
          <button type="submit" className="btn-primary" disabled={!isFormValid}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;