const TOKEN_KEY = "petrolida2026-token";

export const getToken = (): string => {
  // Try localStorage first, then sessionStorage, then return empty string
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ""
    );
  }
  return "";
};

export const setToken = (token: string, persistent: boolean = true) => {
  if (typeof window !== "undefined") {
    if (persistent) {
      // Store in localStorage for persistent login
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      // Store in sessionStorage for session-only login
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
};
