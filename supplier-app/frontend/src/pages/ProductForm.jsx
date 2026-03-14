import React, { useState } from 'react';
import api from '../utils/api';

export default function ProductForm({ existing, onSaved }) {
  const [form, setForm] = useState(existing || { name: '', price: 0, description: '', stock: 0, imageUrl: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const url = existing ? `/products/${existing._id}` : '/products';
    const method = existing ? 'put' : 'post';
    await api[method](url, form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" />
      <button type="submit">Save</button>
    </form>
  );
}
