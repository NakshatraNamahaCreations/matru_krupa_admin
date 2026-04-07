import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <span className="login-card__logo-text">Matru Krupa</span>
          <span className="login-card__logo-sub">Admin Panel</span>
        </div>

        <h2 className="login-card__title">Sign in to continue</h2>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-field__label">Email Address</label>
            <input
              type="email"
              className="login-field__input"
              placeholder="admin@matrukripa.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label className="login-field__label">Password</label>
            <div className="login-field__wrap">
              <input
                type={showPass ? 'text' : 'password'}
                className="login-field__input"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <><Loader size="small" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="login-footer">
          Matru Krupa Enterprise &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
