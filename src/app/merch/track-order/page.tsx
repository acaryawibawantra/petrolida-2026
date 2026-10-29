"use client";

import { useTrackOrder } from "@/hooks/use-merch-checkout";
import { useState } from "react";
import OrderNotFound from "./_components/order-not-found";
import TrackOrder from "./_components/track-order";
import TrackOrderForm from "./_components/track-order-form";

type ViewState = "form" | "success" | "notfound";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<ViewState>("form");
  const [trackingCode, setTrackingCode] = useState<string>("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setTrackingCode(code);
      setView("success");
    }
  }, [searchParams]);

  const { data: orderData, isLoading, error } = useTrackOrder(trackingCode);

  const handleSubmitCode = (code: string) => {
    setTrackingCode(code);
    setView("success");
  };

  const handleBackToForm = () => {
    setTrackingCode("");
    setView("form");
  };

  // Handle view states based on API response
  if (view === "success") {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error || !orderData) {
      return <OrderNotFound onBack={handleBackToForm} />;
    }

    return <TrackOrder data={orderData} />;
  }

  return (
    <>{view === "form" && <TrackOrderForm onSubmit={handleSubmitCode} />}</>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
