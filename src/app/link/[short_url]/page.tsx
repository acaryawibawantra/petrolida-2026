"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import WholeLoadingPage from "@/components/loading/whole-loading";
import api from "@/lib/api";

export default function ShortLinkRedirect({
  params,
}: {
  params: Promise<{ short_url: string }>;
}) {
  const { short_url } = React.use(params);
  const router = useRouter();

  useEffect(() => {
    api
      .get(`/api/v1/link/o/${short_url}`)
      .then((data) => {
        if (data.data) {
          router.replace(data.data.data);
        }
      })
      .catch(() => {
        router.replace("/not-found");
      });
  }, [short_url, router]);

  return <WholeLoadingPage />;
}
