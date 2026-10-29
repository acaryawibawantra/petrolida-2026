"use client";

import Typography from "@/components/typography";
import { cn } from "@/lib/utils";

type StageResultBannerProps = {
  competitionName: string;
  stage?: string;
  lastStage?: string;
};

function getStageResultContent(
  competitionName: string,
  stage?: string,
  lastStage?: string,
) {
  if (stage === "semifinal") {
    return {
      title: "Congratulations! You advanced to the semifinal round.",
      description: `Your team has passed the preliminary round for ${competitionName}. Please review the semifinal instructions and requirements below.`,
      tone: "success" as const,
    };
  }

  if (stage === "final") {
    return {
      title: "Congratulations! You advanced to the final round.",
      description: `Your team has passed the previous round for ${competitionName}. Final-stage information and payment details are available on this page.`,
      tone: "success" as const,
    };
  }

  if (stage === "not passed") {
    const roundLabel =
      lastStage === "semifinal"
        ? "semifinal"
        : lastStage === "preliminary"
          ? "preliminary"
          : "previous";

    return {
      title: "Thank you for participating.",
      description: `Unfortunately, your team did not advance from the ${roundLabel} round of ${competitionName}. We appreciate your hard work and hope to see you again in the next event.`,
      tone: "neutral" as const,
    };
  }

  return null;
}

export default function StageResultBanner({
  competitionName,
  stage,
  lastStage,
}: StageResultBannerProps) {
  const content = getStageResultContent(competitionName, stage, lastStage);

  if (!content) {
    return null;
  }

  return (
    <div
      className={cn(
        "my-4 rounded-2xl border p-6 shadow-sm",
        content.tone === "success"
          ? "border-green-200 bg-green-50"
          : "border-slate-200 bg-slate-50",
      )}
    >
      <Typography
        variant="h4"
        weight="bold"
        className={cn(
          content.tone === "success" ? "text-green-900" : "text-slate-900",
        )}
      >
        {content.title}
      </Typography>
      <Typography
        variant="p"
        className={cn(
          "mt-2",
          content.tone === "success" ? "text-green-800" : "text-slate-700",
        )}
      >
        {content.description}
      </Typography>
    </div>
  );
}
