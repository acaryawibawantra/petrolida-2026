import Typography from "@/components/typography";

import { DetailResponse } from "@/hooks/use-oprec-staff";

type DetailProps = {
  data: DetailResponse;
  type: "primary" | "secondary";
};

export default function Detail({ data, type }: DetailProps) {
  const { data: detail } = data;

  const isPrimary = type === "primary";
  const divisionName = isPrimary
    ? detail.primary_division
    : detail.secondary_division;

  const questions = [
    {
      question: `What do you know about ${divisionName}?`,
      answer: isPrimary
        ? detail.about_primary_division
        : detail.about_secondary_division,
    },
    {
      question: `Why do you want to join ${divisionName}?`,
      answer: isPrimary
        ? detail.reason_join_primary_division
        : detail.reason_join_secondary_division,
    },
    {
      question: `What innovation ideas do you have for ${divisionName}?`,
      answer: isPrimary
        ? detail.innovation_idea_primary_division
        : detail.innovation_idea_secondary_division,
    },
    {
      question: `Previous experience related to ${divisionName}`,
      answer: isPrimary
        ? detail.previous_experience_primary_division
        : detail.previous_experience_secondary_division,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Typography variant="h3" weight="semibold" className="text-default-900">
          {isPrimary ? "Primary" : "Secondary"} Division Details
        </Typography>
        <div className="rounded-full bg-blue-100 px-3 py-1">
          <Typography variant="p" className="text-sm font-medium text-blue-700">
            {divisionName}
          </Typography>
        </div>
      </div>

      <div className="space-y-8 rounded-xl px-8 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        {questions.map((item, index) => (
          <div
            key={index}
            className="flex flex-col space-y-3 lg:flex-row lg:space-x-5 lg:space-y-0"
          >
            <Typography
              variant="p"
              weight="medium"
              className="lg:w-[40%] text-justify text-default-800"
            >
              {item.question}
            </Typography>
            <div className="lg:w-[60%]">
              <Typography
                variant="p"
                weight="medium"
                className={`break-words text-justify ${
                  item.answer ? "text-default-900" : "italic text-default-500"
                }`}
              >
                {item.answer || "No answer provided"}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
