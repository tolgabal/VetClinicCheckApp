import api from './api';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/user');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/user/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/user', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/user/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/user/${id}`);
  }
};