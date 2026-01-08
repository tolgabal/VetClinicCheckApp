import axios from 'axios';

// 1. Backend'in ana adresini tanımlıyoruz
const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// 2. İstek Kesici (Interceptor)
// Backend'e giden HER isteği yakalar ve içine Token koyar.
api.interceptors.request.use(
  (config) => {
    // Tarayıcı hafızasından token'ı al
    const token = localStorage.getItem('token');
    
    // Eğer token varsa, isteğin başlığına (Header) ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;