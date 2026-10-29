import {
  type CityTourPayload,
  exportCityTourExcel,
  getCityTourRegistrants,
  getMyCityTour,
  registerCityTour,
} from "@/services/city-tour";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetMyCityTour = () => {
  return useQuery({
    queryKey: ["my-city-tour"],
    queryFn: getMyCityTour,
    retry: false,
  });
};

export const useRegisterCityTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CityTourPayload) => registerCityTour(payload),
    onSuccess: () => {
      toast.success("City tour registration submitted");
      queryClient.invalidateQueries({ queryKey: ["my-city-tour"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to submit city tour registration",
      );
    },
  });
};

export const useGetCityTourRegistrants = () => {
  return useQuery({
    queryKey: ["city-tour-registrants"],
    queryFn: getCityTourRegistrants,
  });
};

export const useExportCityTourExcel = () => {
  return useMutation({
    mutationFn: exportCityTourExcel,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "city_tour_data.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error("Failed to export city tour data");
    },
  });
};
