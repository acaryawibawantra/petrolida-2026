import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { OprecLovol } from "@/types/entity/oprec-lovol";
import { FormOprecAnnounceSchema } from "@/validation/oprec-announce";

const useOprecLovolAnnounce = () => {
  const [status, setStatus] = useState<
    "initial" | "rejected" | "interviewed" | "pending" | "accepted"
  >("initial");

  const [nrp, setNrp] = useState<string | "">("");

  const method = useForm<z.infer<typeof FormOprecAnnounceSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormOprecAnnounceSchema),
    defaultValues: {
      nrp: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormOprecAnnounceSchema>) {
    const hasErrors = Object.keys(method.formState.errors).length > 0;

    if (hasErrors) {
      toast.error("Please check your input");
      return;
    }

    handleAnnounce(data);
  }

  const {
    mutate: handleAnnounce,
    isPending,
    data,
  } = useMutation<
    ApiResponse<OprecLovol>,
    AxiosError<ApiError>,
    z.infer<typeof FormOprecAnnounceSchema>
  >({
    mutationFn: async (formData) => {
      const res = await api.get<ApiResponse<OprecLovol>>(
        `/api/v1/oprec-lovol/nrp/${formData.nrp}`,
      );

      if (!res.data.data) {
        throw new Error("Data not found");
      }
      setNrp(formData.nrp);
      const apiStatus = res.data.data.status;
      if (apiStatus === "pending") {
        toast("Announcement is not yet available. Please check back later.", {
          icon: "⏳",
          duration: 4000,
        });
        setStatus("initial");
      } else if (apiStatus === "rejected") {
        setStatus("rejected");
      } else if (apiStatus === "interviewed") {
        setStatus("interviewed");
      } else if (apiStatus === "accepted") {
        setStatus("accepted");
      } else {
        setStatus("initial");
      }

      return res.data;
    },
    onError: (error) => {
      if (error.response?.status === 404) {
        toast.error("Student ID not found in Lovol registration data");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      setStatus("initial");
    },
  });

  return {
    method,
    onSubmit,
    isPending,
    status,
    data,
    nrp,
  };
};

export default useOprecLovolAnnounce;
