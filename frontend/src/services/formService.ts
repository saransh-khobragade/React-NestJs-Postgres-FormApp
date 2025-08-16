import { api } from './api';
import type { CreateFormRequest, FormDto, SubmitResponseRequest } from '@/types/form';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const formService = {
  create: async (token: string, payload: CreateFormRequest): Promise<FormDto> => {
    const res = await api.request<ApiResponse<FormDto>>('/api/forms', {
      method: 'POST',
      headers: { Authorization: `Bearer ${String(token)}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.data;
  },
  listMine: async (token: string): Promise<FormDto[]> => {
    const res = await api.request<ApiResponse<FormDto[]>>('/api/forms', {
      method: 'GET',
      headers: { Authorization: `Bearer ${String(token)}` },
    });
    return res.data;
  },
  get: async (id: number): Promise<FormDto> => {
    const res = await api.get<ApiResponse<FormDto>>(`/api/forms/${String(id)}`);
    return res.data;
  },
  submit: async (id: number, payload: SubmitResponseRequest): Promise<void> => {
    await api.post<ApiResponse<unknown>>(`/api/forms/${String(id)}/responses`, payload);
  },
  responses: async (
    token: string,
    id: number,
  ): Promise<{ id: number; answers: Record<string, unknown>; createdAt: string }[]> => {
    const res = await api.request<
      ApiResponse<{ id: number; answers: Record<string, unknown>; createdAt: string }[]>
    >(`/api/forms/${String(id)}/responses`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${String(token)}` },
    });
    return res.data;
  },
};

