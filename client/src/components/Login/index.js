// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { ok, data } = await loginUser({ email, password });
    setLoading(false);

    if (ok && data?.user) {
      navigate('/dashboard');
    } else {
      setError(data?.message || 'Login failed');
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
