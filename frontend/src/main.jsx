import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AptosWalletProvider } from './contexts/WalletContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import AnimatedBackground from './components/AnimatedBackground.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatedBackground />
      <AuthProvider>
        <AptosWalletProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#f5f3f0',
                color: '#3a3530',
                border: '1px solid #d5d0c9',
              },
            }}
          />
        </AptosWalletProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
