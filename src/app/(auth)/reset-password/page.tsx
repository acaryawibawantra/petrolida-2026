"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormProvider } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import useResetPasswordHook from "@/hooks/use-reset-password-hook";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { isPending, onSubmit, method } = useResetPasswordHook(token);
  const { control } = method;
  const hasToken = token.trim().length > 0;

  return (
    <div className="relative min-h-screen bg-[#192B33] w-full overflow-hidden">
      {/* Full Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat lg:hidden"
        style={{
          backgroundImage: "url('/images/login/bg-mobile-login.svg')",
        }}
      />

      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat lg:block"
        style={{
          backgroundImage: "url('/images/login/bg-desktop-login.svg')",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg">
          <div className="rounded-xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8 lg:rounded-3xl lg:p-10">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
                <NextImage
                  src="/logo-new.png"
                  width={500}
                  height={500}
                  className="h-full w-full object-contain"
                  alt="Logo"
                />
              </div>
            </div>

            {/* Title */}
            <Typography
              as="h1"
              variant="h4"
              font="Helvetica"
              weight="bold"
              className="mb-2 text-center text-xl leading-tight text-gray-900 sm:text-2xl lg:text-3xl"
            >
              Reset your password
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="p"
              weight="medium"
              className="mb-6 text-center text-xs text-gray-600 sm:mb-8 sm:text-sm lg:text-base"
            >
              Create a new password for your account
            </Typography>

            {!hasToken ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <Typography
                  variant="p"
                  weight="medium"
                  className="text-sm text-red-700"
                >
                  Reset link is invalid or missing a token. Please request a new
                  reset password email.
                </Typography>
                <Link
                  href="/forgot-password"
                  className="mt-3 inline-block font-medium text-blue-600 hover:text-blue-800"
                >
                  Request new reset link
                </Link>
              </div>
            ) : (
              <FormProvider {...method}>
                <form
                  onSubmit={method.handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700 sm:text-sm">
                          New Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your new password"
                            {...field}
                            type="password"
                            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      className="h-10 w-full rounded-lg transition-all duration-200 sm:h-11"
                      disabled={isPending}
                    >
                      {isPending ? "Loading..." : "Reset Password"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            )}

            {/* Back to login link */}
            <div className="mt-4 text-center sm:mt-6">
              <Typography
                variant="p"
                weight="medium"
                className="text-xs text-gray-600 sm:text-sm"
              >
                Remember your password?{" "}
                <Link
                  href={"/login"}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Sign in
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
