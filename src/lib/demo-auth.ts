import {
  AxiosError,
  getAdapter,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Demo auth (frontend-only).
 *
 * Dipakai ketika `NEXT_PUBLIC_DEMO_MODE=true`, misalnya untuk deploy arsip
 * tahun lalu saat backend sudah tidak tersedia lagi. Hanya endpoint login dan
 * `/api/v1/user/me` yang di-mock; request lain tetap diteruskan ke API asli.
 */

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_PASSWORD = "petrolida2026";

const TOKEN_PREFIX = "demo-token-";

type DemoAccount = {
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  name: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "admin@petrolida.com",
    password: DEMO_PASSWORD,
    role: "ADMIN",
    name: "Demo Admin",
  },
  {
    email: "user@petrolida.com",
    password: DEMO_PASSWORD,
    role: "USER",
    name: "Demo User",
  },
];

const tokenFor = (role: DemoAccount["role"]) =>
  `${TOKEN_PREFIX}${role.toLowerCase()}`;

const accountFromToken = (token: string) => {
  if (!token.startsWith(TOKEN_PREFIX)) return undefined;
  const role = token.slice(TOKEN_PREFIX.length).toUpperCase();
  return DEMO_ACCOUNTS.find((account) => account.role === role);
};

const getRequestPath = (config: InternalAxiosRequestConfig) => {
  const url = config.url ?? "";
  return url.split("?")[0].replace(/\/+$/, "");
};

const getRequestToken = (config: InternalAxiosRequestConfig) => {
  const headers = config.headers as unknown as {
    get?: (name: string) => unknown;
  };
  const raw =
    typeof headers?.get === "function" ? headers.get("Authorization") : undefined;
  return typeof raw === "string" ? raw.replace(/^Bearer\s+/i, "") : "";
};

const parseJsonBody = (data: unknown): Record<string, unknown> => {
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof data === "object" && data !== null) {
    return data as Record<string, unknown>;
  }
  return {};
};

const okResponse = <T,>(
  config: InternalAxiosRequestConfig,
  data: T,
): AxiosResponse => ({
  data: { success: true, message: "Success", status: true, code: 200, data },
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

const unauthorized: (
  config: InternalAxiosRequestConfig,
  message: string,
) => never = (config, message) => {
  throw new AxiosError(message, "401", config, undefined, {
    data: { success: false, message, status: false, code: 401, error: message },
    status: 401,
    statusText: "Unauthorized",
    headers: {},
    config,
  } as AxiosResponse);
};

/**
 * Adapter yang menangani endpoint auth secara lokal, sisanya diteruskan ke
 * adapter bawaan axios agar perilaku request lain tidak berubah.
 */
export const demoAuthAdapter: AxiosAdapter = async (config) => {
  const path = getRequestPath(config);
  const method = (config.method ?? "get").toLowerCase();

  if (method === "post" && path === "/api/v1/user/login") {
    const body = parseJsonBody(config.data);
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const account = DEMO_ACCOUNTS.find((item) => item.email === email);

    if (!account || body.password !== account.password) {
      unauthorized(config, "Email atau password salah");
    }

    return okResponse(config, { token: tokenFor(account.role), role: account.role });
  }

  if (method === "get" && path === "/api/v1/user/me") {
    const account = accountFromToken(getRequestToken(config));

    if (!account) {
      unauthorized(config, "Sesi login tidak valid");
    }

    return okResponse(config, {
      name: account.name,
      email: account.email,
      role: account.role,
      is_register: true,
      event_name: "Oil Rig Design",
      status_competition: "verified",
      stage_competition: "preliminary",
    });
  }

  return getAdapter(["xhr", "http", "fetch"])(config);
};
