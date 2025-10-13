import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import PublicRoutes from './routers/PublicRoutes'
import PrivateRoutes from './routers/PrivateRoutes'
import PopupProvider from './components/popupProvider'

function App() {
  return (
    <BrowserRouter>
      <PopupProvider>
        <PublicRoutes />
        <PrivateRoutes />
      </PopupProvider>
    </BrowserRouter>
  )
}

export default App
