export type CompetitionIdentity = {
  slug: string;
  displayName: string;
  adminPath: string;
  aliases: string[];
};

type CompetitionNameRecord = {
  id: string;
  name: string;
  max_member?: number;
};

const normalizeCompetitionName = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .replace(/petrolida\s*2026/g, "")
    .replace(/competition/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

export const competitionIdentities: CompetitionIdentity[] = [
  {
    slug: "paper-and-poster",
    displayName: "Paper and Poster",
    adminPath: "/admin/competition/paper-and-poster",
    aliases: [
      "Paper and Poster Competition Petrolida 2026",
      "Paper and Poster Competition",
      "Paper and Poster",
    ],
  },
  {
    slug: "case-study",
    displayName: "Case Study",
    adminPath: "/admin/competition/case-study",
    aliases: [
      "Case Study Competition Petrolida 2026",
      "Case Study Competition",
      "Case Study",
    ],
  },
  {
    slug: "fracturing-fluid-design",
    displayName: "Fracturing Fluid Design",
    adminPath: "/admin/competition/fracturing-fluid-design",
    aliases: [
      "Fracturing Fluid Design Competition Petrolida 2026",
      "Fracturing Fluid Design Competition",
      "Fracturing Fluid Design",
      "Fracture Fluid Design Competition Petrolida 2026",
      "Fracture Fluid Design Competition",
      "Fracture Fluid Design",
    ],
  },
  {
    slug: "oil-rig-design",
    displayName: "Oil Rig Design",
    adminPath: "/admin/competition/oil-rig-design",
    aliases: [
      "Oil Rig Design Competition Petrolida 2026",
      "Oil Rig Design Competition",
      "Oil Rig Design",
    ],
  },
  {
    slug: "petrosmart",
    displayName: "Petrosmart",
    adminPath: "/admin/competition/petrosmart",
    aliases: [
      "Petrosmart Competition Petrolida 2026",
      "Petrosmart Competition",
      "Petrosmart",
    ],
  },
  {
    slug: "business-case",
    displayName: "Business Case",
    adminPath: "/admin/competition/business-case",
    aliases: [
      "Business Case Competition Petrolida 2026",
      "Business Case Competition",
      "Business Case",
    ],
  },
  {
    slug: "plan-of-development",
    displayName: "Plan of Development",
    adminPath: "/admin/competition/plan-of-development",
    aliases: [
      "Plan of Development Competition Petrolida 2026",
      "Plan of Development Competition",
      "Plan of Development Petrolida 2026",
      "Plan of Development",
    ],
  },
  {
    slug: "geothermal-case",
    displayName: "Geothermal Case",
    adminPath: "/admin/competition/geothermal-case",
    aliases: [
      "Geothermal Case Competition Petrolida 2026",
      "Geothermal Case Competition",
      "Geothermal Case",
      "GCC",
    ],
  },
];

const competitionsWithSemifinal = new Set([
  "paper-and-poster",
  "business-case",
  "geothermal-case",
]);

const competitionIdentityBySlug = new Map(
  competitionIdentities.map((identity) => [identity.slug, identity]),
);

const competitionSlugByNormalizedAlias = new Map(
  competitionIdentities.flatMap((identity) =>
    identity.aliases.map(
      (alias) => [normalizeCompetitionName(alias), identity.slug] as const,
    ),
  ),
);

export const getCompetitionIdentityBySlug = (slug?: string | null) =>
  slug ? competitionIdentityBySlug.get(slug) : undefined;

export const getCompetitionSlugFromName = (eventName?: string | null) => {
  const normalizedName = normalizeCompetitionName(eventName);

  if (!normalizedName) {
    return "";
  }

  return competitionSlugByNormalizedAlias.get(normalizedName) ?? "";
};

export const getCompetitionIdentityFromName = (eventName?: string | null) => {
  const slug = getCompetitionSlugFromName(eventName);
  return getCompetitionIdentityBySlug(slug);
};

export const resolveCompetitionEventBySlug = (
  competitions: CompetitionNameRecord[] | undefined,
  slug?: string | null,
) => {
  const identity = getCompetitionIdentityBySlug(slug);
  if (!identity || !competitions?.length) {
    return undefined;
  }

  const aliasSet = new Set(
    identity.aliases.map((alias) => normalizeCompetitionName(alias)),
  );

  return competitions.find((competition) =>
    aliasSet.has(normalizeCompetitionName(competition.name)),
  );
};

export const competitionHasSemifinal = (slug?: string | null) =>
  !!slug && competitionsWithSemifinal.has(slug);
