
// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { ok, data } = await registerUser({ name, email, password });
    setLoading(false);

    if (ok && data?.user) {
      // success — user is usually returned and cookie is set by server
      navigate('/dashboard');
    } else {
      setError(data?.message || 'Registration failed');
    }
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
