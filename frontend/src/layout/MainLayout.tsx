import React from 'react';
import Navbar from '../components/NavBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sabit Navbar */}
      <Navbar />
      
      {/* Sayfa İçeriği */}
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f6fa' }}>
        {children}
      </main>
    </div>
  );
}