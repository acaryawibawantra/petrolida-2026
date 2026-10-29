import * as competitionService from "@/services/competition";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Admin Hooks
export const useGetAllCompetitionTeams = (
  params: competitionService.CompetitionListParams,
) => {
  return useQuery({
    queryKey: ["competition-teams", params],
    queryFn: () => competitionService.getAllCompetitionTeams(params),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale to refetch
  });
};

export const useGetCompetitionDashboard = (params?: {
  event_name?: string;
  event_id?: string;
}) => {
  return useQuery({
    queryKey: ["competition-dashboard", params],
    queryFn: () => competitionService.getCompetitionDashboard(params),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale to refetch
  });
};

export const useGetCompetitionTeamDetail = (id: string) => {
  return useQuery({
    queryKey: ["competition-team-detail", id],
    queryFn: () => competitionService.getCompetitionTeamDetail(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale to refetch
  });
};

export const useUpdateTeamStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      competitionService.updateTeamStage(id, stage),
    onSuccess: () => {
      toast.success("Team stage updated successfully");
      queryClient.invalidateQueries({ queryKey: ["competition-teams"] });
      queryClient.invalidateQueries({ queryKey: ["competition-dashboard"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update team stage";
      toast.error(errorMessage);
    },
  });
};

export const useVerifyTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, event_id }: { id: string; event_id: string }) =>
      competitionService.verifyTeam(id, event_id),
    onSuccess: () => {
      toast.success("Team verified successfully");
      queryClient.invalidateQueries({ queryKey: ["competition-teams"] });
      queryClient.invalidateQueries({ queryKey: ["competition-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["competition-team-detail"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to verify team";
      toast.error(errorMessage);
    },
  });
};

export const useRejectTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      competitionService.rejectTeam(id, reason),
    onSuccess: () => {
      toast.success("Team rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["competition-teams"] });
      queryClient.invalidateQueries({ queryKey: ["competition-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["competition-team-detail"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to reject team";
      toast.error(errorMessage);
    },
  });
};

export const useMarkTeamAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => competitionService.markTeamAsPaid(id),
    onSuccess: () => {
      toast.success("Team marked as paid successfully");
      queryClient.invalidateQueries({ queryKey: ["competition-teams"] });
      queryClient.invalidateQueries({ queryKey: ["competition-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["competition-team-detail"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to mark team as paid";
      toast.error(errorMessage);
    },
  });
};

export const useCompleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => competitionService.completeTeam(id),
    onSuccess: () => {
      toast.success("Team completed successfully");
      queryClient.invalidateQueries({ queryKey: ["competition-teams"] });
      queryClient.invalidateQueries({ queryKey: ["competition-dashboard"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to complete team";
      toast.error(errorMessage);
    },
  });
};

// User Hooks
export const useGetMyTeam = () => {
  return useQuery({
    queryKey: ["my-competition-team"],
    queryFn: () => competitionService.getMyTeam(),
    staleTime: 0, // Always refetch to get latest status
    gcTime: 1000 * 60 * 15, // Cache disimpan selama 15 menit
    retry: 0, // 404 = no team, is expected — not a transient error
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch on component mount
  });
};

export const useGetAllCompetitionNames = () => {
  return useQuery({
    queryKey: ["competition-names"],
    queryFn: () => competitionService.getAllCompetitionNames(),
    staleTime: 1000 * 60 * 10, // Data dianggap fresh selama 10 menit
    gcTime: 1000 * 60 * 30, // Cache disimpan selama 30 menit (gcTime menggantikan cacheTime di v5)
  });
};

export const useGetCompetitionStats = () => {
  return useQuery({
    queryKey: ["competition-stats"],
    queryFn: () => competitionService.getCompetitionStats(),
    staleTime: 0, // Always refetch to get latest stats
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetCompetitionFinalDashboard = () => {
  return useQuery({
    queryKey: ["competition-final-dashboard"],
    queryFn: () => competitionService.getCompetitionFinalDashboard(),
    staleTime: 0,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetCompetitionOutcomeStats = (eventId: string) => {
  return useQuery({
    queryKey: ["competition-outcome-stats", eventId],
    queryFn: () => competitionService.getCompetitionOutcomeStats(eventId),
    enabled: !!eventId,
    staleTime: 0,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetCompetitionUniversityChart = () => {
  return useQuery({
    queryKey: ["competition-university-chart"],
    queryFn: () => competitionService.getCompetitionUniversityChart(),
    staleTime: 0,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetCompetitionAngkatanChart = () => {
  return useQuery({
    queryKey: ["competition-angkatan-chart"],
    queryFn: () => competitionService.getCompetitionAngkatanChart(),
    staleTime: 0,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetCompetitionNameById = (id: string) => {
  return useQuery({
    queryKey: ["competition-name", id],
    queryFn: () => competitionService.getCompetitionNameById(id),
    enabled: !!id,
  });
};

export const useGetCompetitionPriceById = (id: string) => {
  return useQuery({
    queryKey: ["competition-price", id],
    queryFn: () => competitionService.getCompetitionPriceById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes - price doesn't change often
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 1, // Only retry once for faster failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
};

export const useRegisterCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      onUploadProgress,
    }: {
      formData: FormData;
      onUploadProgress?: (progressEvent: {
        loaded: number;
        total?: number;
      }) => void;
    }) => competitionService.registerCompetition(formData, onUploadProgress),
    onSuccess: () => {
      toast.success("Competition registered successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      // Network-level errors (no response from server – connection dropped, offline, etc.)
      if (error?.code === "ERR_NETWORK" || !error?.response) {
        toast.error(
          "Failed to reach the server. Please check your internet connection and try again.",
        );
        return;
      }

      // Request was made but timed out (ECONNABORTED / timeout)
      if (error?.code === "ECONNABORTED") {
        toast.error(
          "Upload timed out. Try reducing your file sizes or use a more stable connection.",
        );
        return;
      }

      // Server received the request but rejected it because it is too large (Nginx / reverse-proxy)
      if (error?.response?.status === 413) {
        toast.error(
          "Total file size is too large. Please reduce your image sizes before trying again.",
        );
        return;
      }

      // Backend returned a structured error message (400 validation, 409 conflict, etc.)
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to register for the competition. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      team_id,
      formData,
    }: { team_id: string; formData: FormData }) =>
      competitionService.updateCompetition(team_id, formData),
    onSuccess: () => {
      toast.success("Competition updated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update competition";
      toast.error(errorMessage);
    },
  });
};

export const useResubmitCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      team_id,
      formData,
    }: { team_id: string; formData: FormData }) =>
      competitionService.resubmitCompetition(team_id, formData),
    onSuccess: (response: any) => {
      toast.success(
        response?.message ||
          response?.data?.message ||
          "Competition resubmitted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to resubmit competition";
      toast.error(errorMessage);
    },
  });
};

export const useAddCompetitionParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      formData,
    }: {
      teamId: string;
      formData: FormData;
    }) => competitionService.addCompetitionParticipant(teamId, formData),
    onSuccess: (response: any) => {
      toast.success(
        response?.message ||
          response?.data?.message ||
          "Participant added successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to add participant";
      toast.error(errorMessage);
    },
  });
};

export const useEditCompetitionParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      participantId,
      formData,
    }: {
      participantId: string;
      formData: FormData;
    }) =>
      competitionService.editCompetitionParticipant(participantId, formData),
    onSuccess: (response: any) => {
      toast.success(
        response?.message ||
          response?.data?.message ||
          "Participant updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update participant";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteCompetitionParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) =>
      competitionService.deleteCompetitionParticipant(participantId),
    onSuccess: (response: any) => {
      toast.success(
        response?.message ||
          response?.data?.message ||
          "Participant deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete participant";
      toast.error(errorMessage);
    },
  });
};

export const useSubmitFileSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      competitionService.submitFileSubmission(formData),
    onSuccess: (response: any) => {
      toast.success(
        response?.message ||
          response?.data?.message ||
          "File submitted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to submit file";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateFileSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      competitionService.updateFileSubmission(formData),
    onSuccess: (response: any) => {
      toast.success(
        response?.message ||
          response?.data?.message ||
          "File updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update file";
      toast.error(errorMessage);
    },
  });
};

export const usePayCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { payment_method?: string; referral_code?: string }) =>
      competitionService.payCompetition(data),
    onSuccess: () => {
      toast.success("Payment initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to initiate payment";
      toast.error(errorMessage);
    },
  });
};

