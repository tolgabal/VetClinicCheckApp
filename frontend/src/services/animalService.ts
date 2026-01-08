import api from './api';
// Yine "import type" kullanıyoruz ki hata almayalım
import type { Animal, CreateAnimalDto, UpdateAnimalDto } from '../types';

export const animalService = {
  // 1. Tüm Hayvanları Getir
  getAll: async (): Promise<Animal[]> => {
    const response = await api.get<Animal[]>('/animal');
    return response.data;
  },

  // 2. Tek Bir Hayvan Getir (Detay Sayfası İçin)
  getById: async (id: number): Promise<Animal> => {
    const response = await api.get<Animal>(`/animal/${id}`);
    return response.data;
  },

  // 3. Yeni Hayvan Ekle
  // Burada DTO kullanarak ilişki ID'lerini (userIds, animalTypeId) gönderiyoruz.
  create: async (data: CreateAnimalDto): Promise<Animal> => {
    const response = await api.post<Animal>('/animal', data);
    return response.data;
  },

  // 4. Güncelleme
  // PDF [10]: Güncelleme işlemi frontend tarafında yapılabilir olmalıdır.
  update: async (id: number, data: UpdateAnimalDto): Promise<Animal> => {
    // Backend'de PATCH mi PUT mu kullandığına göre burası değişebilir.
    // Genelde kısmi güncelleme için PATCH kullanılır.
    const response = await api.patch<Animal>(`/animal/${id}`, data);
    return response.data;
  },

  // 5. Silme
  // PDF [11]: Silme işlemi frontend tarafında yapılabilir olmalıdır.
  delete: async (id: number): Promise<void> => {
    await api.delete(`/animal/${id}`);
  }
};