import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProjects = async (page = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/projects/?page=${page}&page_size=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProject = async (id) => {
  try {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects/', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}/`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    await api.delete(`/projects/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
};

export const fetchProjectsByCountry = async (countryName) => {
  try {
    const response = await api.get(`/api/projects/country/${countryName}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for country ${countryName}:`, error);
    throw error;
  }
};

export const fetchProjectsByStatus = async (statusName) => {
  try {
    const response = await api.get(`/api/projects/approval-status/${statusName}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects with status ${statusName}:`, error);
    throw error;
  }
};

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/api/dashboard/');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
