import React, { useState } from 'react';
import api from '../utils/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    onLogin();
  };

  return (
    <div style={{padding:'1rem'}}>
      <h2>Supplier Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
