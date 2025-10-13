import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PublicRoutes from './routers/PublicRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <PublicRoutes />
    </BrowserRouter>
  );
}

export default App;
