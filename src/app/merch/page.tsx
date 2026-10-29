"use client";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/hooks/use-cart";
import { useMerchItems } from "@/hooks/use-get-merch-items";
import Layout from "@/layouts/Layout";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SideCart from "./_components/sideCart";

const MerchandiseCatalogPage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCartStore();

  const {
    data: merchData,
    isLoading,
    error,
  } = useMerchItems({
    status: "in_stock",
    take: 50,
  });

  const officialMerchandise =
    merchData?.data?.filter(
      (item) => item.product_category !== "Bundle" && item.is_active,
    ) || [];
  const specialBundling =
    merchData?.data?.filter(
      (item) => item.product_category === "Bundle" && item.is_active,
    ) || [];

  const formatRupiah = (price: number): string => {
    return "IDR " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout withNavbar withFooter>
      <main
        className="min-h-screen bg-[#263D44] relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/merchandise/Vector3.png')`,
          backgroundPosition: "bottom 300px right 350px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <img
            src="/images/merchandise/hero-dekstop.svg"
            alt="Merch Hero"
            className="w-full hidden md:block object-cover"
          />
          <img
            src="/images/merchandise/hero-mobile.svg"
            alt="Merch Hero"
            className="w-full block md:hidden object-cover"
          />
        </motion.div>

        <div className="p-8 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-[61px] left-[225px] flex gap-2"
          >
            <img src="/images/merchandise/Vector176.svg" alt="" />
          </motion.div>

          <div className="absolute top-[125px] left-[179px] flex">
            <img src="/images/merchandise/Vector175.svg" alt="" />
          </div>

          <div className="absolute top-[150px] right-[28px] flex">
            <img src="/images/merchandise/Group1.svg" alt="" />
          </div>

          <div className="absolute top-[190px] right-[161px] flex">
            <img src="/images/merchandise/Group2.svg" alt="" />
          </div>

          <div className="absolute bottom-[518px] left-[250px] flex">
            <img src="/images/merchandise/Group2.svg" alt="" />
          </div>

          <div className="absolute bottom-[480px] left-[180px] flex">
            <img src="/images/merchandise/Group3.svg" alt="" />
          </div>

          <div className="absolute bottom-[500px] right-[450px] flex">
            <img src="/images/merchandise/Vector176.svg" alt="" />
          </div>

          <div className="absolute bottom-[480px] right-[520px] flex">
            <img src="/images/merchandise/Vector175.svg" alt="" />
          </div>

          <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="bg-[#DB4E6E] px-12 py-3">
                  <h2 className="text-white text-4xl md:text-[90px] font-melodrame italic text-center leading-tight">
                    Official Merchandise
                  </h2>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {isLoading || error
                  ? [...Array(6)].map((_, i) => (
                      <div key={i} className="p-6 flex flex-col gap-4">
                        <Skeleton
                          className={`w-full aspect-square rounded-xl bg-white/10 ${
                            error ? "animate-none" : ""
                          }`}
                        />
                        <div className="flex flex-col gap-2 pl-[20px]">
                          <Skeleton
                            className={`h-4 w-3/4 bg-white/10 ${
                              error ? "animate-none" : ""
                            }`}
                          />
                          <Skeleton
                            className={`h-4 w-1/2 bg-white/10 ${
                              error ? "animate-none" : ""
                            }`}
                          />
                        </div>
                      </div>
                    ))
                  : officialMerchandise.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{
                          scale: 1.05,
                          rotate: 1,
                          boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                          transition: { duration: 0.3 },
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={`/merch/${item.id}`}
                          className="cursor-pointer relative z-10 h-full block"
                        >
                          <div
                            className="relative w-full h-full flex flex-col justify-between p-6 pb-8 transition-transform"
                            style={{
                              backgroundImage: `url('/images/merchandise/Vector1.png')`,
                              backgroundPosition: "center",
                              backgroundSize: "100% 100%",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div>
                              <div
                                className="relative w-full aspect-square overflow-hidden mb-4 p-4"
                                style={{
                                  backgroundImage: `url('/images/merchandise/Vector2.png')`,
                                  backgroundPosition: "center",
                                  backgroundSize: "100% 100%",
                                  backgroundRepeat: "no-repeat",
                                }}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.5 }}
                                  className="w-full h-full rounded-lg overflow-hidden"
                                >
                                  <NextImage
                                    src={
                                      item.banner_asset?.link &&
                                      item.banner_asset.link.trim() !== ""
                                        ? item.banner_asset.link
                                        : "/images/logo-new.png"
                                    }
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    width={300}
                                    height={300}
                                    serverStaticImg
                                  />
                                </motion.div>
                              </div>

                              <div className="flex flex-col">
                                <Typography
                                  font="Helvetica"
                                  variant="h2"
                                  weight="bold"
                                  className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 min-h-[50px] decoration-clone group-hover:text-pink-600 transition-colors"
                                >
                                  {item.name}
                                </Typography>
                                {item.variants && item.variants.length > 0 && (
                                  <Typography
                                    font="Helvetica"
                                    weight="bold"
                                    className="text-sm text-gray-600 capitalize line-clamp-1"
                                  >
                                    {item.variants
                                      .map((v) => v.value)
                                      .join(", ")}
                                  </Typography>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <Typography
                              font="Helvetica"
                              variant="h5"
                              className="text-2xl font-bold text-gray-900 mt-2"
                            >
                              {formatRupiah(Number(item.price))}
                            </Typography>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
              </motion.div>
            </div>

            {/* Special Bundling Section - Only show if there's data */}
            {!isLoading && !error && specialBundling.length > 0 && (
              <div className="flex flex-col gap-6">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="bg-[#DB4E6E] px-12 py-3">
                    <h2 className="text-white text-4xl md:text-[90px] font-melodrame italic text-center leading-tight">
                      Special Bundling
                    </h2>
                  </div>
                </motion.div>

                {/* Grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {specialBundling.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        rotate: 1,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="p-6 flex flex-col gap-4 relative z-10 cursor-pointer"
                      style={{
                        backgroundImage: `url('/images/merch/Vector1.png')`,
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Bundle Images */}
                      <div
                        className="rounded-xl p-4 flex flex-col gap-2"
                        style={{
                          backgroundImage: `url('/images/merch/Vector2.png')`,
                          backgroundPosition: "center",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <div className="flex gap-2">
                          <div className="flex-1 rounded-lg aspect-square flex items-center justify-center">
                            <div></div>
                          </div>
                          <div className="flex items-center justify-center text-2xl font-bold text-gray-400">
                            +
                          </div>
                          <div className="flex-1 rounded-lg aspect-square flex items-center justify-center">
                            <div></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 rounded-lg aspect-square flex items-center justify-center">
                            <div></div>
                          </div>
                          <div className="flex items-center justify-center text-2xl font-bold text-gray-400">
                            +
                          </div>
                          <div className="flex-1 rounded-lg aspect-square flex items-center justify-center">
                            <div></div>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-1">
                        <h3 className="pl-[20px] text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="pl-[20px] text-xs text-gray-500">
                          {item.description || "Special bundle package"}
                        </p>
                        <p className="pl-[20px] text-sm font-bold text-gray-900">
                          {formatRupiah(Number(item.price))}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center group transition-transform hover:scale-110 z-50 cursor-pointer"
        >
          <ShoppingCart className="w-8 h-8 text-pink-500" />
          {cartItems.reduce((acc, item) => acc + item.amount, 0) > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
              {cartItems.reduce((acc, item) => acc + item.amount, 0)}
            </div>
          )}
        </button>

        {/* Side Cart */}
        <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </main>
    </Layout>
  );
};

export default MerchandiseCatalogPage;
