import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { serialize } from "object-to-formdata";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import api from "@/lib/api";
import useRegisterFormStore from "@/stores/use-oprec-form-store";
import { ApiError, ApiResponse } from "@/types/api";
import { TypeOprecStaff } from "@/types/page/oprec-staff";
import { TypeOprecStaffResponse } from "@/types/page/oprec-staff-response";
import { FormOprecStaffSchema } from "@/validation/oprec-staff";

// Types
export interface OprecStaffCountList {
  total_participant: number;
  total_pending: number;
  total_interviewed: number;
  total_rejected: number;
  total_accepted: number;
  register: number;
  interviewed: number;
  accepted: number;
  rejected: number;
}

export interface OprecStaffDailyResponse {
  result: Array<{ date: string; count: number }>;
}

export interface OprecStaffDepartment {
  major: string;
  count: number;
}

export interface OprecStaffSubdivision {
  subdivision: string;
  count: number;
}

export type DetailResponse = ApiResponse<TypeOprecStaffResponse>;

// Hooks

export function useGetOprecStaffCount() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<OprecStaffCountList>>
  >({
    queryKey: ["countOprecStaff"],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-staff/count");
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

export function useGetOprecStaffDailyInsight() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<OprecStaffDailyResponse>>
  >({
    queryKey: ["countDailyOprecStaff"],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-staff/insight");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    dailyData: data?.data.data.result,
    isLoading,
    error,
  };
}

export function useGetOprecStaffDepartmentCount() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<OprecStaffDepartment[]>>
  >({
    queryKey: ["countDepartmentOprecStaff"],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-staff/count/department");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    departmentData: data?.data.data?.sort((a, b) => a.count - b.count),
    isLoading,
    error,
  };
}

export function useGetOprecStaffSubdivisionCount() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<OprecStaffSubdivision[]>>
  >({
    queryKey: ["countDivition"],
    queryFn: async () => {
      const response = await api.get("/api/v1/oprec-staff/count/subdivision");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    subdivisionData: data?.data.data?.sort((a, b) => a.count - b.count),
    isLoading,
    error,
  };
}

export function useGetDetailRegistrant(user_id: string) {
  const { data: detailData, isLoading } = useQuery<DetailResponse>({
    queryKey: ["detail-registrant", user_id],
    queryFn: async () => {
      const { data } = await api.get<DetailResponse>(
        "/api/v1/oprec-staff/" + user_id,
      );

      return data;
    },
    refetchOnWindowFocus: true,
  });

  return { detailData, isLoading };
}

export function useOprecHook() {
  const { fileAttachment, resetFiles } = useRegisterFormStore();

  // ============== Form Handling ==============
  const form = useForm<z.infer<typeof FormOprecStaffSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormOprecStaffSchema) as any,
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof FormOprecStaffSchema>) {
    // Validate required document link
    if (
      !data.required_document_link ||
      data.required_document_link.trim() === ""
    ) {
      toast.error("Required document link is missing");
      return;
    }

    const payload = {
      ...data,
      portfolio_asset_link: fileAttachment.portfolio_asset,
    };

    try {
      const formData = serialize(payload, {
        indices: false,
        nullsAsUndefineds: true,
      });
      handleRegister(formData);
    } catch (_error) {
      toast.error("Error preparing form data");
    }
  }

  // ================= Integration Handling =================
  const {
    mutate: handleRegister,
    isPending,
    isSuccess,
  } = useMutation<
    AxiosResponse<ApiResponse<TypeOprecStaff>>,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (data) =>
      await api.post("/api/v1/oprec-staff", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast.success("Registration successful");
      resetFiles();
    },
    onError: (error: AxiosError<ApiError>) => {
      if (error.response?.data.error) {
        toast.error(error.response?.data.error);
        return;
      }
      toast.error("Please Retry");
    },
  });

  return {
    isPending,
    onSubmit,
    form,
    isSuccess,
  };
}

export function useAcceptedIterview(id: string, divisionID: string) {
  const { mutate: handleAccepted, isPending } = useMutation<
    ApiResponse<null>,
    ApiError
  >({
    mutationKey: ["accepted-" + id],
    mutationFn: async () => {
      const { data } = await api.put<ApiResponse<null>>(
        `/api/v1/oprec-staff/accepted/${id}?accepted_division_id=${divisionID}`,
      );

      return data;
    },
    onSuccess: () => {
      toast.success(
        "Success accepted registration process, Please refresh the page",
      );
      //   queryClient.refetchQueries({ stale: true });
    },
    onError: (err: ApiError) => {
      toast.error(err.message ?? "Something went wrong, please retry...");
    },
  });

  return { handleAccepted, isPending };
}

export function useInterviewed(id: string) {
  const { mutate: handleInterviewed, isPending } = useMutation<
    ApiResponse<null>,
    ApiError
  >({
    mutationKey: ["interviewed-" + id],
    mutationFn: async () => {
      const { data } = await api.put<ApiResponse<null>>(
        "/api/v1/oprec-staff/interviewed/" + id,
      );

      return data;
    },
    onSuccess: () => {
      toast.success(
        "Success continue registration process, Please refresh the page",
      );
      //   queryClient.refetchQueries({ stale: true });
    },
    onError: (err: ApiError) => {
      toast.error(err.message ?? "Something went wrong, please retry...");
    },
  });

  return { handleInterviewed, isPending };
}

export function useRejectedInterview(id: string) {
  const { mutate: handleRejected, isPending } = useMutation<
    ApiResponse<null>,
    ApiError
  >({
    mutationKey: ["rejected-" + id],
    mutationFn: async () => {
      const { data } = await api.put<ApiResponse<null>>(
        "/api/v1/oprec-staff/rejected/" + id,
      );

      return data;
    },
    onSuccess: () => {
      toast.success(
        "Success reject registration process, Please refresh the page",
      );
      //   queryClient.refetchQueries({ stale: true });
    },
    onError: (err: ApiError) => {
      toast.error(err.message ?? "Something went wrong, please retry...");
    },
  });

  return { handleRejected, isPending };
}

export function useExportOprec() {
  const exportToExcel = useMutation({
    mutationFn: async () => {
      const response = await api.get("/api/v1/oprec-staff/export/excel", {
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
      link.download = `oprec_data_${new Date().getTime()}.xlsx`;
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
      const response = await api.get("/api/v1/oprec-staff/export/csv", {
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
      link.download = `oprec_data_${new Date().getTime()}.csv`;
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
