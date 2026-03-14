import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetch() {
      const res = await api.get('/products', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setProducts(res.data);
    }
    fetch();
  }, []);

  return (
    <div>
      <h1>Your Products</h1>
      <ul>
        {products.map(p => (
          <li key={p._id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
