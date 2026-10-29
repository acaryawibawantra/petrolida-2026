import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { serialize } from "object-to-formdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import api from "@/lib/api";
import useLovolRegistrationStore from "@/stores/use-lovol-file-store";
import { ApiResponse } from "@/types/api";
import { FormLovolRegistrationSchema } from "@/validation/lovol-registration";

// Types
export interface LovolCountList {
  register: number;
  interviewed: number;
  rejected: number;
  accepted: number;
}

export interface LovolInsightItem {
  date: string;
  count: number;
}

type LovolFormType = z.infer<typeof FormLovolRegistrationSchema>;

type ApiSuccess<T> = {
  status: true;
  message: string;
  data: T;
};

type ApiErrorType = {
  status: false;
  message: string;
  error?: string;
};

type ApiResponseCustom<T> = ApiSuccess<T> | ApiErrorType;

// Hooks

export function useGetLovolCount() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<LovolCountList>>
  >({
    queryKey: ["countLovol"],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-lovol/count");
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

export function useGetLovolInsight() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<LovolInsightItem[]>>
  >({
    queryKey: ["countDailyLovol"],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-lovol/insight");
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

export function useLovolRegistrationHook() {
  const { fileAttachment, resetFiles } = useLovolRegistrationStore();

  const form = useForm<LovolFormType>({
    mode: "onChange",
    resolver: zodResolver(FormLovolRegistrationSchema) as any,
    defaultValues: {},
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const savedData = localStorage.getItem("lovol-form-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach((key) => {
          if (["cv_asset", "follow_proof_asset"].includes(key)) {
            return;
          }
          form.setValue(key as any, parsed[key]);
        });
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, []);

  const formValues = form.watch();

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      const dataToSave = { ...formValues };
      delete (dataToSave as any).cv_asset;
      delete (dataToSave as any).follow_proof_asset;

      localStorage.setItem("lovol-form-data", JSON.stringify(dataToSave));
    }
  }, [formValues]);
  /* eslint-enable react-hooks/exhaustive-deps */

  function onSubmit(data: LovolFormType) {
    const payload = {
      ...data,

      // files from zustand
      cv_asset: fileAttachment.cv_asset,
      follow_proof_asset: fileAttachment.follow_proof_asset,
    };

    handleRegister(serialize(payload, { indices: false }));
  }

  const {
    mutate: handleRegister,
    isPending,
    isSuccess,
  } = useMutation<
    AxiosResponse<ApiResponseCustom<any>>,
    AxiosError<ApiErrorType>,
    FormData
  >({
    mutationFn: async (data) =>
      api.post("/api/v1/oprec-lovol", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),

    onSuccess: (response) => {
      toast.success(response.data.message || "Registration successful 🎉");
      resetFiles();
      localStorage.removeItem("lovol-form-data");
    },

    onError: (error) => {
      toast.error(
        error.response?.data.error ?? "Something went wrong, please retry...",
      );
    },
  });

  return {
    form,
    onSubmit,
    isPending,
    isSuccess,
  };
}

export function useExportLovol() {
  const exportToExcel = useMutation({
    mutationFn: async () => {
      const response = await api.get("/api/v1/lovol/export/excel", {
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
      link.download = `Lovol_data_${new Date().getTime()}.xlsx`;
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
      const response = await api.get("/api/v1/lovol/export/csv", {
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
      link.download = `Lovol_data_${new Date().getTime()}.csv`;
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
