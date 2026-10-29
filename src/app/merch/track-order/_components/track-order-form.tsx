import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type TrackOrderFormProps = {
  onSubmit: (code: string) => void;
};

export default function TrackOrderForm({ onSubmit }: TrackOrderFormProps) {
  const [orderCode, setOrderCode] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderCode.trim()) return;
    onSubmit(orderCode.trim());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/merchandise/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-12 shadow-xl text-center">
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center">
          <NextImage
            src={"/merchandise/track-order-logo.png"}
            width={150}
            height={150}
            alt="logo"
            priority
            quality={100}
          />
        </div>

        <Typography
          variant="h2"
          font="Helvetica"
          className=" font-bold text-gray-800"
        >
          Check your Order!
        </Typography>
        <Typography
          variant="h5"
          font="Helvetica"
          className="mt-2 text-gray-500"
        >
          Enter your order code to track your order
        </Typography>

        <form onSubmit={handleSubmit} className="mt-8 text-left">
          <Label className="block text-lg font-medium text-gray-700 mb-3">
            Order Code
          </Label>

          <div className="flex gap-4">
            <Input
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              type="text"
              placeholder="Example: F4627736HDH"
              className="w-full rounded-xl border border-gray-300 px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-gray-800 h-14"
            />

            <Button type="submit" className="rounded-xl ">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
