
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logoutUser } from '../api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { ok, data } = await getMe();
      if (!mounted) return;
      if (ok && data?.user) setUser(data.user);
      else navigate('/login');
    }
    load();
    return () => { mounted = false; };
  }, [navigate]);

  async function handleLogout() {
    await logoutUser();
    navigate('/login');
  }

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name || user.email}</p>
      <p>(This page is intentionally empty — add features later.)</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
