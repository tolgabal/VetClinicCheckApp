import api from './api';
import type { Vaccine, CreateVaccineDto } from '../types';

export const vaccineService = {
  create: async (data: CreateVaccineDto): Promise<Vaccine> => {
    const response = await api.post<Vaccine>('/vaccine', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateVaccineDto>): Promise<Vaccine> => {
    const response = await api.patch<Vaccine>(`/vaccine/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/vaccine/${id}`);
  }
};