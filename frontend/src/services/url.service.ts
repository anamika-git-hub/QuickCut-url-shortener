import api from './api';

export interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  owner: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUrlData {
  originalUrl: string;
}

export const createUrl = async (data: CreateUrlData): Promise<Url> => {
  const response = await api.post<Url>('/urls', data);
  return response.data;
};

export const getUrls = async (): Promise<Url[]> => {
  const response = await api.get<Url[]>('/urls');
  return response.data;
};

export const deleteUrl = async (id: string): Promise<void> => {
  await api.delete(`/urls/${id}`);
};

export const getShortUrl = (shortCode: string): string => {
  return `${import.meta.env.VITE_API_URL}/urls/${shortCode}`;
};