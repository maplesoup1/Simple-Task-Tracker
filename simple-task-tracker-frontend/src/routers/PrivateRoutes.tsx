import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Task from '../pages/private/Task'

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/tasks" element={<Task />} />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}

export default PrivateRoutes
