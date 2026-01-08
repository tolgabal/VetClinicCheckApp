import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' 
import { AuthProvider } from './context/authContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. AuthProvider: Tüm uygulama "Kullanıcı kim?" bilgisini buradan alacak */}
    <AuthProvider>
        <App />
        
        {/* 2. ToastContainer: Bildirim kutucuklarının çıkacağı yer */}
        <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthProvider>
  </React.StrictMode>,
)