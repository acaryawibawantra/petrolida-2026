import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

export interface PetrovisCountList {
  register: number;
}

export function useGetPetrovisCount() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<PetrovisCountList>>
  >({
    queryKey: ["countPetrovis"],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-petrovis/count");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    countData: data?.data.data,
    isLoading,
    error,
  };
}

export function useGetPetrovisList(params: object) {
  return useQuery({
    queryKey: ["petrovis-list", params],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-petrovis", {
        params,
      });
      return response.data;
    },
  });
}

export function useExportPetrovis() {
  const exportToExcel = useMutation({
    mutationFn: async () => {
      const response = await api.get("/api/v1/oprec-petrovis/export/excel", {
        responseType: "blob",
      });
      return response.data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Petrovis_data_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Excel file downloaded successfully!");
    },
    onError: () => {
      toast.error("Failed to export Excel file");
    },
  });

  const exportToCSV = useMutation({
    mutationFn: async () => {
      const response = await api.get("/api/v1/oprec-petrovis/export/csv", {
        responseType: "blob",
      });
      return response.data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Petrovis_data_${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("CSV file downloaded successfully!");
    },
    onError: () => {
      toast.error("Failed to export CSV file");
    },
  });

  return {
    exportToExcel: exportToExcel.mutate,
    exportToCSV: exportToCSV.mutate,
    isExportingExcel: exportToExcel.isPending,
    isExportingCSV: exportToCSV.isPending,
  };
}
