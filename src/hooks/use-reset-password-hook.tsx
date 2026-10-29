import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import * as authService from "@/services/auth";
import type { ApiError, ApiResponse } from "@/types/api";
import { ResetPasswordSchema } from "@/validation/reset-password";

const useResetPasswordHook = (token: string) => {
  const router = useRouter();

  const method = useForm<z.infer<typeof ResetPasswordSchema>>({
    mode: "onBlur",
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof ResetPasswordSchema>) {
    handleResetPassword(data);
  }

  const { mutate: handleResetPassword, isPending } = useMutation<
    ApiResponse<unknown>,
    AxiosError<ApiError>,
    z.infer<typeof ResetPasswordSchema>
  >({
    mutationFn: async (data) => authService.resetPassword(token, data.password),
    onSuccess: () => {
      toast.success(
        "Password reset successful! Please login with your new password.",
      );
      router.push("/login");
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

export default useResetPasswordHook;
