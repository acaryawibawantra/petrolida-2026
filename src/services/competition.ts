import api from "@/lib/api";

export interface CompetitionSubmissionMeta {
  submission_1?: string;
  submission_2?: string;
  submission_3?: string;
  submission_4?: string;
  is_late?: boolean;
  late_duration_minutes?: number;
  late_duration_text?: string;
  deadline_at?: string;
  submitted_at?: string;
}

export interface CompetitionTeam {
  id: string;
  event_name: string;
  team_name: string;
  leader_name: string;
  university: string;
  status: string;
  stage: string;
  last_stage?: string;
  whatsapp_group?: string;
  sale_type?: string;
  final_payment_status?: string;
  accommodation_count?: number;
  non_accommodation_count?: number;
  participants?: Participant[];
  submission?: CompetitionSubmissionMeta;
  rejection_reason?: string;
}

export interface CompetitionTeamDetail {
  id: string;
  team_name: string;
  university: string;
  status: string;
  stage: string;
  last_stage?: string;
  email: string;
  event_id: string;
  event_name: string;
  registration_invoice: string;
  is_international: boolean;
  payment_proof: string;
  whatsapp_group?: string;
  final_whatsapp_group?: string;
  final_link_case?: string;
  sale_type?: string;
  rejection_reason?: string;
  participants: Participant[];
  submission?: CompetitionSubmissionMeta;
  semifinal_payment?: CompetitionSemifinalPayment;
  final_payment?: CompetitionFinalPayment;
  deadline?: string;
}

export interface CompetitionSemifinalPayment {
  status: string;
  amount: number;
  invoice: string;
  order_id: string;
  payment_method: string;
  updated_at?: string;
}

export interface CompetitionFinalPayment {
  status: string;
  accommodation_price: number;
  non_accommodation_price: number;
  accommodation_count: number;
  non_accommodation_count: number;
  total_fee: number;
  invoice: string;
  order_id?: string;
}

export interface Participant {
  id: string;
  name: string;
  gender?: "male" | "female" | "unknown" | "";
  major: string;
  batch: string;
  email: string;
  phone_number: string;
  student_id_card: string;
  twibbon_ig: string;
  story_ig: string;
  follow_ig: string;
  follow_linkedin: string;
  follow_tiktok: string;
  repost_competition_ig: string;
  final_accommodation_type?: "accom" | "non_accom" | null;
  type: "LEADER" | "MEMBER";
}

export interface CompetitionDashboard {
  total_teams: number;
  preliminary: number;
  semifinal?: number;
  final: number;
  completed: number;
  semifinal_payment?: CompetitionSemifinalPaymentResponse;
}

export interface CompetitionOutcomeStatsResponse {
  event_id: string;
  event_name: string;
  has_semifinal: boolean;
  total_registrants: number;
  active_preliminary: number;
  passed_preliminary: number;
  failed_preliminary: number;
  active_semifinal: number;
  passed_semifinal: number;
  failed_semifinal: number;
  finalists: number;
}

export interface CompetitionFinalDashboardSummary {
  total_finalists: number;
  paid: number;
  awaiting_payment: number;
  submitted: number;
  not_submitted: number;
  late_submissions: number;
  on_time_submissions: number;
  total_accommodation: number;
  total_non_accommodation: number;
  total_not_attending: number;
  total_final_fee: number;
  fa_team_count: number;
  na_team_count: number;
  unpaid_team_count: number;
  male_member_count: number;
  female_member_count: number;
  unknown_gender_member_count: number;
  paid_final_fee: number;
  unpaid_final_fee: number;
}

export interface CompetitionFinalDashboardCompetition
  extends CompetitionFinalDashboardSummary {
  event_id: string;
  event_name: string;
}

export interface CompetitionFinalDashboardTeam {
  team_id: string;
  event_id: string;
  event_name: string;
  team_name: string;
  leader_name: string;
  university: string;
  status: string;
  final_payment_status: string;
  total_fee: number;
  accommodation_count: number;
  non_accommodation_count: number;
  not_attending_count: number;
  member_count: number;
  male_count: number;
  female_count: number;
  unknown_gender_count: number;
  participants: Array<{
    name: string;
    gender: "male" | "female" | "unknown";
    final_accommodation_type?: "accom" | "non_accom" | null;
  }>;
  submission_status: "submitted" | "not_submitted";
  is_late: boolean;
  late_duration_minutes: number;
  late_duration_text: string;
  deadline_at: string;
  submitted_at: string;
}

