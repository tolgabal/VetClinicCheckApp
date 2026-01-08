import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/authContext';
import MainLayout from './layout/MainLayout';
import AddAnimal from './pages/AddAnimal';
import AnimalDetail from './pages/AnimalDetail';
import UserManagement from './pages/userManagement';
import TypeManagement from './pages/TypeManagement';
import EditAnimal from './pages/EditAnimal';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Yükleniyor...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ANASAYFA (Dashboard) */}
        <Route path="/" element={
          <PrivateRoute>
            {/* Dashboard'u MainLayout ile sarmalıyoruz */}
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } />

        <Route path="/add-animal" element={
          <PrivateRoute>
            <MainLayout>
              <AddAnimal />
            </MainLayout>
          </PrivateRoute>
        } />

        <Route path="/animal/:id" element={
          <PrivateRoute>
            <MainLayout>
              <AnimalDetail />
            </MainLayout>
          </PrivateRoute>
        } />

        <Route path="/users" element={
          <PrivateRoute>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </PrivateRoute>
        } />

        <Route path="/types" element={
          <PrivateRoute>
            <MainLayout>
              <TypeManagement />
            </MainLayout>
          </PrivateRoute>
        } />

        <Route 
            path="/edit-animal/:id" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <EditAnimal />
                </MainLayout>
              </PrivateRoute>
            } 
          />

      </Routes>
    </BrowserRouter>
  );
}

export default App;