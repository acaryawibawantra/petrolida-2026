export type User = {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  is_register: boolean;
  event_name: string | null;
  status_competition: string;
  stage_competition: string;
};

export type withToken = {
  token: string;
};
