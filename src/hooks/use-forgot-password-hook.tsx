import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import * as authService from "@/services/auth";
import type { ApiError, ApiResponse } from "@/types/api";
import { ForgotPasswordSchema } from "@/validation/forgot-password";

const useForgotPasswordHook = () => {
  const method = useForm<z.infer<typeof ForgotPasswordSchema>>({
    mode: "onBlur",
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
    handleForgetPassword(data);
  }

  const { mutate: handleForgetPassword, isPending } = useMutation<
    ApiResponse<unknown>,
    AxiosError<ApiError>,
    z.infer<typeof ForgotPasswordSchema>
  >({
    mutationFn: async (data) => authService.forgetPassword(data.email),
    onSuccess: () => {
      toast.success("Reset password link sent. Please check your email.");
      method.reset();
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(
        err.response?.data.error ?? "Something went wrong, please retry...",
      );
    },
  });

  return {
    method,
    onSubmit,
    isPending,
  };
};

export default useForgotPasswordHook;
