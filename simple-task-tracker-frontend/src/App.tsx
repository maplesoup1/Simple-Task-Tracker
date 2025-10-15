import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import PopupProvider from './components/modal/PopupProvider'
import Hero from './pages/public/Hero'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Task from './pages/private/Task'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PopupProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Task />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PopupProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
