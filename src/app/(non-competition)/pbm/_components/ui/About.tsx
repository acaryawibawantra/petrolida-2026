"use client";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Power Up",
      subtitle: "Series",
      image: "/images/landing/pbm/content-bawah-1.webp",
    },
    {
      id: 2,
      title: "PBM",
      subtitle: "Professionals",
      image: "/images/landing/pbm/content-bawah-2.webp",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  // };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-[#385042] to-[#85A055] flex flex-col lg:min-h-screen overflow-hidden xl:min-h-[120vh] lg:gap-0">
      {/* ===== BARIS ATAS (TEXT) ===== */}
      <div className="flex lg:flex-1 items-center lg:items-start justify-center px-4 pt-12 lg:pt-0 z-[2]">
        <div
          key={currentSlide}
          className="text-center text-white flex flex-col gap-0 md:gap-4 lg:gap-5
                     transition-opacity duration-500 ease-in-out"
        >
          <Typography
            font="Melodrame"
            className="text-[56px] md:text-[100px] lg:text-[150px] font-light italic text-white"
          >
            {slides[currentSlide].title}
          </Typography>

          <Typography
            font="Helvetica"
            className="text-[32px] md:text-[48px] lg:text-[64px] font-bold text-white"
          >
            {slides[currentSlide].subtitle}
          </Typography>
        </div>
      </div>

      {/* ===== BARIS BAWAH (IMAGE) ===== */}
      <div className="relative w-full flex items-end justify-center lg:flex-1 mt-6 lg:mt-0">
        {/* ===== MOBILE / TABLET (SINGLE IMAGE) ===== */}
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-auto lg:hidden"
        />

        {/* ===== DESKTOP (SLIDER IMAGE) ===== */}
        <div className="hidden lg:block w-full h-full relative z-[1]">
          {slides.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-auto transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ===== NAVIGATION ===== */}
      <div className="flex justify-center gap-3 py-6">
        {slides.map((_, index) => (
          <Button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
