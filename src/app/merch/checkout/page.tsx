"use client";
import { Form } from "@/components/ui/form";
import { useCartStore } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

import { useMerchCheckoutHook } from "@/hooks/use-merch-checkout";
import CheckoutForm from "./_components/checkout-form";

export default function Page() {
  const router = useRouter();
  const { cartItems } = useCartStore();

  const validCartItems = cartItems.filter(
    (item) =>
      item &&
      item.id &&
      item.variant &&
      item.variant.id &&
      item.size &&
      item.size.id,
  );

  const cartProduct = validCartItems.map((item) => ({
    id: item.id,
    variant_id: item.variant.id,
    size_id: item.size.id,
    amount: item.amount,
  }));

  const { form, onSubmit, isPending } = useMerchCheckoutHook(cartProduct);

  useEffect(() => {
    if (validCartItems.length === 0) {
      router.push("/merch");
    }
  }, [validCartItems, router]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)}>
          <CheckoutForm isPending={isPending} />
        </form>
      </Form>
    </FormProvider>
  );
}
