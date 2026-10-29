"use client";

import { useState } from "react";

const slides = [
  { id: 1, image: "/images/landing/pbm/question-mark.png" },
  { id: 2, image: "/images/landing/pbm/image-carousel.png" },
  { id: 3, image: "/images/landing/pbm/image-rikiirfan.jpg" },
];

export default function SpeakerSection() {
  const [active, setActive] = useState(1);
  const total = slides.length;

  const next = () => setActive((p) => (p + 1) % total);
  const prev = () => setActive((p) => (p - 1 + total) % total);

  const getPosition = (index: number) => {
    if (index === active) return "center";
    if (index === (active - 1 + total) % total) return "left";
    if (index === (active + 1) % total) return "right";
    return "hidden";
  };

  return (
    <section className="relative w-full bg-[#9eb773] overflow-hidden py-24">
      {/* ================= BACKGROUND ================= */}
      <img
        src="/images/landing/pbm/vector-bg.svg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="bg"
      />

      <img
        src="/images/landing/pbm/image-kiri.svg"
        className="absolute bottom-0 left-0 hidden lg:block"
        alt="left decoration"
      />

      <img
        src="/images/landing/pbm/image-kanan.svg"
        className="absolute top-0 right-0 hidden lg:block"
        alt="right decoration"
      />

      {/* ================= WRAPPER ================= */}
      <div className="relative max-w-[1440px] mx-auto px-4">
        {/* ================= CARD SHADOW ================= */}
        <div className="absolute inset-0 bg-white/15 rotate-[-2deg] rounded-lg" />

        {/* ================= CARD UTAMA ================= */}
        <div className="relative bg-white rotate-[-2deg] rounded-lg flex flex-col lg:flex-row min-h-[690px]">
          {/* ========== LEFT CONTENT ========= */}
          <div className="lg:w-1/2 flex flex-col justify-center items-center gap-6 px-6 lg:px-16 rotate-[2deg] text-center">
            <h3 className="text-[#345e44] text-[40px] lg:text-[53px] font-bold">
              {slides[active].image.includes("image-rikiirfan.jpg")
                ? "PBM Vol 2"
                : "PBM Vol 1"}
            </h3>

            <p className="text-[32px] lg:text-[58px] text-[#bc415d] tracking-[2.9px] [-webkit-text-stroke:1.5px_#bc415d]">
              {slides[active].image.includes("image-rikiirfan.jpg")
                ? "Understanding the Geothermal Energy"
                : "Introduction to the Oil & Gas Industry"}
            </p>

            <p className="text-[#345e44] text-xl lg:text-4xl font-bold">
              {slides[active].image.includes("image-rikiirfan.jpg")
                ? "Current Trends and Transformation"
                : "Current Trends and Transformation"}
            </p>
          </div>

          {/* ========== RIGHT CAROUSEL ========= */}
          <div className="lg:w-1/2 relative flex items-center justify-center rotate-[2deg] mt-10 lg:mt-0">
            <div className="relative w-full max-w-[600px] h-[420px]">
              {slides.map((slide, index) => {
                const pos = getPosition(index);
                const isQuestionMark = slide.image.includes("question-mark");

                return (
                  <div
                    key={slide.id}
                    className={`absolute left-1/2 transition-all duration-500 ease-in-out
                      ${pos === "center" && "-translate-x-1/2 scale-100 opacity-100 z-30"}
                      ${
                        pos === "left" &&
                        "-translate-x-[calc(50%+180px)] scale-90 opacity-60 z-20"
                      }

        ${
          pos === "right" &&
          "-translate-x-[calc(50%-180px)] scale-90 opacity-60 z-20"
        }

        ${pos === "hidden" && "opacity-0 pointer-events-none"}
      `}
                  >
                    <div className="relative w-[260px] lg:w-[316px] h-[360px] lg:h-[405px] bg-[#bc415d] p-4 pb-[130px] overflow-hidden">
                      <img
                        src={slide.image}
                        alt={isQuestionMark ? "question mark" : "speaker"}
                        className={
                          isQuestionMark
                            ? "w-48 h-48 mx-auto mt-20 object-contain"
                            : "w-full h-full object-cover"
                        }
                      />

                      {!isQuestionMark && (
                        <>
                          <div className="absolute bottom-4 left-4 right-4 h-[90px] lg:h-[110px] bg-[#335d44]" />

                          <p className="absolute bottom-6 left-6 right-6 text-center text-white font-bold">
                            <span className="block text-[14px] lg:text-[18px]">
                              {slide.image.includes("image-rikiirfan.jpg")
                                ? "Riki Irfan S.T M.Si"
                                : "Mr. Ivan Novendri"}
                            </span>
                            <span className="block text-[10px] lg:text-[14px] font-normal">
                              {slide.image.includes("image-rikiirfan.jpg")
                                ? "Technical Manager	of INPEX Renewable Energy Indonesia and Lecturer at Universitas Islam Al-Ihya Kuningan"
                                : "Operations Coordinator at an Oil & Gas company in the Middle East and Lecturer at Binus University"}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== DOT CONTROLS ===== */}
            <div className="absolute bottom-4 flex gap-4">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-8 h-8 rounded-full bg-[#345e44]/60 hover:bg-[#345e44]"
              />

              <button
                onClick={next}
                aria-label="Next"
                className="w-8 h-8 rounded-full bg-[#345e44]/60 hover:bg-[#345e44]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
