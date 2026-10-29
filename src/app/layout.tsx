import "./globals.css";

import type { Metadata } from "next";

import Providers from "@/app/providers";
import NavigationProgress from "@/components/navigation-progress";
import { BASE_METADATA } from "@/constants/metadata";

export const metadata: Metadata = {
  ...BASE_METADATA,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <NavigationProgress />
          {children}
        </Providers>
      </body>
    </html>
  );
}
