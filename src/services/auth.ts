import api from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getMe = async () => {
  const response = await api.get("/api/v1/user/me");
  return response.data;
};

export const forgetPassword = async (email: string) => {
  const response = await api.post("/api/v1/user/forget", { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post(
    `/api/v1/user/reset?token=${encodeURIComponent(token)}`,
    { password },
  );
  return response.data;
};
