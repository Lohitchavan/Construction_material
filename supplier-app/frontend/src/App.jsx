import React, { useState } from 'react';
import ProductList from './pages/ProductList';
import Login from './pages/Login';

function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('token'));

  if (!logged) return <Login onLogin={() => setLogged(true)} />;

  return (
    <div>
      <ProductList />
    </div>
  );
}

export default App;
