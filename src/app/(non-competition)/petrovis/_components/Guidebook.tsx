"use client";

import Link from "next/link";

export default function Guidebook() {
  return (
    <section className="relative w-full bg-[#c4d4a0] overflow-hidden pt-8 md:pt-16">
      <div className="max-w-[1200px] mx-auto px-2 md:px-4">
        {/* ================= READY TO SPARK BANNER ================= */}
        <div className="relative mb-6 md:mb-12">
          {/* Bayangan di belakang */}
          <img
            src="/images/landing/petrovis/readytoshadow.svg"
            alt="shadow"
            className="absolute top-3 -right-5 w-[102%] h-auto z-0"
          />

          {/* Banner utama */}
          <img
            src="/images/landing/petrovis/readyto.svg"
            alt="Ready to spark banner"
            className="relative w-full h-auto z-10"
          />

          {/* Teks di atas */}
          <h2 className="text-[24px] sm:text-[40px] md:text-[60px] text-yellow-100 font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 whitespace-nowrap">
            Ready To{" "}
            <span className="italic font-normal font-melodrame text-white">
              SPARK THE CHANGE?
            </span>
          </h2>
        </div>

        {/* ================= BULLETIN BOARD WITH NOTES ================= */}
        <div className="relative grid grid-cols-2 gap-0">
          {/* ========== KOLOM KIRI ========== */}
          <div className="relative flex">
            {/* Background Image Kiri */}
            <img
              src="/images/landing/petrovis/textboxa.svg"
              alt="board background left"
              className="w-full h-auto"
            />

            {/* Content di atas background kiri */}
            <div className="absolute inset-0 flex items-center justify-center px-1 md:px-4 py-4 md:py-8">
              {/* Red Paperclip */}
              <img
                src="/images/landing/petrovis/redclip.svg"
                alt="red paperclip"
                className="absolute top-2 md:top-5 left-1/2 -translate-x-1/2 z-10 w-6 md:w-auto"
              />

              {/* Note Card Kiri */}
              <div className="realative w-full">
                <img
                  src="/images/landing/petrovis/texta.svg"
                  className="w-full h-auto relative -top-6 md:-top-12"
                />
                <p className="text-black text-[8px] sm:text-[14px] md:text-[26px] absolute top-1/3 left-1/3 transform -translate-x-1/4 -translate-y-1/3 z-20 text-center leading-tight px-1 md:px-0">
                  Be the first to know the ultimate opportunity to show your
                  ideas and advancements in bolstering the future of the energy
                  sector.
                </p>
              </div>
            </div>
          </div>

          {/* ========== KOLOM KANAN ========== */}
          <div className="relative">
            {/* Background Image Kanan */}
            <img
              src="/images/landing/petrovis/textboxb.svg"
              alt="board background right"
              className="w-full h-auto"
            />

            {/* Content di atas background kanan */}
            <div className="absolute inset-0 flex items-center justify-center px-1 md:px-4 py-4 md:py-8">
              {/* Red Paperclip */}
              <img
                src="/images/landing/petrovis/redclip.svg"
                alt="red paperclip"
                className="absolute top-2 md:top-5 left-1/2 -translate-x-1/2 z-10 w-6 md:w-auto"
              />

              {/* Note Card Kanan */}
              <div className="realative w-full">
                <img
                  src="/images/landing/petrovis/textb.svg"
                  className="w-full h-auto relative -top-1 md:-top-3"
                />

                <Link
                  href="https://drive.google.com/drive/folders/1ABhl4e9Z9ZttZvxMHuakix6DiUsYFeNS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[85%] md:w-[447px] h-[35px] sm:h-[60px] md:h-[102px] rounded-md md:rounded-xl text-[10px] sm:text-[18px] md:text-[36px] font-helvetica absolute top-[55px] sm:top-[100px] md:top-[154px] bg-white border-[1px] md:border-2 border-[#506B5B] text-[#506B5B] py-1 md:py-3 px-2 md:px-6 font-medium transition-colors flex items-center justify-center gap-1 md:gap-2 left-1/2 -translate-x-1/2 hover:bg-[#506B5B] hover:text-white"
                >
                  <span></span> Guidebook
                </Link>

                <Link
                  href="/petrovis/register"
                  className="w-[85%] md:w-[447px] h-[35px] sm:h-[60px] md:h-[102px] rounded-md md:rounded-xl text-[10px] sm:text-[18px] md:text-[36px] font-helvetica absolute top-[95px] sm:top-[170px] md:top-[276px] bg-[#506B5B] text-white py-1 md:py-3 px-2 md:px-6 font-medium transition-colors flex items-center justify-center gap-1 md:gap-2 left-1/2 -translate-x-1/2 hover:bg-[#3d5447]"
                >
                  <span></span> Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
