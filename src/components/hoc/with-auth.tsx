"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

// import Loading from '@/components/Loading';
import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/cookies";
import useAuthStore from "@/stores/use-auth-store";
import type { ApiResponse } from "@/types/api";
import { User } from "@/types/entity/user";
import WholeLoadingPage from "../loading/whole-loading";

const ROLE = ["admin", "user"] as const;

type Role = (typeof ROLE)[number];

export interface WithAuthProps {
  user: User;
}

const USER_ROUTE = "/competition/dashboard/user";
const ADMIN_ROUTE = "/admin";
const LOGIN_ROUTE = "/login";

export enum RouteRole {
  /**
   Dapat diakses hanya ketika user belum login (Umum)
   */
  public,
  /**
   * Dapat diakses semuanya
   */
  optional,
  /**
   * For all authenticated user
   * will push to login if user is not authenticated
   */
  user,
  /**
   * For all authenticated admin
   * will push to login if user is not authenticated
   */
  admin,
}

export const isRole = (p: Role): p is Role => ROLE.includes(p as Role);

/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */
export default function withAuth<T>(
  Component: React.ComponentType<T>,
  routeRole: keyof typeof RouteRole,
) {
  function ComponentWithAuth(props: T) {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get("redirect");
    const pathName = usePathname();

    //#region  //*=========== STORE ===========
    const isAuthenticated = useAuthStore.useIsAuthenticated();
    const isLoading = useAuthStore.useIsLoading();
    const login = useAuthStore.useLogin();
    const logout = useAuthStore.useLogout();
    const stopLoading = useAuthStore.useStopLoading();
    const user = useAuthStore.useUser();
    //#endregion  //*======== STORE ===========

    const checkAuth = React.useCallback(() => {
      const token = getToken();
      if (!token) {
        isAuthenticated && logout();
        stopLoading();
        return;
      }
      const loadUser = async () => {
        try {
          const res = await api.get<ApiResponse<User>>("/api/v1/user/me");

          if (!res.data.data) {
            toast.error("Sesi login tidak valid");
            throw new Error("Sesi login tidak valid");
          }

          // Login with the existing token, persistent=true to keep in localStorage
          login(
            {
              ...res.data.data,
              token,
            },
            true,
          );
        } catch (_err) {
          await removeToken();
        } finally {
          stopLoading();
        }
      };

      loadUser();
    }, [isAuthenticated, login, logout, stopLoading]);

    React.useEffect(() => {
      checkAuth();

      window.addEventListener("focus", checkAuth);
      return () => {
        window.removeEventListener("focus", checkAuth);
      };
    }, [checkAuth]);

    React.useEffect(() => {
      const Redirect = () => {
        if (isAuthenticated) {
          if (routeRole === "public") {
            if (redirect) {
              router.replace(redirect as string);
            } else if (user?.role === "ADMIN") {
              router.replace(ADMIN_ROUTE);
            } else {
              router.replace(USER_ROUTE);
            }
          }
          if (user?.role === "USER") {
            if (routeRole === "admin") {
              router.replace(USER_ROUTE);
            }
          }
          if (user?.role === "ADMIN") {
            if (routeRole === "user") {
              router.replace(ADMIN_ROUTE);
            }
          }
        } else if (routeRole !== "public") {
          // router.replace(`${LOGIN_ROUTE}?redirect=${pathName}`);
          router.replace(`${LOGIN_ROUTE}`);
        }
      };

      if (!isLoading) {
        Redirect();
      }
    }, [isAuthenticated, isLoading, pathName, redirect, router, user]);

    if (
      (isLoading || !isAuthenticated) &&
      routeRole !== "public" &&
      routeRole !== "optional"
    ) {
      return <WholeLoadingPage />;
    }

    return <Component {...(props as T)} user={user} />;
  }

  return ComponentWithAuth;
}
