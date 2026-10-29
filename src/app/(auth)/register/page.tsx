"use client";
import Link from "next/link";
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
import withAuth from "@/components/hoc/with-auth";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import useRegisterHook from "@/hooks/use-register-hook";

function RegisterPage() {
  const { isPending, onSubmit, method } = useRegisterHook();
  const { control } = method;

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
              Create your account
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="p"
              weight="medium"
              className="mb-6 text-center text-xs text-gray-600 sm:mb-8 sm:text-sm lg:text-base"
            >
              Join Petrolida and start your journey with us
            </Typography>

            {/* Form */}
            <FormProvider {...method}>
              <form
                onSubmit={method.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 sm:text-sm">
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          type="text"
                          className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 sm:text-sm">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          type="email"
                          className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 sm:text-sm">
                        Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          {...field}
                          type="password"
                          className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:h-11"
                        />
                      </FormControl>
                      <Typography
                        variant="p"
                        className="text-xs text-gray-500 mt-1"
                      >
                        Must be at least 8 characters with uppercase, lowercase,
                        and number
                      </Typography>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 sm:text-sm">
                        Confirm Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm your password"
                          {...field}
                          type="password"
                          className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Register Button */}
                <div className="pt-2">
                  {isPending ? (
                    <Button
                      variant="secondary"
                      className="h-10 w-full rounded-lg sm:h-11"
                      disabled
                    >
                      Loading...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="secondary"
                      className="h-10 w-full rounded-lg transition-all duration-200 sm:h-11"
                    >
                      Register
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>

            {/* Sign in link */}
            <div className="mt-4 text-center sm:mt-6">
              <Typography
                variant="p"
                weight="medium"
                className="text-xs text-gray-600 sm:text-sm"
              >
                Already have an account?{" "}
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

export default withAuth(RegisterPage, "public");
