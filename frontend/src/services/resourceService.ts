import api from './api';
import type { AnimalType, CreateAnimalTypeDto } from '../types';

export const resourceService = {
  // GET: Tüm türleri getir
  getAnimalTypes: async (): Promise<AnimalType[]> => {
    // Backend endpoint: @Controller('animal-type') -> @Get()
    const response = await api.get<AnimalType[]>('/animal-type');
    return response.data;
  },

  // POST: Yeni tür ekle
  createAnimalType: async (data: CreateAnimalTypeDto): Promise<AnimalType> => {
    // Backend endpoint: @Post()
    const response = await api.post<AnimalType>('/animal-type', data);
    return response.data;
  },

  updateAnimalType: async (id: number, data: { name: string }): Promise<void> => {
    // Backend endpoint: @Patch(':id')
    await api.patch(`/animal-type/${id}`, data);
  },

  // DELETE: Tür sil
  deleteAnimalType: async (id: number): Promise<void> => {
    // Backend endpoint: @Delete(':id')
    await api.delete(`/animal-type/${id}`);
  },

  // Tüm kullanıcıları getir (AddAnimal sayfasında lazım oluyor)
  getUsers: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/user');
    return response.data;
  }
};