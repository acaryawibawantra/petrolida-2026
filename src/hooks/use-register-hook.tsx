import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import api from "@/lib/api";
import type { ApiError, ApiResponse } from "@/types/api";
import { RegisterSchema } from "@/validation/register";

const useRegisterHook = () => {
  const router = useRouter();

  const method = useForm<z.infer<typeof RegisterSchema>>({
    mode: "onBlur",
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof RegisterSchema>) {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
    handleRegister(registerData);
  }

  const { mutate: handleRegister, isPending } = useMutation<
    ApiResponse<unknown>,
    AxiosError<ApiError>,
    Omit<z.infer<typeof RegisterSchema>, "confirmPassword">
  >({
    mutationFn: async (data) => {
      const res = await api.post("/api/v1/user/register", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
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

export default useRegisterHook;
