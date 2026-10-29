"use client";

import Typography from "@/components/typography";
import { useEffect, useState } from "react";

interface CountdownProps {
  deadline: string | Date;
  variant?: "primary" | "white";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({
  deadline,
  variant = "primary",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline).getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const bgClass =
    variant === "white"
      ? "bg-white/20 backdrop-blur-sm border-white/30"
      : "bg-white";
  const textClass = variant === "white" ? "text-white" : "text-primary-600";
  const labelClass = variant === "white" ? "text-white/90" : "text-primary-700";

  return (
    <div className="flex justify-center items-center gap-6">
      <div className="text-center">
        <div
          className={`${bgClass} rounded-xl p-4 shadow-md min-w-[80px] border`}
        >
          <Typography variant="h2" weight="bold" className={textClass}>
            {String(timeLeft.days).padStart(2, "0")}
          </Typography>
        </div>
        <Typography variant="p" className={`text-sm mt-2 ${labelClass}`}>
          Days
        </Typography>
      </div>
      <Typography variant="h2" weight="bold" className={textClass}>
        :
      </Typography>
      <div className="text-center">
        <div
          className={`${bgClass} rounded-xl p-4 shadow-md min-w-[80px] border`}
        >
          <Typography variant="h2" weight="bold" className={textClass}>
            {String(timeLeft.hours).padStart(2, "0")}
          </Typography>
        </div>
        <Typography variant="p" className={`text-sm mt-2 ${labelClass}`}>
          Hours
        </Typography>
      </div>
      <Typography variant="h2" weight="bold" className={textClass}>
        :
      </Typography>
      <div className="text-center">
        <div
          className={`${bgClass} rounded-xl p-4 shadow-md min-w-[80px] border`}
        >
          <Typography variant="h2" weight="bold" className={textClass}>
            {String(timeLeft.minutes).padStart(2, "0")}
          </Typography>
        </div>
        <Typography variant="p" className={`text-sm mt-2 ${labelClass}`}>
          Minutes
        </Typography>
      </div>
      <Typography variant="h2" weight="bold" className={textClass}>
        :
      </Typography>
      <div className="text-center">
        <div
          className={`${bgClass} rounded-xl p-4 shadow-md min-w-[80px] border`}
        >
          <Typography variant="h2" weight="bold" className={textClass}>
            {String(timeLeft.seconds).padStart(2, "0")}
          </Typography>
        </div>
        <Typography variant="p" className={`text-sm mt-2 ${labelClass}`}>
          Seconds
        </Typography>
      </div>
    </div>
  );
}
