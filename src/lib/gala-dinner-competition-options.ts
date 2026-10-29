export const GALA_DINNER_COMPETITION_OPTIONS = [
  { label: "PPC", value: "PPC", aliasGroups: [["paper", "poster"]] },
  {
    label: "FFDC",
    value: "FFDC",
    aliasGroups: [["fracturing", "fluid"], ["fracture", "fluid"], ["ffdc"]],
  },
  { label: "POD", value: "POD", aliasGroups: [["plan", "development"]] },
  { label: "ORDC", value: "ORDC", aliasGroups: [["oil", "rig"]] },
  { label: "CSC", value: "CSC", aliasGroups: [["case", "study"]] },
  { label: "PSC", value: "PSC", aliasGroups: [["petrosmart"]] },
  { label: "BCC", value: "BCC", aliasGroups: [["business", "case"]] },
  { label: "GTC", value: "GTC", aliasGroups: [["geothermal"]] },
] as const;

type CompetitionNameRecord = {
  name?: string;
};

export const resolveGalaDinnerCompetitionCode = (name?: string | null) => {
  const normalizedName = (name ?? "").toLowerCase();
  return (
    GALA_DINNER_COMPETITION_OPTIONS.find((option) =>
      option.aliasGroups.some((aliasGroup) =>
        aliasGroup.every((alias) => normalizedName.includes(alias)),
      ),
    )?.value ?? ""
  );
};

export const buildGalaDinnerCompetitionOptions = (
  competitions?: CompetitionNameRecord[],
) => {
  const codes = new Set(
    competitions
      ?.map((competition) => resolveGalaDinnerCompetitionCode(competition.name))
      .filter(Boolean),
  );

  const options = GALA_DINNER_COMPETITION_OPTIONS.filter((option) =>
    codes.has(option.value),
  );

  return options;
};
