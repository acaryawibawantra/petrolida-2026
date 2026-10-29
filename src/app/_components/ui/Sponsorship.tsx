"use client";

import Typography from "@/components/typography";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const supportedBy = [
  {
    name: "SKK Migas",
    logo: "/images/sponsorship/company/supported/SKK Migas.png",
  },
];

// Main Sponsors (M) - Large logos
const mainSponsors = [
  {
    name: "Pertamina Hulu Rokan",
    logo: "/images/sponsorship/company/(M) Pertamina Hulu Rokan.png",
  },
  {
    name: "Pertamina Training Consulting",
    logo: "/images/sponsorship/company/(M) Pertamina Training Consulting.PNG",
  },
  {
    name: "Gaskita PGN Pusat",
    logo: "/images/sponsorship/company/(M) Gaskita PGN Pusat.png",
  },
  {
    name: "RFD",
    logo: "/images/sponsorship/company/(M) RFD sebelahan TNavigator.png",
  },
  {
    name: "tNavigator",
    logo: "/images/sponsorship/company/(M) tNavigator sebelahan RFD.png",
  },
];

// Sponsors (S) - All available sponsors
const sponsors = [
  {
    name: "ADHI Karya",
    logo: "/images/sponsorship/company/(S) ADHI Karya.png",
  },
  {
    name: "BRI",
    logo: "/images/sponsorship/company/(S) BRI.png",
  },
  {
    name: "BRIN",
    logo: "/images/sponsorship/company/(S) BRIN.jpg",
  },
  {
    name: "Drillchem",
    logo: "/images/sponsorship/company/(S) Drillchem.png",
  },
  {
    name: "Harbour Energy",
    logo: "/images/sponsorship/company/(S) Harbour Energy.png",
  },
  {
    name: "Nasi Kita Catering",
    logo: "/images/sponsorship/company/(S) NasiKitaCatering.png",
  },
  {
    name: "Nindya Karya",
    logo: "/images/sponsorship/company/(S) Nindya Karya.png",
  },
  {
    name: "Pertamina EP Poleng",
    logo: "/images/sponsorship/company/(S) Pertamina EP Poleng.png",
  },
  {
    name: "Pertamina EP",
    logo: "/images/sponsorship/company/(S) Pertamina EP.png",
  },
  {
    name: "Petrokimia Gresik",
    logo: "/images/sponsorship/company/(S) Petrokimia Gresik.png",
  },
  {
    name: "PGN SAKA",
    logo: "/images/sponsorship/company/(S) PGN SAKA.png",
  },
  {
    name: "PHE OSES",
    logo: "/images/sponsorship/company/(S) PHE OSES.png",
  },
  {
    name: "PLN Icon Plus",
    logo: "/images/sponsorship/company/(S) PLN Icon Plus.png",
  },
  {
    name: "Supreme Energy",
    logo: "/images/sponsorship/company/(S) Supreme Energy.png",
  },
];

export default function Sponsorship() {
  const sponsorRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sponsorRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const paperY = useTransform(scrollYProgress, [0, 0.3], [150, 0]);

  return (
    <section
      ref={sponsorRef}
      className="w-full min-h-screen relative py-16 md:py-24 px-4 md:px-8 overflow-hidden"
      style={{
        backgroundColor: "#164655",
      }}
    >
      <div className="absolute left-0 bottom-0 w-64 md:w-80 lg:w-96 pointer-events-none z-20">
        <Image
          src={"/images/sponsorship/decoration/bot-red.png"}
          alt="bottom-left"
          width={500}
          height={500}
        />
      </div>

      <Image
        src={"/images/sponsorship/decoration/title.png"}
        alt="bottom-left"
        width={1000}
        height={800}
        className="absolute top-0 left-0 z-50"
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="md:min-h-[230px] min-h-[80px] w-full"></div>
        <div className="relative bg-[url('/images/sponsorship/decoration/bg-sponsorship.png')] bg-cover bg-no-repeat bg-center p-20">
          <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12">
            <div className="w-full flex flex-col items-center gap-6">
              <Typography
                variant="p"
                font="Helvetica"
                weight="medium"
                className="text-gray-500 text-base md:text-lg"
              >
                Supported By :
              </Typography>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {supportedBy.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative h-24 md:h-32 w-28 md:w-40"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sponsored By Section */}
            <div className="w-full flex flex-col items-center gap-8">
              <Typography
                variant="p"
                font="Helvetica"
                weight="medium"
                className="text-gray-500 text-base md:text-lg"
              >
                Sponsored By :
              </Typography>

              {/* Main Sponsors (M) - Large logos */}
              <div className="w-full flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                {mainSponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative h-28 md:h-36 lg:h-40 w-36 md:w-48 lg:w-56"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))" }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* All Sponsors (S) - Flex layout */}
              <div className="w-full flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-10">
                {sponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="relative h-20 md:h-24 lg:h-28 w-24 md:w-32 lg:w-36"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
