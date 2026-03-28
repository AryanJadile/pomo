import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const classifyFruit = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await api.post('/api/classify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // Keep the local object URL for accurate frontend visualization. The backend returns a dummy URL.
  return { ...response.data, image_url: URL.createObjectURL(imageFile) };
};

export const submitEnvMetadata = async (payload) => {
  const response = await api.post('/api/env-metadata', payload);
  return response.data;
};

export const runOntologyInference = async (payload) => {
  const response = await api.post('/api/ontology-inference', payload);
  return response.data;
};

export const getAnalysisHistory = async () => {
  const response = await api.get('/api/scans/history');
  return response.data;
};

export const saveScan = async (payload) => {
  const response = await api.post('/api/scans/save', payload);
  return response.data;
};

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // Needs to match backend 'file: UploadFile = File(...)'
  const response = await api.post('/api/upload/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteScan = async (id) => {
  const response = await api.delete(`/api/scans/${id}`);
  return response.data;
};

export const getScan = async (id) => {
  const response = await api.get(`/api/scans/${id}`);
  return response.data;
};

export const downloadReport = async (scanId) => {
  const response = await api.get(`/api/reports/generate?scan_id=${scanId}`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `PomeGuard_Report_${scanId.slice(0, 8).toUpperCase()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};
