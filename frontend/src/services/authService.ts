import api from './api';
import type { LoginUserDto, CreateUserDto, User } from '../types';

interface LoginResponse {
  accessToken: string;
  user:User;
}

export const authService = {
  login: async (data: LoginUserDto): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/user', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile'); 
    return response.data;
  }
};