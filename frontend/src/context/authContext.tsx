import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, LoginUserDto } from '../types';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Yükleniyor durumu eklendi
  login: (data: LoginUserDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // Başlangıçta yükleniyor true olsun ki, kontrol bitmeden login sayfasına atmasın
  const [isLoading, setIsLoading] = useState(true); 

  // SAYFA YÜKLENİNCE ÇALIŞIR (F5 ATINCA)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    // Eğer token yoksa direkt yüklemeyi bitir
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Token varsa backend'den güncel kullanıcı bilgisini çek
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Token geçersiz, oturum kapatılıyor.");
      // Token geçersizse temizle
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      // İşlem bitti, yükleniyor durumunu kapat
      setIsLoading(false);
    }
  };

  const login = async (data: LoginUserDto) => {
    try {
      const response = await authService.login(data);
      
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
        // Login olunca user bilgisini state'e at
        setUser(response.user); 
        toast.success(`Hoşgeldin ${response.user.name || response.user.username}`);
      }
    } catch (error) {
      toast.error('Giriş başarısız. Bilgileri kontrol et.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Çıkış yapıldı.');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user, // User varsa true, yoksa false
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};