"use client";

import UnstyledLink from "@/components/links/unstyled-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { cn } from "@/lib/utils";
import { Instagram, Linkedin } from "lucide-react";

// Data Navigation Link
const competitions = [
  { name: "Oil Rig Design", href: "/oil-rig-design" },
  {
    name: "Fracturing Fluid Design",
    href: "/fracturing-fluid-design",
  },
  { name: "Petrosmart", href: "/petrosmart" },
  { name: "Paper & Poster", href: "/paper-poster" },
  { name: "Business Case", href: "/business-case" },
  { name: "Case Study", href: "/case-study" },
  { name: "Geothermal Case", href: "/geothermal-case" },
];

const nonCompetitions = [
  { name: "PBM", href: "/pbm" },
  { name: "Petrovis", href: "/petrovis" },
];

const abouts = [
  { name: "About Us", href: "/about" },
  { name: "Meet The Team", href: "/about/team" },
  { name: "Merchandise", href: "/merch" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export default function Footer() {
  return (
    <footer
      className={cn(
        "w-full z-[100]",
        "bg-gradient-to-t from-[#1D3E48] to-[#335F43]",
      )}
    >
      <div className="container mx-auto px-6 pt-16 pb-8 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between">
          <div className="flex flex-col items-start gap-6 lg:w-[40%]">
            <NextImage
              src={"/layouts/logo-footer.svg"}
              alt="Petrolida Logo"
              width={396}
              height={67}
              className="w-[280px] lg:w-[396px] h-auto object-contain"
            />

            <Typography
              variant="h6"
              font="Helvetica"
              weight="medium"
              className="text-white text-base leading-relaxed max-w-md"
            >
              Petroleum Integrated Days (PETROLIDA) is the biggest annual event
              held by SPE ITS Student Chapter.
            </Typography>

            {/* Address */}
            <div className="flex flex-col gap-2 mt-2">
              <Typography
                variant="h6"
                weight="bold"
                font="Helvetica"
                className="text-white text-lg"
              >
                Address
              </Typography>
              <Typography
                variant="h6"
                weight="medium"
                font="Helvetica"
                className="text-white text-base leading-relaxed max-w-md"
              >
                Institut Teknologi Sepuluh Nopember
                <br />
                Jl. Teknik Kimia Keputih, Sukolilo
                <br />
                Surabaya Jawa Timur 60111
              </Typography>

              <Typography
                variant="h6"
                weight="bold"
                font="Helvetica"
                className="text-white text-lg mt-4"
              >
                Contact Us
              </Typography>
              <Typography
                variant="h6"
                weight="medium"
                font="Helvetica"
                className="text-white text-base leading-relaxed max-w-md"
              >
                +62 812-3456-7890
              </Typography>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 lg:w-[55%] justify-between">
            <div className="flex flex-col gap-4">
              <Typography
                variant="h6"
                weight="bold"
                font="Helvetica"
                className="text-white text-lg"
              >
                About
              </Typography>
              <ul className="flex flex-col gap-3">
                {abouts.map((item, index) => (
                  <li key={index}>
                    <UnstyledLink
                      href={item.href}
                      className="hover:text-yellow-400 transition-colors"
                    >
                      <Typography
                        variant="h6"
                        font="Helvetica"
                        weight="medium"
                        className="text-white"
                      >
                        {item.name}
                      </Typography>
                    </UnstyledLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <Typography
                variant="h6"
                weight="bold"
                font="Helvetica"
                className="text-white text-lg"
              >
                Non Competition
              </Typography>
              <ul className="flex flex-col gap-3">
                {nonCompetitions.map((item, index) => (
                  <li key={index}>
                    <UnstyledLink
                      href={item.href}
                      className="hover:text-yellow-400 transition-colors"
                    >
                      <Typography
                        variant="h6"
                        weight="medium"
                        font="Helvetica"
                        className="text-white"
                      >
                        {item.name}
                      </Typography>
                    </UnstyledLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <Typography
                variant="h6"
                weight="bold"
                font="Helvetica"
                className="text-white text-lg"
              >
                Competition
              </Typography>
              <ul className="flex flex-col gap-3">
                {competitions.map((item, index) => (
                  <li key={index}>
                    <UnstyledLink
                      href={item.href}
                      className="hover:text-yellow-400 transition-colors"
                    >
                      <Typography
                        variant="h6"
                        font="Helvetica"
                        weight="medium"
                        className="text-white"
                      >
                        {item.name}
                      </Typography>
                    </UnstyledLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white flex flex-col lg:flex-row justify-between items-center gap-4">
          <Typography
            as="p"
            variant="h6"
            font="Helvetica"
            className="text-white text-sm text-center lg:text-left"
          >
            Created by Website Development Team <strong>PETROLIDA 2026</strong>
          </Typography>

          <div className="flex flex-row gap-4">
            <UnstyledLink
              href="https://instagram.com/petrolida26/"
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </UnstyledLink>
            <UnstyledLink
              href="https://www.linkedin.com/company/petroleum-integrated-days-petrolida/"
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </UnstyledLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
