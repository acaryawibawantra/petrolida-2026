import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import api from "@/lib/api";
import { setToken } from "@/lib/cookies";
import useAuthStore from "@/stores/use-auth-store";
import type { ApiError, ApiResponse } from "@/types/api";
import type { User } from "@/types/entity/user";
import { LoginSchema } from "@/validation/login";

type LoginResponse = {
  token: string;
  role: string;
};

const useLoginHook = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  const method = useForm<z.infer<typeof LoginSchema>>({
    mode: "onBlur",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    handleLogin(data);
  }

  const { mutate: handleLogin, isPending } = useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ApiError>,
    z.infer<typeof LoginSchema>
  >({
    mutationFn: async (data) => {
      const res = await api.post("/api/v1/user/login", data);
      const { token, role } = res.data.data;

      if (!res.data.data) {
        throw new Error("Invalid login session");
      }

      setToken(token, true); // true = persistent (localStorage)

      const { data: dataUser } =
        await api.get<ApiResponse<User>>("/api/v1/user/me");
      if (dataUser.success) {
        const userData = { ...dataUser.data, token: token };
        login(userData, true); // true = persistent
      }

      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/competition/dashboard/user");
      }

      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Login Success");
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

export default useLoginHook;
