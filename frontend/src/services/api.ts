import axios from "axios";
import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

type RetryRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (
  error: unknown | null,
  token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

const clearAuthentication = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

/*
 * ========================================
 * REQUEST INTERCEPTOR
 * ========================================
 */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * ========================================
 * RESPONSE INTERCEPTOR
 * ========================================
 */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    /*
     * Only handle 401 errors.
     */
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    /*
     * Never refresh the refresh request itself.
     */
    if (originalRequest.url?.includes("/auth/refresh")) {
      clearAuthentication();
      return Promise.reject(error);
    }

    /*
     * Prevent infinite retry loops.
     */
    if (originalRequest._retry) {
      clearAuthentication();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAuthentication();
      return Promise.reject(error);
    }

    /*
     * ========================================
     * WAIT FOR EXISTING REFRESH
     * ========================================
     */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    /*
     * ========================================
     * REFRESH TOKEN
     * ========================================
     */

    isRefreshing = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          refreshToken,
        },
        {
          withCredentials: true,
        }
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
      } = response.data;

      if (!accessToken) {
        throw new Error("No access token returned from refresh endpoint.");
      }

      /*
       * Save new access token.
       */
      localStorage.setItem("token", accessToken);

      /*
       * Refresh-token rotation:
       * replace the old refresh token.
       */
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      /*
       * Resolve requests that were waiting.
       */
      processQueue(null, accessToken);

      /*
       * Retry original request.
       */
      if (!originalRequest.headers) {
        originalRequest.headers = {};
      }

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      /*
       * Reject all waiting requests.
       */
      processQueue(refreshError, null);

      /*
       * Refresh failed → session is invalid.
       */
      clearAuthentication();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;