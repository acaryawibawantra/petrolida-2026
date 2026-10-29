import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { serialize } from "object-to-formdata";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import api from "@/lib/api";
import usePetrovisFormStore from "@/stores/use-petrovis-form-store";
import { ApiError, ApiResponse } from "@/types/api";
import {
  FormOprecPetrovisSchema,
  TypeOprecPetrovis,
} from "@/validation/oprec-petrovis";

export function useOprecPetrovisHook() {
  const { fileAttachment, resetFiles } = usePetrovisFormStore();

  const form = useForm<TypeOprecPetrovis>({
    mode: "onChange",
    resolver: zodResolver(FormOprecPetrovisSchema) as any,
    defaultValues: {},
  });

  function onSubmit(data: TypeOprecPetrovis) {
    // Validate files
    if (!fileAttachment.student_id_card) {
      toast.error("Student ID Card is required");
      return;
    }
    if (!fileAttachment.proof_of_payment) {
      toast.error("Proof of Payment is required");
      return;
    }

    const payload = {
      ...data,
      student_id_card: fileAttachment.student_id_card,
      proof_of_payment: fileAttachment.proof_of_payment,
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

  const {
    mutate: handleRegister,
    isPending,
    isSuccess,
  } = useMutation<
    AxiosResponse<ApiResponse<TypeOprecPetrovis>>,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (data) =>
      await api.post("/api/v1/oprec-petrovis", data, {
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
