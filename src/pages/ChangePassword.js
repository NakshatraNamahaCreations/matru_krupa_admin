import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { staff, logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isFirstLogin = staff?.mustChangePassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword.length < 6) {
      return setError('New password must be at least 6 characters');
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('mk_admin_token');
      const res = await fetch(`${API_BASE}/hierarchy/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: isFirstLogin ? undefined : form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');

      // Update local storage to clear mustChangePassword
      const saved = JSON.parse(localStorage.getItem('mk_admin_user') || '{}');
      saved.mustChangePassword = false;
      localStorage.setItem('mk_admin_user', JSON.stringify(saved));

      setSuccess('Password changed successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
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

        <h2 className="login-card__title">
          {isFirstLogin ? 'Set Your Password' : 'Change Password'}
        </h2>

        {isFirstLogin && (
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginBottom: 16 }}>
            Please set a new password to continue.
          </p>
        )}

        {error && <div className="login-error">{error}</div>}
        {success && (
          <div style={{
            background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
            borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 20, textAlign: 'center',
          }}>
            {success}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {!isFirstLogin && (
            <div className="login-field">
              <label className="login-field__label">Current Password</label>
              <input
                type="password"
                className="login-field__input"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                required
              />
            </div>
          )}

          <div className="login-field">
            <label className="login-field__label">New Password</label>
            <input
              type="password"
              className="login-field__input"
              placeholder="Enter new password (min 6 chars)"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label className="login-field__label">Confirm Password</label>
            <input
              type="password"
              className="login-field__input"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Password'}
          </button>
        </form>

        {!isFirstLogin && (
          <p className="login-footer" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            Back to Dashboard
          </p>
        )}
      </div>
    </div>
  );
}
