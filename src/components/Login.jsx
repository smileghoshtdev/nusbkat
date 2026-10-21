import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      
      if (response.success) {
        const userData = response.data;
        // Redirect based on role
        navigate(userData.role === 'admin' ? '/admin' : '/student');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      {/* Left Side: Visual */}
      <div className="login-visual">
        <div className="visual-content">
          <div className="scanner-scene">
            <div className="scanner-base">
              <div className="scanner-slot"></div>
              <div className="scanner-light"></div>
            </div>
            
            <div className="hologram-projection">
              <div className="hologram-ring"></div>
              <div className="hologram-ring inner"></div>
              <div className="data-stream">
                <span>1010</span><span>0101</span><span>ID:8492</span>
              </div>
            </div>

            <div className="floating-id-card">
              <div className="card-face">
                <div className="card-chip">
                  <div className="chip-line"></div>
                  <div className="chip-line"></div>
                </div>
                <div className="card-photo">
                  <i className="fas fa-user"></i>
                </div>
                <div className="card-text">
                  <div className="text-line"></div>
                  <div className="text-line short"></div>
                </div>
                <div className="rfid-waves">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="visual-text">
            <h1>Edu Track Pro</h1>
            <p>Secure. Real-time. Automated.</p>
            <div className="feature-pills">
              <span><i className="fas fa-wifi"></i> RFID</span>
              <span><i className="fas fa-bolt"></i> Instant</span>
              <span><i className="fas fa-shield-alt"></i> Secure</span>
            </div>
          </div>
        </div>
        
        <div className="bg-particles">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="login-section">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">
              <i className="fas fa-fingerprint"></i>
            </div>
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access the system</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">ID Number</label>
              <div className="input-wrapper">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your ID Number"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                </button>
              </div>
              {(error || authError) && (
                <div className="error-message">
                  {error || authError}
                </div>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Remember Me
              </label>
              <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={loading}
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#">Contact Admin</a></p>
          </div>
        </div>
      </div>

      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
    </div>
  );
};

export default Login;
