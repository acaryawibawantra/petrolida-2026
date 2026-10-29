import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { serialize } from "object-to-formdata";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import api from "@/lib/api";
import usePBMRegistrationStore from "@/stores/use-pbm-registration-store";
import { ApiError, ApiResponse } from "@/types/api";
import { RegistrationFormPBMResponse } from "@/types/page/pbm-registration";
import { FormRegistrationPBM } from "@/validation/pbm-registration";

// Types
export interface PbmCountList {
  total_participant: number;
}

export interface PbmInsightItem {
  date: string;
  count: number;
}

export type DetailResponse = ApiResponse<RegistrationFormPBMResponse>;

// Hooks

export function useGetPbmCount() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<PbmCountList>>
  >({
    queryKey: ["countPbm"],
    queryFn: async () => {
      const response = await api.get("/api/v1/pbm/count");
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

export function useGetPbmInsight(batchId?: string) {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<PbmInsightItem[]>>
  >({
    queryKey: ["countDailyPbm", batchId],
    queryFn: async () => {
      const url =
        batchId && batchId !== "all"
          ? `/api/v1/pbm/insight?batch_id=${batchId}`
          : "/api/v1/pbm/insight";
      const response = await api.get(url);
      return response;
    },
    staleTime: Infinity,
  });

  return {
    dailyData: data?.data.data,
    isLoading,
    error,
  };
}

export function useGetDetailRegistrantPBM(user_id: string) {
  const { data: detailData, isLoading } = useQuery<DetailResponse>({
    queryKey: ["detail-registrant", user_id],
    queryFn: async () => {
      const { data } = await api.get<DetailResponse>("/api/v1/pbm/" + user_id);

      return data;
    },
    refetchOnWindowFocus: true,
  });

  return { detailData, isLoading };
}

export function usePBMRegistrationHook() {
  const { fileAttachment, resetFiles, setSuccessData } =
    usePBMRegistrationStore();
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [apiResponse, setApiResponse] =
    useState<RegistrationFormPBMResponse | null>(null);
  const router = useRouter();

  //============== Form Handling ==============

  const form = useForm<z.infer<typeof FormRegistrationPBM>>({
    mode: "onChange",
    resolver: zodResolver(FormRegistrationPBM),
    defaultValues: {},
  });

  // local storage
  useEffect(() => {
    const saved = localStorage.getItem("registrationData");
    if (saved) {
      form.reset(JSON.parse(saved));
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("registrationData", JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Fetch Batch List

  const { data: batchList, isLoading: isBatchLoading } = useQuery({
    queryKey: ["pbm-batch"],
    queryFn: async () => {
      const response = await api.get("/api/v1/master/pbm-batch?public=true");
      return response.data.data;
    },
  });

  function onSubmit(data: z.infer<typeof FormRegistrationPBM>) {
    const payload = {
      ...data,
      follow_instagram: fileAttachment.follow_instagram,
      follow_tiktok: fileAttachment.follow_tiktok,
    };
    handleRegister(serialize(payload));

    localStorage.setItem("registrationData", JSON.stringify(data));
  }

  //================= Integration Handling =================
  const {
    mutate: handleRegister,
    isPending,
    isSuccess,
  } = useMutation<
    AxiosResponse<ApiResponse<RegistrationFormPBMResponse>>,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (data) =>
      await api.post("/api/v1/pbm", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    onSuccess: (response) => {
      toast.success(response.data.message || "Registration is Successful");
      setSuccessData(response.data.data);
      resetFiles();
      localStorage.removeItem("registrationData");
      router.push("/pbm/register/success");
    },

    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data.message ?? "Something went wrong, please retry...",
      );
    },
  });

  return {
    isPending,
    onSubmit,
    form,
    isSuccess,
    apiResponse,
    batchList,
    isBatchLoading,
  };
}

export function useExportPBM() {
  const exportToExcel = useMutation({
    mutationFn: async () => {
      const response = await api.get("/api/v1/pbm/export/excel", {
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
      link.download = `PBM_data_${new Date().getTime()}.xlsx`;
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
      const response = await api.get("/api/v1/pbm/export/csv", {
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
      link.download = `PBM_data_${new Date().getTime()}.csv`;
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
