import axios from 'axios'

const base = import.meta.env.VITE_API_URL
if (!base) {
 console.warn('Warning: VITE_API_URL is not set. Falling back to http://localhost:5000/api for development.\nSet VITE_API_URL in my-project/.env to avoid this.');
}

const api = axios.create({
  baseURL: base || 'http://localhost:5000/api',
})

export default api;