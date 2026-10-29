import { getMetadataItems } from "@/utils/metadata";

const metadataItems = getMetadataItems();

export const BASE_METADATA = {
  title: metadataItems.title,
  description: metadataItems.description,
  creator: "Petrolida 2026 Website Team",
  publisher: "Petrolida 2026",
  keywords: [
    "Petrolida 2026",
    "Petrolida",
    "ITS",
    "Institut Teknologi Sepuluh Nopember",
    "Sepuluh Nopember Institute of Technology",
  ],
  robots: "follow, index",
  generator: "Next.js",
  alternates: {
    canonical: metadataItems.pathname,
  },
  metadataBase: new URL("https://www.petrolida.com/"),
  icons: {
    icon: [
      {
        url: "/images/logo-new.png",
        type: "image/png",
      },
      {
        url: "/images/logo-new.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/images/logo-new.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/logo-new.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: {
      url: "/images/logo-new.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  // openGraph: {
  //   title: metadataItems.title,
  //   description: metadataItems.description,
  //   url: metadataItems.pathname,
  //   siteName: "Petrolida 2026",
  //   images: {
  //     url: metadataItems.ogUrl,
  //     alt: metadataItems.title,
  //   },
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: metadataItems.title,
  //   description: metadataItems.description,
  //   creator: "@Petrolida2026",
  //   images: {
  //     url: metadataItems.ogUrl,
  //     alt: metadataItems.title,
  //   },
  // },
};
