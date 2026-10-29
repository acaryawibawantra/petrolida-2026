import api from "@/lib/api";

export interface CityTourAttendee {
  participant_id: string;
  participant_name: string;
  final_accommodation_type: "accom" | "non_accom" | "";
  fee: number;
}

export interface CityTourRegistration {
  id: string;
  name: string;
  student_id: string;
  university: string;
  competition_team_name?: string;
  attending_member: number;
  have_any_alergies: string;
  any_song_request: string;
  total_fee: number;
  invoice_url: string;
  order_id?: string;
  payment_status: "pending" | "paid" | "cancelled" | "";
  attendees: CityTourAttendee[];
}

export interface CityTourListResponse {
  data: CityTourRegistration[];
  meta?: any;
}

export interface CityTourPayload {
  name: string;
  student_id: string;
  university: string;
  attendee_participant_ids: string[];
  have_any_alergies: string;
  any_song_request: string;
  is_replaced: boolean;
}

export const registerCityTour = async (payload: CityTourPayload) => {
  const response = await api.post("/api/v1/city-tour", payload);
  return response.data;
};

export const getMyCityTour = async () => {
  const response = await api.get("/api/v1/city-tour/me");
  return response.data;
};

export const getCityTourRegistrants = async () => {
  const response = await api.get("/api/v1/city-tour", {
    params: { take: 1000 },
  });
  return response.data as CityTourListResponse;
};

export const exportCityTourExcel = async () => {
  const response = await api.get("/api/v1/city-tour/export/excel", {
    responseType: "blob",
  });
  return response.data as Blob;
};
