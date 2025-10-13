import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from '../pages/public/Hero';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PublicRoutes;
