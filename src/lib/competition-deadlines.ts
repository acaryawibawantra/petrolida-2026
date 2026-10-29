const BCC_AND_PPC_NAMES = new Set([
  "Business Case Competition Petrolida 2026",
  "Paper and Poster Competition Petrolida 2026",
]);

const BCC_AND_PPC_SLUGS = new Set(["business-case", "paper-and-poster"]);
const GCC_NAMES = new Set([
  "Geothermal Case Competition Petrolida 2026",
  "Geothermal Case Competition",
]);
const GCC_SLUGS = new Set(["geothermal-case"]);
const CSC_AND_POD_NAMES = new Set([
  "Case Study Competition Petrolida 2026",
  "Case Study Competition",
  "Plan of Development Competition Petrolida 2026",
  "Plan of Development Competition",
]);
const CSC_AND_POD_SLUGS = new Set(["case-study", "plan-of-development"]);
const FFDC_NAMES = new Set([
  "Fracture Fluid Design Competition Petrolida 2026",
  "Fracture Fluid Design Competition",
  "Fracturing Fluid Design Competition Petrolida 2026",
  "Fracturing Fluid Design Competition",
]);
const FFDC_SLUGS = new Set(["fracturing-fluid-design"]);

export const isBccOrPpcCompetition = (value?: string | null) =>
  !!value && (BCC_AND_PPC_NAMES.has(value) || BCC_AND_PPC_SLUGS.has(value));

export const isGccCompetition = (value?: string | null) =>
  !!value && (GCC_NAMES.has(value) || GCC_SLUGS.has(value));

export const isCscOrPodCompetition = (value?: string | null) =>
  !!value && (CSC_AND_POD_NAMES.has(value) || CSC_AND_POD_SLUGS.has(value));

export const isFfdcCompetition = (value?: string | null) =>
  !!value && (FFDC_NAMES.has(value) || FFDC_SLUGS.has(value));

export const getCompetitionStageDeadline = ({
  stage,
  competition,
}: {
  stage?: string | null;
  competition?: string | null;
}) => {
  const isBccOrPpc = isBccOrPpcCompetition(competition);
  const isGcc = isGccCompetition(competition);
  const isCscOrPod = isCscOrPodCompetition(competition);
  const isFfdc = isFfdcCompetition(competition);

  switch (stage) {
    case "preliminary":
      return new Date(
        isGcc
          ? "2026-04-12T12:00:00+07:00"
          : isBccOrPpc
            ? "2026-04-10T23:59:59+07:00"
            : "2026-04-12T23:59:59+07:00",
      ).toISOString();
    case "semifinal":
      return new Date(
        isBccOrPpc ? "2026-04-27T23:59:59+07:00" : "2026-04-10T23:59:59+07:00",
      ).toISOString();
    case "final":
      return new Date(
        isGcc
          ? "2026-05-07T23:59:59+07:00"
          : isCscOrPod
            ? "2026-05-08T12:00:00+07:00"
            : isBccOrPpc
              ? "2026-05-08T17:00:00+07:00"
              : isFfdc
                ? "2026-05-08T23:59:59+07:00"
                : "2026-05-06T23:59:59+07:00",
      ).toISOString();
    default: {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);
      return deadline.toISOString();
    }
  }
};

export const isCompetitionDeadlinePassed = (deadline?: string | null) => {
  if (!deadline) return false;

  const parsedDeadline = new Date(deadline);
  if (Number.isNaN(parsedDeadline.getTime())) {
    return false;
  }

  return Date.now() > parsedDeadline.getTime();
};
