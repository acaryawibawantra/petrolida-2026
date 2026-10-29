import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import type {
  PetrovisRegistrationResponse,
  PetrovisSPE,
} from "@/types/page/petrovis-registration";
import {
  type PetrovisRegistrationFormType,
  PetrovisRegistrationSchema,
} from "@/validation/petrovis-registration";

export function usePetrovisRegistration() {
  const form = useForm<PetrovisRegistrationFormType>({
    resolver: zodResolver(PetrovisRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      institution: "",
      department: "",
      batch: "",
      student_id_number: "",
      student_id_card: undefined,
      phone_number: "",
      motivation_joining_company_visit: "",
      have_you_ever_participated_company_visit: false,
      how_did_hear_this_event: "",
      payment_method: "QRIS",
      voucher_code: "",
    },
  });

  const { data: speList, isLoading: isLoadingSPE } = useQuery<PetrovisSPE[]>({
    queryKey: ["petrovis-spe"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PetrovisSPE[]>>(
        "/api/v1/master/petrovis-spe",
      );
      return response.data.data;
    },
  });

  const {
    mutate: handleRegister,
    isPending,
    isSuccess,
  } = useMutation<
    AxiosResponse<ApiResponse<PetrovisRegistrationResponse>>,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (formData) =>
      await api.post("/api/v1/petrovis", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: (response) => {
      toast.success("Registration successful! Redirecting to payment...");
      form.reset();

      if (response.data.data.invoice_url) {
        window.location.href = response.data.data.invoice_url;
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage =
        error.response?.data.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: PetrovisRegistrationFormType) => {
    const formData = new FormData();

    if (data.spe_id) {
      formData.append("spe_id", data.spe_id);
    }

    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("institution", data.institution);
    formData.append("department", data.department);
    formData.append("batch", data.batch);
    formData.append("student_id_number", data.student_id_number);
    formData.append("student_id_card", data.student_id_card);
    formData.append("phone_number", data.phone_number);
    formData.append(
      "motivation_joining_company_visit",
      data.motivation_joining_company_visit,
    );
    formData.append(
      "have_you_ever_participated_company_visit",
      data.have_you_ever_participated_company_visit ? "yes" : "no",
    );
    formData.append("how_did_hear_this_event", data.how_did_hear_this_event);
    formData.append("payment_method", "QRIS");

    if (data.voucher_code?.trim()) {
      formData.append("voucher_code", data.voucher_code.trim());
    }

    handleRegister(formData);
  };

  return {
    form,
    onSubmit,
    isPending,
    isSuccess,
    speList,
    isLoadingSPE,
  };
}
