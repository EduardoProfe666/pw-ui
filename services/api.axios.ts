import axios from 'axios';

const config = useRuntimeConfig();
const api = axios.create({
    baseURL: config.public.apiBase,
});

export default api;