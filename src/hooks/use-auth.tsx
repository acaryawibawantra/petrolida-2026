import { useEffect, useState } from "react";

import { getToken } from "@/lib/cookies";
import * as authService from "@/services/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check token only on client side
    if (typeof window !== "undefined") {
      const token = getToken();
      setHasToken(!!token);
    }
  }, []);

  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: hasToken, // Only fetch if token exists
  });
};
