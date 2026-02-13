import axios from 'axios';
import type { InputData, CalculationResult } from './types';

// В dev (npm run dev) — бэкенд на порту 8000; в prod (статическая раздача) — тот же домен
const API_BASE_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculate = async (data: InputData): Promise<CalculationResult> => {
  const response = await api.post<CalculationResult>('/api/calculate', data);
  return response.data;
};

export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await api.get<{ status: string }>('/api/health');
  return response.data;
};





