"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/lib/api";
import { MerchCheckoutSchema } from "@/types/merch-checkout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Unused types - kept for future reference
// type ApiResponse<T> = {
//   message: string;
//   data: T;
// };

// type ApiError = {
//   message: string;
// };

type MerchCheckoutResponse = {
  id: string;
  invoice_url: string;
};

export function useMerchCheckoutHook(
  cartProduct: {
    id: string;
    variant_id: string;
    size_id: string;
    amount: number;
  }[],
) {
  const router = useRouter();

  const [apiResponse, setApiResponse] = useState<MerchCheckoutResponse | null>(
    null,
  );

  // form
  const form = useForm<z.infer<typeof MerchCheckoutSchema>>({
    mode: "onChange",
    resolver: zodResolver(MerchCheckoutSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      line_id: "",
      is_delivery: true,
      address: "",
      product: cartProduct ?? [],
    },
  });

  // local storage restore
  useEffect(() => {
    const saved = localStorage.getItem("merchCheckoutData");
    if (saved) {
      const parsed = JSON.parse(saved);
      form.reset({
        ...parsed,
        product: cartProduct ?? parsed?.product ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // local storage autosave
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("merchCheckoutData", JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(values: z.infer<typeof MerchCheckoutSchema>) {
    const payload = {
      name: values.name,
      email: values.email,
      phone_number: values.phone_number,
      line_id: values.line_id,
      address: values.address,
      is_delivery: true,
      payment_method: "QRIS",
      product: cartProduct.map((item) => ({
        id: item.id,
        variant_id: item.variant_id === "default" ? undefined : item.variant_id,
        size_id: item.size_id,
        amount: Number(item.amount),
      })),
    };

    handleCheckout(payload);
  }

  // mutation
  const {
    mutate: handleCheckout,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/api/v1/merch", payload, {
        headers: { "Content-Type": "application/json" },
      });
    },

    onSuccess: (response) => {
      toast.success(response.data.message || "Checkout Successful ✅");

      setApiResponse(response.data.data);
      localStorage.removeItem("merchCheckoutData");

      if (response.data.data.invoice_url) {
        window.location.href = response.data.data.invoice_url;
      } else {
        router.push("/merch/checkout/success");
      }
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data.message ?? "Something went wrong, please retry...",
      );
    },
  });

  return {
    form,
    onSubmit,
    isPending,
    isSuccess,
    apiResponse,
  };
}

export type TrackOrderResponse = {
  trackingNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    lineId: string;
  };
  products: {
    name: string;
    size: string;
    variant: string;
    quantity: number;
    image: string;
    price: string;
  }[];
  deliveryAddress: string;
  status: string;
  total: string;
};

type ApiTransactionResponse = {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  line_id: string;
  status: string;
  delivery_address: string;
  is_delivery: boolean;
  total_price: string;
  invoice_url: string;
  shipping_price: string;
  order_id: string;
  unique_code: string;
  product_transactions: {
    id: string;
    product_name: string;
    asset_link: string;
    size: string;
    variant: string;
    amount: number;
  }[];
};

export function useTrackOrder(trackingNumber: string) {
  return useQuery({
    queryKey: ["track-order", trackingNumber],
    queryFn: async (): Promise<TrackOrderResponse> => {
      const response = await api.get(
        `/api/v1/transactions/c/${trackingNumber}`,
      );
      const data: ApiTransactionResponse = response.data.data;

      const formatCurrency = (value: string | number) => {
        const num = Number(value);
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(num);
      };

      // Transform API response to UI model
      return {
        trackingNumber: data.unique_code,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone_number,
          lineId: data.line_id,
        },
        products: data.product_transactions.map((prod) => ({
          name: prod.product_name,
          size: prod.size,
          variant: prod.variant,
          quantity: prod.amount,
          image: prod.asset_link,
          price: formatCurrency(0), // Price per item is not provided in this API response
        })),
        deliveryAddress: data.delivery_address,
        status: data.status,
        total: formatCurrency(data.total_price),
      };
    },
    enabled: !!trackingNumber,
    retry: 1,
  });
}
