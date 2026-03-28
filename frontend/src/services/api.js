import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  const response = await api.get('/api/history');
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};
