import api from './api';
import type { Animal, CreateAnimalDto, UpdateAnimalDto } from '../types';

export const animalService = {
  getAll: async (): Promise<Animal[]> => {
    const response = await api.get<Animal[]>('/animal');
    return response.data;
  },

  getById: async (id: number): Promise<Animal> => {
    const response = await api.get<Animal>(`/animal/${id}`);
    return response.data;
  },

  create: async (data: CreateAnimalDto): Promise<Animal> => {
    const response = await api.post<Animal>('/animal', data);
    return response.data;
  },

  update: async (id: number, data: UpdateAnimalDto): Promise<Animal> => {
    const response = await api.patch<Animal>(`/animal/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/animal/${id}`);
  }
};