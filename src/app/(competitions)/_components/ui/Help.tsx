"use client";

import Typography from "@/components/typography";
import { ChevronDown, Phone } from "lucide-react";
import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface HelpData {
  title: string;
  banner: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  images: {
    background: string;
    banner: string;
    ctaBackground: string;
    decorations: {
      group1: string;
      group2: string;
      group3: string;
      group4: string;
      group5: string;
    };
  };
}

interface HelpProps {
  faqData: FAQ[];
  helpData: HelpData;
}

export default function CompetitionHelp({ faqData, helpData }: HelpProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#4a7c8c] relative overflow-hidden py-16 px-4">
      {/* Decorative bg - PALING BELAKANG */}
      <img
        src={helpData.images.background}
        alt=""
        className="absolute left-0 bottom-[-899px] min-h-full w-full object-cover z-0"
      />

      {/* Decorative stars - layer 1 */}
      <img
        src={helpData.images.decorations.group1}
        alt="star decoration"
        className="absolute top-0 left-0 opacity-80 z-[1]"
      />
      <img
        src={helpData.images.decorations.group2}
        alt="star decoration"
        className="absolute top-20 right-1 opacity-80 z-[1]"
      />
      <img
        src={helpData.images.decorations.group3}
        alt="star decoration"
        className="absolute bottom-32 left-[263px] opacity-80 z-[1]"
      />
      <img
        src={helpData.images.decorations.group4}
        alt="star decoration"
        className="absolute bottom-[200px] right-[263px] opacity-80 z-[1]"
      />

      {/* CONTENT WRAPPER - PALING DEPAN */}
      <div className="max-w-4xl mx-auto relative z-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Typography
            font="Helvetica"
            variant="h3"
            weight="medium"
            className="text-white text-2xl mb-6"
          >
            {helpData.title}
          </Typography>

          {/* Banner "We're Got Answers!" */}
          <div className="relative inline-block">
            <img src={helpData.images.banner} className="w-full h-auto" />
            <div className="absolute inset-0 flex items-center justify-center px-12 py-4">
              <Typography
                font="Melodrame"
                variant="h1"
                className="text-[#f4d35e] text-4xl md:text-5xl font-serif italic"
              >
                {helpData.banner}
              </Typography>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-20">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md border-2 border-[#2d5a6b]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
              >
                <Typography
                  font="Helvetica"
                  weight="medium"
                  className="text-[#2d5a6b] pr-4"
                >
                  {faq.question}
                </Typography>
                <ChevronDown
                  className={`w-5 h-5 text-[#2d5a6b] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 py-5 bg-gray-50 border-t-2 border-[#2d5a6b]">
                  <Typography
                    font="Helvetica"
                    className="text-gray-700 leading-relaxed"
                  >
                    {faq.answer}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="relative">
          <img src={helpData.images.ctaBackground} className="w-full h-auto" />
          <div className="absolute inset-0 flex items-center justify-center px-12 py-20">
            <div className="max-w-2xl">
              <Typography
                font="Helvetica"
                variant="h2"
                className="text-white text-3xl md:text-4xl font-serif italic mb-4"
              >
                {helpData.ctaTitle}
              </Typography>
              <Typography
                font="Helvetica"
                className="text-white mb-6 text-sm md:text-base"
              >
                {helpData.ctaDescription}
              </Typography>
              <button className="bg-[#2d5a6b] text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#234656] transition-colors">
                <Phone className="w-5 h-5" />
                <Typography
                  font="Helvetica"
                  weight="medium"
                  className="text-white"
                >
                  {helpData.ctaButtonText}
                </Typography>
              </button>
            </div>

            {/* Decorative circle */}
            <img
              src={helpData.images.decorations.group5}
              alt="decoration"
              className="absolute bottom-0 right-0 w-40 h-40 translate-x-8 translate-y-8 hidden md:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
