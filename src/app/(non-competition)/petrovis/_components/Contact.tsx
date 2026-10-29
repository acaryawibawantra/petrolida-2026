"use client";

export default function Contact() {
  return (
    <section className="relative w-full bg-[#7EA13F] overflow-hidden py-8 md:py-16">
      <div className="max-w-[1200px] mx-auto px-2 md:px-4">
        {/* ================= YOU STILL HAVE A QUESTION BANNER ================= */}
        <div className="relative mb-8 md:mb-16">
          {/* Banner */}
          <img
            src="/images/landing/petrovis/question.svg"
            className="relative w-full h-auto z-10"
          />
          {/* Main banner */}
          <h2 className="text-[20px] sm:text-[40px] md:text-[80px] font-melodrame italic text-center absolute top-1/2 left-1/3 transform -translate-x-1/3 -translate-y-1/2 z-20 text-white whitespace-nowrap">
            You still have a question?
          </h2>
        </div>

        {/* ================= CONTACT BOX ================= */}
        <div className="relative max-w-[1165px] justify-center mx-auto px-2 md:px-0">
          {/* Background box */}
          <div className="relative bg-[#4a7b7f] p-4 md:p-8 transform rotate-[2deg]">
            {/* Red paperclip */}
            <div className="absolute -top-6 -left-6 md:-top-16 md:-left-16">
              <img
                src="/images/landing/petrovis/contact.svg"
                className="relative w-12 md:w-full h-auto z-10"
              />
            </div>

            {/* White note/paper */}
            <div className="w-full md:w-[838px] mx-auto bg-white py-3 px-4 md:py-6 md:px-8 mb-3 md:mb-6">
              <h3 className="text-[#c9567b] text-[24px] sm:text-[32px] md:text-[42px] font-bold text-center">
                CONTACT US
              </h3>
            </div>

            {/* Contact information */}
            <div className="text-white text-center space-y-1 md:space-y-2">
              <p className="text-[14px] sm:text-[20px] md:text-[28px] font-melodrame italic">
                Dipta Suryo (+6282128622588)
              </p>
              <p className="text-[14px] sm:text-[20px] md:text-[28px] font-melodrame italic">
                Hillel Rizqi (+628113062006)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
