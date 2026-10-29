import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import Link from "next/link";

type OrderProduct = {
  name: string;
  size: string;
  variant: string;
  quantity: number;
  image: string;
  price: string;
};

type OrderData = {
  trackingNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    lineId: string;
  };
  products: OrderProduct[];
  deliveryAddress: string;
  status: string;
  total: string;
};

type TrackOrderProps = {
  data: OrderData;
};

export default function TrackOrder({ data }: TrackOrderProps) {
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
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* customer card info */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <Typography variant="p" className="text-gray-500">
              Tracking Number
            </Typography>
            <Typography variant="p" weight="bold" className="text-gray-800">
              {data.trackingNumber}
            </Typography>

            <div className="mt-6 space-y-3 text-sm">
              <div>
                <Typography variant="h6" className="text-gray-500">
                  Name
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  className="text-gray-800"
                >
                  {data.customer.name}
                </Typography>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-500">
                  Email
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  className="text-gray-800"
                >
                  {data.customer.email}
                </Typography>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-500">
                  Phone Number
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  className="text-gray-800"
                >
                  {data.customer.phone}
                </Typography>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-500">
                  Line ID
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  className="text-gray-800"
                >
                  {data.customer.lineId}
                </Typography>
              </div>
            </div>
          </div>

          {/* product card info */}
          <div className="rounded-2xl bg-white p-6 shadow-xl flex flex-col gap-4 max-h-[520px]">
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
              {data.products.map((product, idx) => (
                <div
                  key={`${product.name}-${idx}`}
                  className="flex gap-6 border-b pb-4 last:border-b-0"
                >
                  <NextImage
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <Typography
                      variant="h5"
                      weight="bold"
                      className="text-gray-800"
                    >
                      {product.name}
                    </Typography>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <Typography variant="h6" className="text-gray-500">
                          Size
                        </Typography>
                        <Typography
                          variant="h5"
                          weight="bold"
                          className="text-gray-800"
                        >
                          {product.size}
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="h6" className="text-gray-500">
                          Variant
                        </Typography>
                        <Typography
                          variant="h5"
                          weight="bold"
                          className="text-gray-800"
                        >
                          {product.variant}
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="h6" className="text-gray-500">
                          Quantity
                        </Typography>
                        <Typography
                          variant="h5"
                          weight="bold"
                          className="text-gray-800"
                        >
                          {product.quantity}
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="h6" className="text-gray-500">
                          Price
                        </Typography>
                        <Typography
                          variant="h5"
                          weight="bold"
                          className="text-gray-800"
                        >
                          {product.price}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">
                <Typography variant="h6" className="text-gray-500">
                  Delivery Address
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  className="text-gray-800"
                >
                  {data.deliveryAddress}
                </Typography>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <Typography variant="h6" className="text-gray-500">
                    Status
                  </Typography>
                  <Typography
                    variant="h5"
                    weight="bold"
                    className="text-orange-500"
                  >
                    {data.status}
                  </Typography>
                </div>

                <div className="text-right">
                  <Typography variant="h6" className="text-gray-500">
                    Total
                  </Typography>
                  <Typography
                    variant="h5"
                    weight="bold"
                    className="text-gray-800"
                  >
                    {data.total}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-xl px-8 py-2 text-sm font-semibold text-white hover:text-[#1f3a41]"
            >
              Back to Home
            </Button>
          </Link>

          <Button className="w-full sm:w-auto rounded-xl px-8 py-2 text-sm font-semibold bg-white text-[#1f3a41] hover:border-white">
            Contact Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
