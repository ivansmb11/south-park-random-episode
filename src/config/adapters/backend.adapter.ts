import { AxiosAdapter } from "./http/axios.adapter";

export const backendFetcher = new AxiosAdapter({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_API_KEY || "",
  },
  withCredentials: false,
});
