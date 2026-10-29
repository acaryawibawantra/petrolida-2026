"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    const handleStart = () => setIsNavigating(true);

    // Listen to route changes
    window.addEventListener("beforeunload", handleStart);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] h-1 bg-transparent">
      <div className="h-full bg-primary-600 animate-[progress_2s_ease-in-out_infinite]" />
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
