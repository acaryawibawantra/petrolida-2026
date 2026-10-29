import api from "@/lib/api";

export type GalaDinnerRsvpCategory =
  | "delegates"
  | "petrolida"
  | "spe"
  | "lovol";
export type GalaDinnerAttendance = "attend" | "unable_to_attend";

export interface GalaDinnerRsvpPayload {
  category: GalaDinnerRsvpCategory;
  full_name: string;
  institution_or_university?: string;
  competition?: string;
  team_name?: string;
  attendance_confirmation: GalaDinnerAttendance;
  petrolida_role?: string;
  petrolida_division?: string;
  spe_role?: string;
}

export interface GalaDinnerRsvp extends GalaDinnerRsvpPayload {
  id: string;
  created_at: string;
}

export interface GalaDinnerRsvpListParams {
  page?: number;
  take?: number;
  filter?: string;
  filter_by?: string;
}

export const createGalaDinnerRsvp = async (payload: GalaDinnerRsvpPayload) => {
  const response = await api.post("/api/v1/gala-dinner-rsvp", payload);
  return response.data;
};

export const getGalaDinnerRsvps = async (params: GalaDinnerRsvpListParams) => {
  const response = await api.get("/api/v1/gala-dinner-rsvp", { params });
  return response.data;
};

export const getGalaDinnerRsvpExportUrl = () => {
  const baseURL = api.defaults.baseURL ?? "";
  return `${baseURL}/api/v1/gala-dinner-rsvp/export`;
};

export const exportGalaDinnerRsvps = async () => {
  const response = await api.get("/api/v1/gala-dinner-rsvp/export", {
    responseType: "blob",
  });
  return response.data as Blob;
};
