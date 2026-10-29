import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next/types";
import Cookies from "universal-cookie";

import { getToken } from "@/lib/cookies";
import { DEMO_MODE, demoAuthAdapter } from "@/lib/demo-auth";
import { UninterceptedApiError } from "@/types/api";
const context = <GetServerSidePropsContext>{};

export const baseURL =
  process.env.NEXT_PUBLIC_RUN_MODE === "development"
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: false,
  // Mode demo/arsip: endpoint auth dilayani lokal agar tetap bisa login
  // tanpa backend. Timeout dipendekkan karena API lama sudah tidak aktif.
  ...(DEMO_MODE ? { adapter: demoAuthAdapter, timeout: 10000 } : {}),
});

api.defaults.withCredentials = false;
const isBrowser = typeof window !== "undefined";

api.interceptors.request.use(function (config) {
  if (config.headers) {
    let token: string | undefined;

    if (!isBrowser) {
      if (!context)
        throw "Api Context not found. You must call `setApiContext(context)` before calling api on server-side";

      const cookies = new Cookies(context.req?.headers.cookie);
      token = cookies.get("petrolida2026-token");
    } else {
      token = getToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
  }

  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error: AxiosError<UninterceptedApiError>) => {
    // parse error
    if (error.response?.data.message) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message:
              typeof error.response.data.message === "string"
                ? error.response.data.message
                : Object.values(error.response.data.message)[0][0],
          },
        },
      });
    }
    return Promise.reject(error);
  },
);
export default api;
