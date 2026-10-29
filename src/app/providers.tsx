"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from "@tanstack/react-query";
import { Toaster as SonnerToaster } from "sonner";

import api from "@/lib/api";

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
  const { data } = await api.get(`${queryKey?.[0]}`);
  return data;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5, // Default: data fresh selama 5 menit
      gcTime: 1000 * 60 * 10, // Default: cache disimpan 10 menit
      retry: 1, // Hanya retry 1 kali untuk mengurangi waktu loading
      refetchOnWindowFocus: false, // Tidak refetch saat window focus
      refetchOnMount: false, // Tidak refetch saat component mount jika data masih fresh
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SonnerToaster richColors position="top-right" />
      {children}
    </QueryClientProvider>
  );
}