export const usePayCompetitionSemifinal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { payment_method: string }) =>
      competitionService.payCompetitionSemifinal(data),
    onSuccess: () => {
      toast.success("Semifinal payment initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to initiate semifinal payment";
      toast.error(errorMessage);
    },
  });
};

export const usePayCompetitionFinal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      payment_method: string;
      participants: Array<{
        participant_id: string;
        final_accommodation_type: "accom" | "non_accom" | null;
      }>;
    }) => competitionService.payCompetitionFinal(data),
    onSuccess: () => {
      toast.success("Final payment initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
      queryClient.invalidateQueries({ queryKey: ["competition-team-detail"] });
    },
  });
};

export const useCancelCompetitionFinalInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => competitionService.cancelCompetitionFinalInvoice(),
    onSuccess: () => {
      toast.success("Final invoice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
      queryClient.invalidateQueries({ queryKey: ["competition-team-detail"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to delete final invoice";
      toast.error(errorMessage);
    },
  });
};

export const useCheckReferralCode = () => {
  return useMutation({
    mutationFn: ({ code, eventId }: { code: string; eventId: string }) =>
      competitionService.checkReferralCode(code, eventId),
  });
};

export const useUploadPaymentProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      competitionService.uploadPaymentProof(formData),
    onSuccess: () => {
      toast.success("Payment proof uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to upload payment proof";
      toast.error(errorMessage);
    },
  });
};

// International Pricing Hooks
export const useGetInternationalPrice = (eventId: string) => {
  return useQuery({
    queryKey: ["international-price", eventId],
    queryFn: () => competitionService.getInternationalPrice(eventId),
    enabled: !!eventId,
  });
};

export const useUploadInternationalPaymentProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      competitionService.uploadInternationalPaymentProof(formData),
    onSuccess: () => {
      toast.success("PayPal payment proof uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["my-competition-team"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to upload PayPal payment proof";
      toast.error(errorMessage);
    },
  });
};
