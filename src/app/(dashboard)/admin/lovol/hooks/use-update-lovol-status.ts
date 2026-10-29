import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateLovolStatus = () => {
  const queryClient = useQueryClient();

  const mutationInterviewed = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/api/v1/oprec-lovol/interviewed/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      toast.success("Successfully updated status to Interviewed");
      queryClient.invalidateQueries({ queryKey: ["lovol-registrant", id] });
      queryClient.invalidateQueries({ queryKey: ["lovol-registrants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const mutationRejected = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/api/v1/oprec-lovol/rejected/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      toast.success("Successfully updated status to Rejected");
      queryClient.invalidateQueries({ queryKey: ["lovol-registrant", id] });
      queryClient.invalidateQueries({ queryKey: ["lovol-registrants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const mutationAccepted = useMutation({
    mutationFn: async ({
      id,
      accepted_division_id,
    }: {
      id: string;
      accepted_division_id: string;
    }) => {
      const response = await api.patch(
        `/api/v1/oprec-lovol/accepted/${id}`,
        {},
        {
          params: { accepted_division_id },
        },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Successfully updated status to Accepted");
      queryClient.invalidateQueries({
        queryKey: ["lovol-registrant", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["lovol-registrants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  return {
    updateToInterviewed: mutationInterviewed.mutate,
    updateToRejected: mutationRejected.mutate,
    updateToAccepted: mutationAccepted.mutate,
    isPendingInterviewed: mutationInterviewed.isPending,
    isPendingRejected: mutationRejected.isPending,
    isPendingAccepted: mutationAccepted.isPending,
  };
};

interface LovolDivision {
  id: string;
  name: string;
}

export const useGetDivisions = () => {
  return useQuery<ApiResponse<LovolDivision[]>>({
    queryKey: ["division-list", "lovol"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<LovolDivision[]>>(
        "/api/v1/master/division-lovol",
      );
      return response.data;
    },
  });
};
