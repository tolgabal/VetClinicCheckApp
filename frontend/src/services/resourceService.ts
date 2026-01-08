import api from './api';
import type { AnimalType, CreateAnimalTypeDto } from '../types';

export const resourceService = {
  getAnimalTypes: async (): Promise<AnimalType[]> => {
    const response = await api.get<AnimalType[]>('/animal-type');
    return response.data;
  },

  createAnimalType: async (data: CreateAnimalTypeDto): Promise<AnimalType> => {
    const response = await api.post<AnimalType>('/animal-type', data);
    return response.data;
  },

  updateAnimalType: async (id: number, data: { name: string }): Promise<void> => {
    await api.patch(`/animal-type/${id}`, data);
  },

  deleteAnimalType: async (id: number): Promise<void> => {
    await api.delete(`/animal-type/${id}`);
  },

  getUsers: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/user');
    return response.data;
  }
};