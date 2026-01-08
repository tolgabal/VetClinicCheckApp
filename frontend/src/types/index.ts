// Enums
export const Role = {
  Admin: 'Admin',
  Veteriner: 'Veteriner',
  User: 'User',
} as const;

export type Role = typeof Role[keyof typeof Role];

// Entity Interfaces
export interface Animal {
  id: number;
  name: string;
  age: number;
  animalType: AnimalType;
  users: User[];
  vaccines: Vaccine[];
}

export interface AnimalType {
  id: number;
  name: string;
  animals: Animal[];
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  userRole: UserRole;
  animals: Animal[];
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface UserRole {
  id: number;
  name: string;
  users: User[];
}

export interface Vaccine {
  id: number;
  name: string;
  description: string;
  lastVaccinationDate: Date;
  nextVaccinationDate: Date;
  animal: Animal;
}

// DTO Interfaces

// Animal DTOs
export interface CreateAnimalDto {
  name: string;
  age: number;
  animalTypeId: number;
  userIds: number[];
  vaccineIds: number[];
}

export type UpdateAnimalDto = Partial<CreateAnimalDto>;

export interface DeleteAnimalDto {
  id: number;
}

// AnimalType DTOs
export interface CreateAnimalTypeDto {
  name: string;
}

export type UpdateAnimalTypeDto = Partial<CreateAnimalTypeDto>;

export interface DeleteAnimalTypeDto {
  id: number;
}

// User DTOs
export interface CreateUserDto {
  username: string;
  name: string;
  email: string;
  password: string;
  userRoleId: number;
  animalIds?: number[];
}

export type UpdateUserDto = Partial<CreateUserDto>;

export interface DeleteUserDto {
  id: number;
}

// UserRole DTOs
export interface CreateUserRoleDto {
  name: string;
}

export type UpdateUserRoleDto = Partial<CreateUserRoleDto>;

export interface DeleteUserRoleDto {
  id: number;
}

// Vaccine DTOs
export interface CreateVaccineDto {
  name: string;
  description: string;
  lastVaccinationDate: Date;
  nextVaccinationDate: Date;
  animalId: number;
}

export type UpdateVaccineDto = Partial<CreateVaccineDto>;

export interface DeleteVaccineDto {
  id: number;
}

// Auth DTOs
export interface LoginUserDto {
  identifier: string;
  password: string;
}
