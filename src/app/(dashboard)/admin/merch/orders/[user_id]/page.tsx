"use client";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  useGetMerchTransaction,
  useMerchOrderActions,
} from "@/hooks/use-merch-orders";
import { getAssetUrl } from "@/lib/asset-url";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ModalEditStatus from "../_components/modal-confirm";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Merch Orders", href: "/admin/merch/orders" },
  { name: "Details", href: "#" },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "success":
      return "bg-green-500 hover:bg-green-600";
    case "shipped":
      return "bg-blue-500 hover:bg-blue-600";
    case "delivered":
      return "bg-green-600 hover:bg-green-700";
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "unpaid":
      return "bg-orange-500 hover:bg-orange-600";
    case "cancelled":
    case "canceled":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500";
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  // Using user_id as transaction_id based on folder naming, though logically it is transaction id
  const transactionId = params.user_id as string;
  const _router = useRouter(); // Added router for refresh if needed

  const {
    data: transactionData,
    isLoading,
    refetch,
  } = useGetMerchTransaction(transactionId);
  const { updateStatus } = useMerchOrderActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const detail = transactionData?.data;

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const handleSaveStatus = async (newStatus: string) => {
    if (!transactionId) return;

    if (["cancelled", "shipped", "delivered"].includes(newStatus)) {
      await updateStatus.mutateAsync({
        id: transactionId,
        status: newStatus as "cancelled" | "shipped" | "delivered",
      });
      refetch(); // Refetch data after update
      setIsEditModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Typography variant="p" className="text-gray-500">
          Loading details...
        </Typography>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Typography variant="h3">Transaction not found</Typography>
        <Link href="/admin/merch/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full max-w-7xl mx-auto items-center justify-between">
        <Link
          href="/admin/merch/orders"
          className="hidden md:flex p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>

      <div className="w-full bg-white min-h-screen">
        {/* Header Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 border-y border-gray-200 mb-8">
            <div className="flex flex-col">
              <Typography
                variant="h2"
                weight="bold"
                className="text-2xl text-black hidden sm:block"
              >
                Details
              </Typography>
              <Typography variant="p" className="text-gray-400 text-sm">
                ID: {detail.unique_code || detail.id}
              </Typography>
            </div>

            <div className="flex w-full sm:w-auto gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 sm:flex-none text-secondary-400 border-secondary-400 hover:bg-secondary-600 hover:text-white"
              >
                Edit Order Status
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="flex-1 sm:flex-none"
              >
                <Link
                  href={`https://wa.me/${detail.phone_number
                    ?.replace(/^0/, "62")
                    .replace(/\D/g, "")}`}
                  target="_blank"
                >
                  Contact Buyer
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6 pb-10">
            {/* Customer Details */}
            <div className="w-full bg-white rounded-xl border p-6 shadow-sm">
              <Typography
                variant="h4"
                className="mb-4 font-semibold text-gray-800"
              >
                Customer Info
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
                <div className="flex flex-row gap-2 md:gap-1">
                  <div className="w-32 shrink-0">
                    <Typography
                      variant="t"
                      weight="medium"
                      className="text-gray-500"
                    >
                      Name
                    </Typography>
                  </div>
                  <Typography
                    variant="t"
                    weight="medium"
                    className="text-black break-words"
                  >
                    {detail.name}
                  </Typography>
                </div>

                <div className="flex flex-row gap-2 md:gap-1">
                  <div className="w-32 shrink-0">
                    <Typography
                      variant="t"
                      weight="medium"
                      className="text-gray-500"
                    >
                      Line ID
                    </Typography>
                  </div>
                  <Typography
                    variant="t"
                    weight="medium"
                    className="text-black"
                  >
                    {detail.line_id || "-"}
                  </Typography>
                </div>

                <div className="flex flex-row gap-2 md:gap-1">
                  <div className="w-32 shrink-0">
                    <Typography
                      variant="t"
                      weight="medium"
                      className="text-gray-500"
                    >
                      Phone Number
                    </Typography>
                  </div>
                  <Typography
                    variant="t"
                    weight="medium"
                    className="text-black"
                  >
                    {detail.phone_number}
                  </Typography>
                </div>

                <div className="flex flex-row gap-2 md:gap-1">
                  <div className="w-32 shrink-0">
                    <Typography
                      variant="t"
                      weight="medium"
                      className="text-gray-500"
                    >
                      Email
                    </Typography>
                  </div>
                  <Typography
                    variant="t"
                    weight="medium"
                    className="text-black break-all"
                  >
                    {detail.email}
                  </Typography>
                </div>

                <div className="flex flex-row gap-2 md:gap-1">
                  <div className="w-32 shrink-0">
                    <Typography
                      variant="t"
                      weight="medium"
                      className="text-gray-500"
                    >
                      Address
                    </Typography>
                  </div>
                  <Typography
                    variant="t"
                    weight="medium"
                    className="text-black"
                  >
                    {detail.delivery_address || "-"}
                  </Typography>
                </div>

                <div className="flex flex-row gap-2 md:gap-1 items-start">
                  <div className="w-32 shrink-0">
                    <Typography
                      variant="t"
                      weight="medium"
                      className="text-gray-500"
                    >
                      Order Status
                    </Typography>
                  </div>
                  <Badge
                    className={`text-white border-none capitalize ${getStatusBadgeVariant(detail.status)}`}
                  >
                    {detail.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product List */}
            {detail.product_transactions &&
            detail.product_transactions.length > 0 ? (
              detail.product_transactions.map((product, index) => (
                <div
                  key={index}
                  className="w-full bg-white rounded-xl border p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Typography
                      variant="h4"
                      className="font-semibold text-gray-800"
                    >
                      Product #{index + 1}
                    </Typography>
                    {/* Assuming individual product status isn't tracked separately in UI based on design, 
                                 but if needed, can add here. Using main order status for now. */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-6">
                    <div className="flex flex-row gap-2 md:gap-1">
                      <div className="w-32 shrink-0">
                        <Typography
                          variant="t"
                          weight="medium"
                          className="text-gray-500"
                        >
                          Item Name
                        </Typography>
                      </div>
                      <Typography
                        variant="t"
                        weight="medium"
                        className="text-black"
                      >
                        {product.product_name}
                      </Typography>
                    </div>

                    <div className="flex flex-row gap-2 md:gap-1">
                      <div className="w-32 shrink-0">
                        <Typography
                          variant="t"
                          weight="medium"
                          className="text-gray-500"
                        >
                          Size
                        </Typography>
                      </div>
                      <Typography
                        variant="t"
                        weight="medium"
                        className="text-black"
                      >
                        {product.size || "None"}
                      </Typography>
                    </div>

                    <div className="flex flex-row gap-2 md:gap-1">
                      <div className="w-32 shrink-0">
                        <Typography
                          variant="t"
                          weight="medium"
                          className="text-gray-500"
                        >
                          Variant
                        </Typography>
                      </div>
                      <Typography
                        variant="t"
                        weight="medium"
                        className="text-black"
                      >
                        {product.variant || "None"}
                      </Typography>
                    </div>

                    <div className="flex flex-row gap-2 md:gap-1">
                      <div className="w-32 shrink-0">
                        <Typography
                          variant="t"
                          weight="medium"
                          className="text-gray-500"
                        >
                          Quantity
                        </Typography>
                      </div>
                      <Typography
                        variant="t"
                        weight="medium"
                        className="text-black"
                      >
                        {product.amount}
                      </Typography>
                    </div>

                    {index === 0 && ( // Display price mainly on first item or total summary
                      <div className="flex flex-row gap-2 md:gap-1">
                        <div className="w-32 shrink-0">
                          <Typography
                            variant="t"
                            weight="medium"
                            className="text-gray-500"
                          >
                            Total Order Price
                          </Typography>
                        </div>
                        <Typography
                          variant="t"
                          weight="medium"
                          className="text-black font-bold"
                        >
                          {formatCurrency(detail.total_price)}
                        </Typography>
                      </div>
                    )}
                  </div>
                  {/* Image if available */}
                  {product.asset_link && (
                    <div className="mt-4">
                      <Typography
                        variant="t"
                        weight="medium"
                        className="text-gray-500 mb-2 block"
                      >
                        Item Image
                      </Typography>
                      <div className="relative h-48 w-48 overflow-hidden rounded-md border bg-gray-50">
                        <img
                          src={getAssetUrl(product.asset_link)}
                          alt={product.product_name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full bg-white rounded-xl border p-6 shadow-sm">
                <Typography variant="p">
                  No products found in this transaction.
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalEditStatus
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveStatus}
        data={{
          customerName: detail.name,
          itemName:
            detail.product_transactions?.[0]?.product_name || "Multiple Items",
          currentStatus: detail.status,
        }}
      />
    </div>
  );
}
