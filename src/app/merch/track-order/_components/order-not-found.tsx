import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";

export default function OrderNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f3a41] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        {/* Logo */}
        <div className="mb-16 flex flex-col items-center">
          <NextImage
            src={"/merchandise/track-order-logo.png"}
            width={120}
            height={120}
            alt="logo"
            priority
            quality={100}
          />
        </div>

        <Typography
          variant="h5"
          font="Helvetica"
          className=" font-bold text-gray-800"
        >
          Order Not Found
        </Typography>
        <Typography variant="p" font="Helvetica" className="mt-2 text-gray-500">
          We couldn&apos;t find an order with your code.
        </Typography>

        <Button onClick={onBack} className="mt-6 w-full">
          Try Another Code
        </Button>
      </div>
    </div>
  );
}
