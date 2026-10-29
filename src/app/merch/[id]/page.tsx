"use client";

import Typography from "@/components/typography";
import { useCartStore } from "@/hooks/use-cart";
import { useMerchDetail } from "@/hooks/use-get-detail-merch";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SideCart from "../_components/sideCart";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: product, isLoading, error } = useMerchDetail(id);
  const { addToCart, cartItems } = useCartStore();

  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Initialize selections when product loads
  useEffect(() => {
    if (product) {
      if (
        product.sizes?.length &&
        product.sizes.length > 0 &&
        !selectedSizeId
      ) {
        setSelectedSizeId(product.sizes[0].id);
      }
      if (
        product.variants?.length &&
        product.variants.length > 0 &&
        !selectedVariantId
      ) {
        setSelectedVariantId(product.variants[0].id);
      }
      // Initialize selected image with banner asset
      if (product.banner_asset?.link && !selectedImage) {
        setSelectedImage(product.banner_asset.link);
      } else if (product.assets?.length > 0 && !selectedImage) {
        setSelectedImage(product.assets[0].link);
      }
    }
  }, [product, selectedSizeId, selectedVariantId, selectedImage]);

  const formatRupiah = (price: number): string => {
    return "IDR " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleQuantityChange = (action: string) => {
    if (action === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedSizeId) {
      return;
    }

    const selectedSize = product.sizes?.find(
      (size) => size.id === selectedSizeId,
    );
    const selectedVariant = product.variants?.find(
      (variant) => variant.id === selectedVariantId,
    );

    if (selectedSize) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        image: product.banner_asset?.link || "/placeholder-product.png",
        variant: selectedVariant
          ? {
              id: selectedVariant.id,
              value: selectedVariant.value,
            }
          : {
              id: "default",
              value: "Default",
            },
        size: {
          id: selectedSize.id,
          value: selectedSize.value,
        },
        amount: quantity,
      });
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/merch/checkout");
  };

  if (isLoading) {
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
        <div className="w-full h-full bg-white/10 backdrop-blur-xl border-4 border-white lg:m-[64px] rounded-[32px] p-6 lg:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="relative">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl animate-pulse"></div>
              <div className="w-12 h-12 bg-white/20 rounded-xl animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="relative">
                <div className="p-8 lg:p-16 flex items-center justify-center mb-6 min-h-[300px] lg:min-h-[500px]">
                  <div className="w-full max-w-[350px] aspect-[350/400] rounded-2xl bg-white/20 animate-pulse"></div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                  <div className="w-[85px] h-[85px] rounded-2xl bg-white/20 animate-pulse flex-shrink-0"></div>
                  <div className="w-[85px] h-[85px] rounded-2xl bg-white/20 animate-pulse flex-shrink-0"></div>
                  <div className="w-[85px] h-[85px] rounded-2xl bg-white/20 animate-pulse flex-shrink-0"></div>
                </div>
              </div>

              <div className="text-white flex flex-col justify-between h-full">
                <div>
                  <div className="mb-6">
                    <div className="h-4 w-24 bg-white/20 rounded animate-pulse mb-2"></div>
                    <div className="h-10 w-3/4 bg-white/20 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
                  </div>
                  <div className="h-32 bg-white/20 rounded animate-pulse mb-6"></div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 h-14 bg-white/20 rounded-xl animate-pulse"></div>
                  <div className="flex-1 h-14 bg-white/20 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/merchandise/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center p-4">
          <Typography variant="h4" className="text-white">
            Product not found
          </Typography>
          <Typography variant="p" className="text-gray-400 mt-2">
            The product you're looking for doesn't exist
          </Typography>
        </div>
      </div>
    );
  }

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
      <div className="w-full h-full max-w-[1400px] bg-white/10 backdrop-blur-xl border-2 border-white lg:m-[64px] rounded-[32px] p-6 lg:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-xl border border-white/40 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-xl border border-white/40 flex items-center justify-center hover:bg-white/30 transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2} />
              {cartItems.reduce((acc, item) => acc + item.amount, 0) > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-sm">
                  {cartItems.reduce((acc, item) => acc + item.amount, 0)}
                </div>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Image */}
            <div className="relative">
              {/* Main Image Area */}
              <div className="p-8 lg:p-16 flex items-center justify-center mb-6 min-h-[300px] lg:min-h-[500px]">
                {selectedImage || product.banner_asset?.link ? (
                  <img
                    src={selectedImage || product.banner_asset?.link}
                    alt={product.name}
                    className="w-full max-w-[350px] aspect-[350/400] rounded-2xl object-cover shadow-2xl transition-all duration-300"
                  />
                ) : (
                  <div className="w-full max-w-[350px] aspect-[350/400] rounded-2xl bg-gray-300/50 flex items-center justify-center backdrop-blur-sm">
                    <Typography className="text-white font-medium">
                      No image available
                    </Typography>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.assets && product.assets.length > 1 && (
                <div className="overflow-x-auto pb-4 scrollbar-hide w-full">
                  <div className="flex gap-3 w-fit mx-auto px-2">
                    {product.assets.map((asset) => {
                      const isSelected = selectedImage === asset.link;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedImage(asset.link)}
                          className={`w-[85px] h-[85px] rounded-2xl transition-all flex-shrink-0 cursor-pointer ${
                            isSelected
                              ? "border-[3px] border-white shadow-xl"
                              : "border-[3px] border-white/60 opacity-80 hover:opacity-100"
                          } bg-[#a2b5ba] p-2 flex items-center justify-center overflow-hidden`}
                        >
                          <img
                            src={asset.link}
                            alt={asset.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="text-white flex flex-col justify-between h-full">
              <div>
                <div className="mb-2">
                  <Typography
                    variant="h5"
                    weight="medium"
                    font="Helvetica"
                    className="text-white/90 capitalize tracking-wide"
                  >
                    {product.product_category}
                  </Typography>
                  <Typography
                    variant="h3"
                    weight="bold"
                    font="Helvetica"
                    className="text-white leading-tight"
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    weight="bold"
                    font="Helvetica"
                    className="text-white/90"
                  >
                    Stock : {product.stock}
                  </Typography>
                </div>

                <Typography
                  variant="h6"
                  font="Helvetica"
                  className="text-white/95 leading-[1.7] text-justify max-h-[150px] pb-2 overflow-y-auto"
                >
                  {product.description ||
                    "No description available for this product."}
                </Typography>

                <div className="mb-6">
                  <Typography
                    variant="t"
                    weight="semibold"
                    className="text-white mb-3"
                  >
                    Size
                  </Typography>
                  <div className="flex gap-3 flex-wrap">
                    {["S", "M", "L", "XL", "2XL"].map((sizeValue) => {
                      const availableSize = product.sizes?.find(
                        (s) => s.value === sizeValue,
                      );
                      const isAvailable = !!availableSize;
                      const isSelected = selectedSizeId === availableSize?.id;

                      return (
                        <button
                          key={sizeValue}
                          onClick={() =>
                            isAvailable && setSelectedSizeId(availableSize.id)
                          }
                          disabled={!isAvailable}
                          className={`px-4 lg:px-6 py-2.5 rounded-lg border-2 min-w-[60px] lg:min-w-[80px] h-[46px] transition-all flex items-center justify-center ${
                            !isAvailable
                              ? "bg-white/10 border-white/20 cursor-not-allowed line-through"
                              : isSelected
                                ? "bg-primary-700 border-white shadow-lg scale-105"
                                : "bg-transparent border-white/70 hover:border-white hover:bg-white/10"
                          }`}
                        >
                          <Typography
                            variant="t"
                            weight="medium"
                            className={
                              !isAvailable ? "text-white/30" : "text-white"
                            }
                          >
                            {sizeValue}
                          </Typography>
                        </button>
                      );
                    })}
                  </div>
                  {product.sizes && product.sizes.length === 0 && (
                    <Typography variant="bt" className="text-white/60 mt-2">
                      No sizes available for this product
                    </Typography>
                  )}
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div className="mb-8">
                    <Typography
                      variant="t"
                      weight="semibold"
                      className="text-white mb-3"
                    >
                      Variant
                    </Typography>
                    <div className="flex gap-3 flex-wrap">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`px-5 py-2.5 rounded-lg border-2 min-w-[100px] h-[46px] transition-all flex items-center justify-center ${
                            selectedVariantId === variant.id
                              ? "bg-primary-700 border-white shadow-lg scale-105"
                              : "bg-transparent border-white/70 hover:border-white hover:bg-white/10"
                          }`}
                        >
                          <Typography
                            variant="t"
                            weight="medium"
                            className="text-white"
                          >
                            {variant.value}
                          </Typography>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Price */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <Typography
                      variant="t"
                      weight="semibold"
                      className="text-white mb-3"
                    >
                      Quantity
                    </Typography>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleQuantityChange("decrement")}
                        className="w-10 h-10 rounded-lg border-2 border-white/70 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                      >
                        <span className="text-lg text-white">−</span>
                      </button>
                      <span className="w-8 text-center flex justify-center">
                        <Typography
                          variant="t"
                          weight="medium"
                          className="text-white"
                        >
                          {quantity}
                        </Typography>
                      </span>
                      <button
                        onClick={() => handleQuantityChange("increment")}
                        className="w-10 h-10 rounded-lg border-2 border-white/70 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                      >
                        <span className="text-lg text-white">+</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                    <Typography
                      variant="h2"
                      weight="bold"
                      className="text-white text-2xl lg:text-[30px]"
                    >
                      {formatRupiah(Number(product.price) * quantity)}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSizeId}
                  className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] ${
                    !selectedSizeId
                      ? "bg-gray-500/50 cursor-not-allowed backdrop-blur-sm"
                      : "bg-primary-700 border-white border-[1px] hover:bg-[#16504f] shadow-lg hover:shadow-xl"
                  }`}
                >
                  <ShoppingCart
                    className={`w-5 h-5 ${!selectedSizeId ? "text-white/50" : "text-white"}`}
                    strokeWidth={2.5}
                  />
                  <Typography
                    variant="t"
                    weight="semibold"
                    className={!selectedSizeId ? "text-white/50" : "text-white"}
                  >
                    Add to Cart
                  </Typography>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedSizeId}
                  className={`flex-1 py-4 rounded-xl transition-all relative active:scale-[0.98] ${
                    !selectedSizeId
                      ? "bg-gray-500/50 cursor-not-allowed backdrop-blur-sm"
                      : "bg-primary-700 border-[1px] border-white hover:bg-[#16504f] shadow-lg hover:shadow-xl"
                  }`}
                >
                  <Typography
                    variant="t"
                    weight="semibold"
                    className={!selectedSizeId ? "text-white/50" : "text-white"}
                  >
                    Buy Now
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