export interface CompetitionFinalDashboardResponse {
  summary: CompetitionFinalDashboardSummary;
  by_competition: CompetitionFinalDashboardCompetition[];
  teams: CompetitionFinalDashboardTeam[];
}

export interface CompetitionSemifinalPaymentResponse {
  invoice_url: string;
  amount: number;
  order_id: string;
  status: string;
}

export interface CompetitionUniversityChartItem {
  university: string;
  team_count: number;
}

export interface CompetitionAngkatanChartItem {
  angkatan: string;
  team_count: number;
}

export interface CompetitionListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  stage?: string;
  event_name?: string;
  event_id?: string;
}

export interface CompetitionListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  sort: string;
  filter: string;
  filterBy: string;
}

export interface CompetitionListResult {
  rows: CompetitionTeam[];
  meta: CompetitionListMeta;
}

type CompetitionRawMeta = {
  take?: number;
  limit?: number;
  page?: number;
  total_data?: number;
  total?: number;
  count?: number;
  total_page?: number;
  sort?: string;
  filter?: string;
  filter_by?: string;
};

type CompetitionListPayload = {
  data?:
    | CompetitionTeam[]
    | {
        data?: CompetitionTeam[];
        meta?: CompetitionRawMeta | CompetitionRawMeta[];
      };
  meta?: unknown;
};

const getCompetitionRawMeta = (
  meta: CompetitionRawMeta | CompetitionRawMeta[] | undefined,
): CompetitionRawMeta | undefined => {
  if (Array.isArray(meta)) {
    return meta[0];
  }

  return meta;
};

const normalizeCompetitionTeamsResponse = (
  payload: CompetitionListPayload,
  fallbackPage = 1,
  fallbackPageSize = 10,
): CompetitionListResult => {
  let metaData = getCompetitionRawMeta(
    payload?.meta as CompetitionRawMeta | CompetitionRawMeta[] | undefined,
  );
  const listData = payload?.data as
    | CompetitionTeam[]
    | {
        data?: CompetitionTeam[];
        meta?: CompetitionRawMeta | CompetitionRawMeta[];
      }
    | undefined;

  if (
    (!metaData || Object.keys(metaData).length === 0) &&
    listData &&
    !Array.isArray(listData) &&
    listData.meta
  ) {
    metaData = getCompetitionRawMeta(listData.meta);
  }

  const rows = Array.isArray(listData)
    ? listData
    : Array.isArray(listData?.data)
      ? listData.data
      : [];

  const pageSize =
    Number(metaData?.take ?? metaData?.limit ?? fallbackPageSize) ||
    fallbackPageSize;
  const total =
    Number(metaData?.total_data ?? metaData?.total ?? metaData?.count ?? 0) ||
    0;
  const totalPage =
    Number(metaData?.total_page) ||
    (total > 0 ? Math.ceil(total / pageSize) : 0);

  return {
    rows,
    meta: {
      page: Number(metaData?.page ?? fallbackPage) || fallbackPage,
      pageSize,
      total,
      totalPage,
      sort: String(metaData?.sort ?? ""),
      filter: String(metaData?.filter ?? ""),
      filterBy: String(metaData?.filter_by ?? ""),
    },
  };
};

// Admin APIs
export const getAllCompetitionTeams = async (params: CompetitionListParams) => {
  const response = await api.get("/api/v1/competition", { params });
  return normalizeCompetitionTeamsResponse(
    response.data,
    params.page ?? 1,
    params.limit ?? 10,
  );
};

export const getCompetitionDashboard = async (params?: {
  event_name?: string;
  event_id?: string;
}) => {
  const response = await api.get("/api/v1/competition/dashboard", { params });
  return response.data;
};

export const getCompetitionTeamDetail = async (id: string) => {
  const response = await api.get(`/api/v1/competition/${id}`);
  return response.data;
};

export const updateTeamStage = async (id: string, stage: string) => {
  const response = await api.patch(`/api/v1/competition/status/stage/${id}`, {
    stage,
  });
  return response.data;
};

export const payCompetitionFinal = async (data: {
  payment_method: string;
  participants: Array<{
    participant_id: string;
    final_accommodation_type: "accom" | "non_accom" | null;
  }>;
}) => {
  const response = await api.post("/api/v1/competition/final/pay", data);
  return response.data;
};

