"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/hooks/use-cart";
import { cartType } from "@/types/entity/cart";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

type CheckoutFormValues = {
  email: string;
  name: string;
  phone_number: string;
  line_id: string;
  address: string;
};

type CheckoutFormProps = {
  isPending?: boolean;
};

export default function CheckoutForm({
  isPending,
}: CheckoutFormProps): React.ReactElement {
  const { control } = useFormContext<CheckoutFormValues>();

  const { cartItems } = useCartStore();

  const [showAll, setShowAll] = useState<boolean>(false);

  const hasMoreThan1 = cartItems.length > 1;
  const visibleItemsMobile: cartType[] = showAll
    ? cartItems
    : cartItems.slice(0, 1);

  const hasMoreThan3 = cartItems.length > 3;
  const visibleItemsDesktop: cartType[] = showAll
    ? cartItems
    : cartItems.slice(0, 3);

  const totalItem = useMemo<number>(() => {
    return cartItems.reduce((acc, item) => acc + item.amount, 0);
  }, [cartItems]);

  const totalPrice = useMemo<number>(() => {
    return cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.amount,
      0,
    );
  }, [cartItems]);

  const formatRupiah = (num: number): string => {
    return "Rp" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-10"
      style={{
        backgroundImage: "url('/images/merchandise/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 lg:gap-24">
        {/* mobile */}
        <div className="w-full lg:hidden flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {visibleItemsMobile.map((item) => (
              <CartCard
                key={`${item.id}-${item.variant.id}-${item.size.id}`}
                item={item}
                formatRupiah={formatRupiah}
              />
            ))}
          </div>

          {hasMoreThan1 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full bg-white rounded-lg h-9 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 shadow"
            >
              {showAll ? (
                <>
                  Hide <ChevronUp />
                </>
              ) : (
                <>
                  View all <ChevronDown />
                </>
              )}
            </button>
          )}

          <TotalBox
            totalItem={totalItem}
            totalPrice={totalPrice}
            formatRupiah={formatRupiah}
          />
        </div>

        {/* left form */}
        <div className="w-full lg:w-[55%]">
          <div className="flex flex-col gap-6">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-white text-2xl font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      value={field.value ?? ""}
                      className="h-12 bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-white text-2xl font-semibold">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      value={field.value ?? ""}
                      className="h-12 bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-white text-2xl font-semibold">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex : 62823344442244"
                      {...field}
                      value={field.value ?? ""}
                      className="h-12 bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="line_id"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-white text-2xl font-semibold">
                    Line ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your line ID"
                      {...field}
                      value={field.value ?? ""}
                      className="h-12 bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-white text-2xl font-semibold">
                    Delivery Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex : Jl. Jend Sudirman, No.18 ...."
                      {...field}
                      value={field.value ?? ""}
                      className="h-28 resize-none bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full h-14 bg-primary-700 rounded-xl border-2 border-white text-white font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-[45%] flex-col gap-6">
          <div className="flex flex-col gap-6">
            {visibleItemsDesktop.map((item) => (
              <CartCard
                key={`${item.id}-${item.variant.id}-${item.size.id}`}
                item={item}
                formatRupiah={formatRupiah}
              />
            ))}
          </div>

          {hasMoreThan3 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full bg-white rounded-xl h-10 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 shadow"
            >
              {showAll ? (
                <>
                  Hide <ChevronUp />
                </>
              ) : (
                <>
                  View all <ChevronDown />
                </>
              )}
            </button>
          )}

          <TotalBox
            totalItem={totalItem}
            totalPrice={totalPrice}
            formatRupiah={formatRupiah}
          />
        </div>
      </div>
    </div>
  );
}

type CartCardProps = {
  item: cartType;
  formatRupiah: (num: number) => string;
};

function CartCard({ item, formatRupiah }: CartCardProps): React.ReactElement {
  return (
    <div className="relative">
      <NextImage
        src={"/merchandise/clip.svg"}
        width={55}
        height={55}
        className="absolute -left-6 -top-4 "
        alt="clip"
      />

      <div className="bg-white rounded-2xl shadow-md flex gap-5 p-5 items-center">
        <div className="w-[120px] h-[110px] rounded-xl overflow-hidden bg-[#EAF6F1] flex items-center justify-center">
          <Image
            width={155}
            height={155}
            src={item.image || "/images/logo-new.png"}
            alt="product"
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-snug ">
            {item.name}
          </h3>

          <div className="mt-2 text-sm text-gray-500 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[11px]">Size</p>
              <p className="font-semibold text-gray-800">{item.size.value}</p>
            </div>
            {item.variant.value !== "Default" && (
              <div>
                <p className="text-[11px]">Variant</p>
                <p className="font-semibold text-gray-800">
                  {item.variant.value}
                </p>
              </div>
            )}
            <div>
              <p className="text-[11px]">Quantity</p>
              <p className="font-semibold text-gray-800">{item.amount}</p>
            </div>
            <div>
              <p className="text-[11px]">Price</p>
              <p className="font-semibold text-gray-800">
                {formatRupiah(parseFloat(item.price))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type TotalBoxProps = {
  totalItem: number;
  totalPrice: number;
  formatRupiah: (num: number) => string;
};

function TotalBox({
  totalItem,
  totalPrice,
  formatRupiah,
}: TotalBoxProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
      <div className="flex justify-between items-center text-gray-900 font-medium">
        <span>Total Item</span>
        <span className="font-bold">{totalItem}</span>
      </div>

      <div className="flex justify-between items-center text-gray-900 font-medium">
        <span>Total Price</span>
        <span className="font-bold text-xl">{formatRupiah(totalPrice)}</span>
      </div>
    </div>
  );
}
