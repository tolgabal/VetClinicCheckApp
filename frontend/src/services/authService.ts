import api from './api';
import type { LoginUserDto, CreateUserDto, User } from '../types';

// Backend'den login olunca dönen cevabın tipi.
// Genelde { access_token: "..." } döner.
interface LoginResponse {
  accessToken: string;
  user:User;
}

export const authService = {
  // 1. GİRİŞ YAPMA (Login)
  // Dışarıdan 'identifier' ve 'password' alır.
  login: async (data: LoginUserDto): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // 2. KAYIT OLMA (Register)
  // Senin CreateUserDto yapını kullanır.
  register: async (data: CreateUserDto): Promise<User> => {
    // '/user' adresine POST isteği atar.
    const response = await api.post<User>('/user', data);
    return response.data;
  },

  // 3. BEN KİMİM? (Profil Bilgisi Çekme)
  // Token ile gidip "Benim bilgilerimi ver" der.
  // Eğer backend'inde bu endpoint yoksa şimdilik boş bırakabilirsin, 
  // ama genelde '/auth/profile' veya '/user/me' olur.
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile'); 
    return response.data;
  }
};