export const cancelCompetitionFinalInvoice = async () => {
  const response = await api.delete("/api/v1/competition/final/invoice");
  return response.data;
};

export const rejectTeam = async (id: string, reason: string) => {
  const response = await api.patch(
    `/api/v1/competition/status/rejected/${id}`,
    { reason },
  );
  return response.data;
};

export const verifyTeam = async (id: string, event_id: string) => {
  const response = await api.patch(
    `/api/v1/competition/status/verified/${id}`,
    {
      event_id,
    },
  );
  return response.data;
};

export const markTeamAsPaid = async (id: string) => {
  const response = await api.patch(`/api/v1/competition/status/paid/${id}`);
  return response.data;
};

export const completeTeam = async (id: string) => {
  const response = await api.patch(`/api/v1/competition/status/complete/${id}`);
  return response.data;
};

// User APIs
export const getMyTeam = async () => {
  const response = await api.get("/api/v1/competition/me");
  return response.data;
};

export const getAllCompetitionNames = async () => {
  const response = await api.get("/api/v1/competition/names");
  return response.data;
};

export const getCompetitionStats = async () => {
  const response = await api.get("/api/v1/competition/stats");
  return response.data;
};

export const getCompetitionFinalDashboard = async () => {
  const response = await api.get("/api/v1/competition/final-dashboard");
  return response.data;
};

export const getCompetitionOutcomeStats = async (eventId: string) => {
  const response = await api.get(
    `/api/v1/competition/stats/outcome/${eventId}`,
  );
  return response.data;
};

export const getCompetitionUniversityChart = async () => {
  const response = await api.get("/api/v1/competition/chart/university");
  return response.data;
};

export const getCompetitionAngkatanChart = async () => {
  const response = await api.get("/api/v1/competition/chart/angkatan");
  return response.data;
};

export const getCompetitionNameById = async (id: string) => {
  const response = await api.get(`/api/v1/competition/names/${id}`);
  return response.data;
};

export const getCompetitionPriceById = async (id: string) => {
  const response = await api.get(`/api/v1/competition/price/${id}`);
  return response.data;
};

export const registerCompetition = async (
  formData: FormData,
  onUploadProgress?: (progressEvent: {
    loaded: number;
    total?: number;
  }) => void,
) => {
  const response = await api.post("/api/v1/competition", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};

export const updateCompetition = async (
  team_id: string,
  formData: FormData,
) => {
  const response = await api.put(`/api/v1/competition/${team_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const resubmitCompetition = async (
  team_id: string,
  formData: FormData,
) => {
  const response = await api.put(
    `/api/v1/competition/resubmit/${team_id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const addCompetitionParticipant = async (
  teamId: string,
  formData: FormData,
) => {
  const response = await api.post(
    `/api/v1/competition/${teamId}/participant`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const editCompetitionParticipant = async (
  participantId: string,
  formData: FormData,
) => {
  const response = await api.patch(
    `/api/v1/competition/participant/${participantId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteCompetitionParticipant = async (participantId: string) => {
  const response = await api.delete(
    `/api/v1/competition/participant/${participantId}`,
  );
  return response.data;
};

export const submitFileSubmission = async (formData: FormData) => {
  const response = await api.post("/api/v1/competition/submission", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateFileSubmission = async (formData: FormData) => {
  const response = await api.put("/api/v1/competition/submission", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const payCompetition = async (data: {
  payment_method?: string;
  referral_code?: string;
}) => {
  const response = await api.post("/api/v1/competition/pay", data);
  return response.data;
};

export const payCompetitionSemifinal = async (data: {
  payment_method: string;
}) => {
  const response = await api.post("/api/v1/competition/semifinal/pay", data);
  return response.data;
};

export const uploadPaymentProof = async (formData: FormData) => {
  const response = await api.post(
    "/api/v1/competition/payment-proof",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const checkReferralCode = async (code: string, _eventId: string) => {
  const response = await api.get(`/api/v1/voucher-code/check?code=${code}`);
  return response.data;
};

// International Pricing APIs
export interface InternationalPrice {
  base_price_idr: number;
  fee_idr: number;
  total_idr: number;
  exchange_rate: number;
  total_usd: number;
}

export const getInternationalPrice = async (eventId: string) => {
  const response = await api.get(
    `/api/v1/competition/international-price/${eventId}`,
  );
  return response.data;
};

export const uploadInternationalPaymentProof = async (formData: FormData) => {
  const response = await api.post(
    "/api/v1/competition/payment-proof",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
