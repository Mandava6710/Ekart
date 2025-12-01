import axios from 'axios';

// Use /api path for production (served from same domain/port as backend)
// This works when frontend is embedded in Spring Boot JAR
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

console.log('=== API Configuration ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_TIMEOUT:', process.env.REACT_APP_API_TIMEOUT);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000, // Reduced to 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('API Request:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      timeout: config.timeout
    });
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      hasResponse: !!error.response,
      status: error.response?.status,
      baseURL: error.config?.baseURL,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Order API calls
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateWithCarrier: (oid, tid) => api.put(`/updateorder/${oid}/assigncarrier/${tid}`),
  assignCarrier: (oid, cid) => api.put(`/orders/${oid}/assigncarrier/${cid}`),
  updateLoading: (oid, lid) => api.put(`/updateloading/${oid}/assigndate/${lid}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  complete: (id) => api.put(`/orders/${id}/complete`),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Truck API calls
export const truckAPI = {
  getAll: () => api.get('/trucks'),
  getById: (id) => api.get(`/findTruck`, { params: { id } }),
  create: (data) => api.post('/saveTruck', data),
  update: (id, cid) => api.put(`/updatetruck/${id}/assigncarrier/${cid}`),
  delete: (id) => api.delete(`/trucks/${id}`),
};

// Driver API calls
export const driverAPI = {
  getAll: () => api.get('/drivers'),
  getById: (id) => api.get(`/findDriver`, { params: { id } }),
  create: (data) => api.post('/saveDriver', data),
  update: (id, tid, cid) => api.put(`/updatedriver/${id}/assigntruck/${tid}/assigncarrier/${cid}`),
  delete: (id) => api.delete(`/drivers/${id}`),
};

// Carrier API calls
export const carrierAPI = {
  getAll: () => api.get('/carriers'),
  getById: (id) => api.get(`/findcarrier`, { params: { id } }),
  create: (data) => api.post('/savecarrier', data),
  update: (id, data) => api.put(`/carriers/${id}`, data),
  delete: (id) => api.delete(`/carriers/${id}`),
};

// Address API calls
export const addressAPI = {
  getAll: () => api.get('/addresses'),
  getById: (id) => api.get(`/addresses/${id}`),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
};

// Cargo API calls
export const cargoAPI = {
  getAll: () => api.get('/cargo'),
  getById: (id) => api.get(`/cargo/${id}`),
  create: (data) => api.post('/cargo', data),
  update: (id, data) => api.put(`/cargo/${id}`, data),
  delete: (id) => api.delete(`/cargo/${id}`),
};

// Loading API calls
export const loadingAPI = {
  getAll: () => api.get('/loadings'),
  getById: (id) => api.get(`/loadings/${id}`),
  create: (data) => api.post('/loadings', data),
  update: (id, data) => api.put(`/loadings/${id}`, data),
  delete: (id) => api.delete(`/loadings/${id}`),
};

// UnLoading API calls
export const unloadingAPI = {
  getAll: () => api.get('/unloadings'),
  getById: (id) => api.get(`/unloadings/${id}`),
  create: (data) => api.post('/unloadings', data),
  update: (id, data) => api.put(`/unloadings/${id}`, data),
  delete: (id) => api.delete(`/unloadings/${id}`),
};

// Customer API calls
export const customerAPI = {
  getAll: () => api.get('/getAllCustomers'),
  getById: (id) => api.get('/findCustomer', { params: { id } }),
  create: (data) => api.post('/saveCustomer', data),
  update: (data) => api.put('/updateCustomer', data),
  delete: (id) => api.post(`/deleteCustomer/${id}`),
};

// Admin API calls
export const adminAPI = {
  getAll: () => api.get('/getAllAdmins'),
  getById: (id) => api.get('/findAdmin', { params: { id } }),
  create: (data) => api.post('/saveAdmin', data),
  update: (data) => api.put('/updateAdmin', data),
  delete: (id) => api.post(`/deleteAdmin/${id}`),
};

// Authentication API calls
export const authAPI = {
  login: (email, password, userType) => 
    api.post('/auth/login', { mail: email, password, userType }),
  customerLogin: (email, password) => 
    api.post('/auth/customer-login', { mail: email, password, userType: 'CUSTOMER' }),
  adminLogin: (email, password) => 
    api.post('/auth/admin-login', { mail: email, password, userType: 'ADMIN' }),
};

export default api;
