"use client";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useMerchDetail } from "@/hooks/use-get-detail-merch";
import { useMerchActions } from "@/hooks/use-merch-actions";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EditMerchForm from "./_components/edit-form";

export default function MerchItemsDetail() {
  const router = useRouter();
  const { merch_id } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const { deleteMerch } = useMerchActions();
  const { data: detail, isLoading } = useMerchDetail(merch_id as string);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMerch.mutateAsync(merch_id as string);
      toast.success("Item deleted successfully");
      setOpen(false);
      router.push("/admin/merch-items");
    } catch (_error) {
      // Error handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Product not found
      </div>
    );
  }

  return (
    <>
      <Separator />
      <section className="space-y-12">
        {isEdited ? (
          <EditMerchForm
            detail={detail}
            merchId={merch_id as string}
            onCancel={() => setIsEdited(false)}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center w-full">
              <Typography
                variant="h2"
                weight="medium"
                className="lg:col-span-2"
              >
                Details
              </Typography>

              <div className="flex items-center space-x-3 w-full">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsEdited(true)}
                >
                  Edit
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-danger-500 text-danger-500 hover:bg-danger-50"
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="space-y-4 p-8">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold text-default-900">
                        Are you sure?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-base font-medium text-default-900">
                      This action cannot be undone. Please confirm that you want
                      to delete <strong>{detail.name}</strong> from the merch
                      items.
                    </DialogDescription>
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="secondary"
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Yes"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Separator />

            <div className="grid gap-5 rounded-xl lg:grid-cols-2 xl:grid-cols-2">
              <div className="flex justify-between xl:space-x-3 lg:col-span-2">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[20%] break-words text-default-800"
                >
                  ID
                </Typography>
                <div className="w-[80%] flex items-center gap-2">
                  <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-default-900 select-all">
                    {detail.id || "-"}
                  </code>
                  {detail.id && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(detail.id || "");
                        toast.success("Item code copied to clipboard");
                      }}
                      className="px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between xl:space-x-3">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Item Name
                </Typography>
                <div className="w-[60%]">
                  <Typography
                    variant="p"
                    weight="regular"
                    className="break-words text-default-900"
                  >
                    {detail.name}
                  </Typography>
                </div>
              </div>

              <div className="flex justify-between xl:space-x-3">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Price
                </Typography>
                <div className="w-[60%]">
                  <Typography
                    variant="p"
                    weight="regular"
                    className="break-words text-default-900"
                  >
                    Rp {Number(detail.price).toLocaleString("id-ID")}
                  </Typography>
                </div>
              </div>

              <div className="flex justify-between xl:space-x-3">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Available Stock
                </Typography>
                <div className="w-[60%]">
                  <Typography
                    variant="p"
                    weight="regular"
                    className="break-words text-default-900"
                  >
                    {detail.stock}
                  </Typography>
                </div>
              </div>

              <div className="flex justify-between xl:space-x-3">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Category
                </Typography>
                <div className="w-[60%]">
                  <Typography
                    variant="p"
                    weight="regular"
                    className="break-words text-default-900"
                  >
                    {detail.product_category}
                  </Typography>
                </div>
              </div>

              <div className="flex justify-between xl:space-x-3">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Status
                </Typography>
                <div className="w-[60%]">
                  <Badge
                    variant={detail.is_active ? "success" : "default"}
                    className="text-white"
                  >
                    {detail.is_preorder ? "Preorder" : "Active"}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between xl:space-x-3">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Quantity Sold
                </Typography>
                <div className="w-[60%]">
                  <Typography
                    variant="p"
                    weight="regular"
                    className="break-words text-default-900"
                  >
                    {detail.quantity_sold}
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col xl:space-y-2 lg:col-span-2">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Description
                </Typography>
                <div className="w-full p-3 bg-neutral-100 border border-default-200 rounded-lg shadow-sm">
                  <Typography
                    variant="p"
                    weight="regular"
                    className="break-words text-default-900 text-justify"
                  >
                    {detail.description}
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col xl:space-y-2">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Sizes
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {detail.sizes && detail.sizes.length > 0 ? (
                    detail.sizes.map((size) => (
                      <Badge key={size.id} variant="outline">
                        {size.value}
                      </Badge>
                    ))
                  ) : (
                    <Typography variant="bt" className="text-gray-500">
                      No sizes available
                    </Typography>
                  )}
                </div>
              </div>

              <div className="flex flex-col xl:space-y-2">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Variants
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {detail.variants && detail.variants.length > 0 ? (
                    detail.variants.map((variant) => (
                      <Badge key={variant.id} variant="outline">
                        {variant.value}
                      </Badge>
                    ))
                  ) : (
                    <Typography variant="bt" className="text-gray-500">
                      No variants available
                    </Typography>
                  )}
                </div>
              </div>

              <div className="flex flex-col xl:space-y-2 lg:col-span-2">
                <Typography
                  variant="p"
                  weight="bold"
                  className="w-[40%] break-words text-default-800"
                >
                  Images
                </Typography>
                {detail.assets && detail.assets.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {detail.assets.map((asset) => (
                      <div key={asset.id} className="w-full">
                        <img
                          src={asset.link}
                          alt={asset.name}
                          className="w-full rounded-lg border shadow-sm aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="bt" className="text-gray-500">
                    No images available
                  </Typography>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
