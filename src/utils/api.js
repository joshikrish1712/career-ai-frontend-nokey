import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const api = axios.create({ baseURL: API_BASE, timeout: 60000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("caai_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("caai_token");
      localStorage.removeItem("caai_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const loginUser    = (d) => api.post("/auth/login", d);
export const registerUser = (d) => api.post("/auth/register", d);
export const googleLoginApi = (token) => api.post("/auth/google", { id_token: token });
export const getMe        = ()  => api.get("/auth/me");

// ── Resume CRUD ───────────────────────────────────────
export const createResume    = (d)    => api.post("/resume/", d);
export const listResumes     = ()     => api.get("/resume/");
export const getResume       = (id)   => api.get(`/resume/${id}`);
export const updateResume    = (id,d) => api.put(`/resume/${id}`, d);
export const deleteResume    = (id)   => api.delete(`/resume/${id}`);
export const duplicateResume = (id)   => api.post(`/resume/${id}/duplicate`);
export const downloadPDF     = (id)   => api.get(`/resume/${id}/pdf`, { responseType: "blob" });

// ── ATS ───────────────────────────────────────────────
export const uploadResume = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/resume/upload", form);
};

// ── Cover Letter ──────────────────────────────────────
export const generateCoverLetter = (d) => api.post("/cover-letter/generate", d);
export const listCoverLetters    = ()  => api.get("/cover-letter/");
export const deleteCoverLetter   = (id)=> api.delete(`/cover-letter/${id}`);

// ── AI Features ───────────────────────────────────────
export const jobMatchAnalysis  = (d) => api.post("/ai/job-match", d);
export const rewriteBullets    = (d) => api.post("/ai/rewrite-bullets", d);
export const generateSummary   = (d) => api.post("/ai/generate-summary", d);

export default api;
