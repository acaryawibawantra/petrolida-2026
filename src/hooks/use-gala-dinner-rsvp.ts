import {
  type GalaDinnerRsvpListParams,
  type GalaDinnerRsvpPayload,
  createGalaDinnerRsvp,
  getGalaDinnerRsvps,
} from "@/services/gala-dinner-rsvp";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateGalaDinnerRsvp = () => {
  return useMutation({
    mutationFn: (payload: GalaDinnerRsvpPayload) =>
      createGalaDinnerRsvp(payload),
    onSuccess: () => {
      toast.success("RSVP submitted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to submit RSVP",
      );
    },
  });
};

export const useGetGalaDinnerRsvps = (params: GalaDinnerRsvpListParams) => {
  return useQuery({
    queryKey: ["gala-dinner-rsvps", params],
    queryFn: () => getGalaDinnerRsvps(params),
  });
};
