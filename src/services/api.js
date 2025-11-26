import axios from 'axios';

// If a production base is provided via env, prefer it (set REACT_APP_API_BASE)
const ENV_BASE_RAW = typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE ? process.env.REACT_APP_API_BASE : null;

// Candidate bases (frontend will attempt to detect correct backend location)
const CANDIDATES = [
  'http://localhost/pokedex_backend',
  'http://localhost/formulario/pokedex_backend',
  typeof window !== 'undefined' ? `${window.location.origin}/pokedex_backend` : null,
  typeof window !== 'undefined' ? `${window.location.origin}/formulario/pokedex_backend` : null,
].filter(Boolean);

let cachedBase = null;

async function findWorkingBase() {
  if (cachedBase) return cachedBase;
  // If environment variable explicitly sets the API base, use it immediately
  if (ENV_BASE_RAW) {
    // If env value is an absolute URL, use it; if it's a path (starts with '/'), prefix with origin
    if (ENV_BASE_RAW.startsWith('http://') || ENV_BASE_RAW.startsWith('https://')) {
      cachedBase = ENV_BASE_RAW.replace(/\/$/, '');
      return cachedBase;
    }
    if (typeof window !== 'undefined' && ENV_BASE_RAW.startsWith('/')) {
      cachedBase = `${window.location.origin}${ENV_BASE_RAW}`.replace(/\/$/, '');
      return cachedBase;
    }
    // otherwise fall through to candidates
  }
  for (const base of CANDIDATES) {
    try {
      const url = `${base}/auth_status.php`;
      const res = await axios.get(url, { timeout: 2500, withCredentials: true });
      if (res && (res.status >= 200 && res.status < 300)) {
        cachedBase = base;
        return base;
      }
    } catch (e) {
      // try next
    }
  }
  cachedBase = CANDIDATES[0];
  return cachedBase;
}

async function baseUrl() {
  return await findWorkingBase();
}

// Construye la URL pública donde se sirven las imágenes subidas
export function uploadsUrl(filename) {
  if (!filename) return '';
  // If the stored value is already a full URL, return it unchanged
  if (typeof filename === 'string' && (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('//'))) {
    return filename;
  }
  const candidateForm = CANDIDATES.find((c) => c.includes('/formulario/')) || CANDIDATES[0];
  const base = cachedBase || candidateForm;
  // If base is relative (shouldn't happen), prefix with origin
  if (base && (base.startsWith('http://') || base.startsWith('https://'))) {
    return `${base.replace(/\/$/, '')}/uploads/${filename}`;
  }
  if (typeof window !== 'undefined') {
    // Fallback to same-origin + candidate path
    return `${window.location.origin}${base.replace(/\/$/, '')}/uploads/${filename}`;
  }
  return `${base}/uploads/${filename}`;
}

export async function getPokemons() {
  const base = await baseUrl();
  const res = await axios.get(`${base}/listar.php`, { withCredentials: true });
  return res.data || [];
}

export async function registerPokemon(formData) {
  const base = await baseUrl();
  // Do not set Content-Type header manually so axios/browser can set the boundary
  const res = await axios.post(`${base}/registrar.php`, formData, {
    withCredentials: true,
  });
  return res.data;
}

export async function updatePokemon(formDataOrObj) {
  const base = await baseUrl();
  // if FormData provided (with image), send as multipart, else send as JSON
  if (typeof FormData !== 'undefined' && formDataOrObj instanceof FormData) {
    const res = await axios.post(`${base}/actualizar.php`, formDataOrObj, { withCredentials: true });
    return res.data;
  }
  const res = await axios.post(`${base}/actualizar.php`, formDataOrObj, { withCredentials: true });
  return res.data;
}

export async function deletePokemon(id) {
  const base = await baseUrl();
  const res = await axios.post(`${base}/eliminar.php`, { id }, { withCredentials: true });
  return res.data;
}

export async function loginUser(username, password) {
  const base = await baseUrl();
  const data = new URLSearchParams();
  data.append('username', username);
  data.append('password', password);
  const res = await axios.post(`${base}/login.php`, data, { withCredentials: true });
  return res.data;
}

export async function logoutUser() {
  const base = await baseUrl();
  const res = await axios.post(`${base}/logout.php`, {}, { withCredentials: true });
  return res.data;
}

export async function registerUser(username, password) {
  const base = await baseUrl();
  const data = new URLSearchParams();
  data.append('username', username);
  data.append('password', password);
  const res = await axios.post(`${base}/register_user.php`, data, { withCredentials: true });
  return res.data;
}

export async function checkAuth() {
  const base = await baseUrl();
  const res = await axios.get(`${base}/auth_status.php`, { withCredentials: true });
  return res.data;
}

export default {
  getPokemons,
  registerPokemon,
  updatePokemon,
  deletePokemon,
  loginUser,
  logoutUser,
  registerUser,
  checkAuth,
};
