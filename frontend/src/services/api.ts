import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/*
 * ========================================
 * REQUEST INTERCEPTOR
 * ========================================
 *
 * Attach the JWT to every API request.
 *
 * localStorage is used only to retrieve
 * the authentication token.
 *
 * Candidate/user/business data should NOT
 * be stored here.
 */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/*
 * ========================================
 * RESPONSE INTERCEPTOR
 * ========================================
 *
 * Handle authentication failures.
 *
 * If the backend returns 401:
 *
 * Invalid/expired JWT
 *        ↓
 * Remove authentication data
 *        ↓
 * Redirect to login
 */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default api;