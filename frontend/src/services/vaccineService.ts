import api from './api';
import type { Vaccine, CreateVaccineDto } from '../types';

export const vaccineService = {
  // Yeni Aşı Ekle (POST /vaccine)
  create: async (data: CreateVaccineDto): Promise<Vaccine> => {
    const response = await api.post<Vaccine>('/vaccine', data);
    return response.data;
  },

  // YENİ: Güncelleme
  update: async (id: number, data: Partial<CreateVaccineDto>): Promise<Vaccine> => {
    const response = await api.patch<Vaccine>(`/vaccine/${id}`, data);
    return response.data;
  },
  // Aşı Sil (DELETE /vaccine/:id)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/vaccine/${id}`);
  }
};