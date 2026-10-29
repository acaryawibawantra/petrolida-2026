import Layout from "@/layouts/Layout";
import { use } from "react";
import CompetitionAbout from "../_components/ui/About";
import CompetitionHelp from "../_components/ui/Help";
import CompetitionHero from "../_components/ui/Hero";
import CompetitionTimeline from "../_components/ui/Timeline";

import { aboutData as oilRigAboutData } from "@/app/(competitions)/_data/oil-rig/about-data";
import { ctaData as oilRigCtaData } from "@/app/(competitions)/_data/oil-rig/cta-data";
import {
  faqData as oilRigFaqData,
  helpData as oilRigHelpData,
} from "@/app/(competitions)/_data/oil-rig/faq-data";
// Import oil-rig data
import { heroData as oilRigHeroData } from "@/app/(competitions)/_data/oil-rig/hero-data";
import { prizepoolData as oilRigPrizepoolData } from "@/app/(competitions)/_data/oil-rig/prizepool-data";
import {
  leftTimelineItems as oilRigLeftTimeline,
  rightTimelineItems as oilRigRightTimeline,
} from "@/app/(competitions)/_data/oil-rig/timeline-data";

import { aboutData as bccAboutData } from "@/app/(competitions)/_data/business-case/about-data";
import {
  faqData as bccFaqData,
  helpData as bccHelpData,
} from "@/app/(competitions)/_data/business-case/faq-data";
// Import business-case data
import { heroData as bccHeroData } from "@/app/(competitions)/_data/business-case/hero-data";
import { prizepoolData as bccPrizepoolData } from "@/app/(competitions)/_data/business-case/prizepool-data";
import {
  leftTimelineItems as bccLeftTimeline,
  rightTimelineItems as bccRightTimeline,
} from "@/app/(competitions)/_data/business-case/timeline-data";

import { aboutData as caseStudyAboutData } from "@/app/(competitions)/_data/case-study/about-data";
import {
  faqData as caseStudyFaqData,
  helpData as caseStudyHelpData,
} from "@/app/(competitions)/_data/case-study/faq-data";
// Import case-study data
import { heroData as caseStudyHeroData } from "@/app/(competitions)/_data/case-study/hero-data";
import { prizepoolData as caseStudyPrizepoolData } from "@/app/(competitions)/_data/case-study/prizepool-data";
import {
  leftTimelineItems as caseStudyLeftTimeline,
  rightTimelineItems as caseStudyRightTimeline,
} from "@/app/(competitions)/_data/case-study/timeline-data";

import { aboutData as ffdAboutData } from "@/app/(competitions)/_data/fracturing-fluid-design/about-data";
import {
  faqData as ffdFaqData,
  helpData as ffdHelpData,
} from "@/app/(competitions)/_data/fracturing-fluid-design/faq-data";
// Import fracturing-fluid-design data
import { heroData as ffdHeroData } from "@/app/(competitions)/_data/fracturing-fluid-design/hero-data";
import { prizepoolData as ffdPrizepoolData } from "@/app/(competitions)/_data/fracturing-fluid-design/prizepool-data";
import {
  leftTimelineItems as ffdLeftTimeline,
  rightTimelineItems as ffdRightTimeline,
} from "@/app/(competitions)/_data/fracturing-fluid-design/timeline-data";

import { aboutData as papAboutData } from "@/app/(competitions)/_data/paper-and-poster/about-data";
import {
  faqData as papFaqData,
  helpData as papHelpData,
} from "@/app/(competitions)/_data/paper-and-poster/faq-data";
// Import paper-and-poster data
import { heroData as papHeroData } from "@/app/(competitions)/_data/paper-and-poster/hero-data";
import { prizepoolData as papPrizepoolData } from "@/app/(competitions)/_data/paper-and-poster/prizepool-data";
import {
  leftTimelineItems as papLeftTimeline,
  rightTimelineItems as papRightTimeline,
} from "@/app/(competitions)/_data/paper-and-poster/timeline-data";

import { aboutData as petrosmartAboutData } from "@/app/(competitions)/_data/petrosmart/about-data";
import {
  faqData as petrosmartFaqData,
  helpData as petrosmartHelpData,
} from "@/app/(competitions)/_data/petrosmart/faq-data";
// Import petrosmart data
import { heroData as petrosmartHeroData } from "@/app/(competitions)/_data/petrosmart/hero-data";
import { prizepoolData as petrosmartPrizepoolData } from "@/app/(competitions)/_data/petrosmart/prizepool-data";
import {
  leftTimelineItems as petrosmartLeftTimeline,
  rightTimelineItems as petrosmartRightTimeline,
} from "@/app/(competitions)/_data/petrosmart/timeline-data";

import { aboutData as podAboutData } from "@/app/(competitions)/_data/plan-of-development/about-data";
import {
  faqData as podFaqData,
  helpData as podHelpData,
} from "@/app/(competitions)/_data/plan-of-development/faq-data";
// Import plan-of-development data
import { heroData as podHeroData } from "@/app/(competitions)/_data/plan-of-development/hero-data";
import { prizepoolData as podPrizepoolData } from "@/app/(competitions)/_data/plan-of-development/prizepool-data";
import {
  leftTimelineItems as podLeftTimeline,
  rightTimelineItems as podRightTimeline,
} from "@/app/(competitions)/_data/plan-of-development/timeline-data";

import { aboutData as geoAboutData } from "@/app/(competitions)/_data/geothermal-case/about-data";
import {
  faqData as geoFaqData,
  helpData as geoHelpData,
} from "@/app/(competitions)/_data/geothermal-case/faq-data";
// Import geothermal-case data
import { heroData as geoHeroData } from "@/app/(competitions)/_data/geothermal-case/hero-data";
import { prizepoolData as geoPrizepoolData } from "@/app/(competitions)/_data/geothermal-case/prizepool-data";
import {
  leftTimelineItems as geoLeftTimeline,
  rightTimelineItems as geoRightTimeline,
} from "@/app/(competitions)/_data/geothermal-case/timeline-data";
import CompetitionCTA from "../_components/ui/CTA";
import CompetitionPrizepool from "../_components/ui/Prizepool";

// Default data untuk competition yang belum memiliki data lengkap
const defaultCtaData = {
  title: "Coming Soon",
  description:
    "Registration and invitation letter information will be available soon. Stay tuned!",
  images: {
    board: "/competition/oil-rig/Vector1070.svg",
    shadow: "/competition/oil-rig/Vector1071.svg",
    shuriken1: "/competition/oil-rig/shuriken-1.svg",
    shuriken2: "/competition/oil-rig/shuriken-2.svg",
  },
  links: {
    register: "/competition/dashboard/user",
    invitationLetter: "https://petrolida.com/link/InvitationLetterComp2026",
  },
};

const defaultPrizepoolData = {
  title: "Prize Pool",
  ribbon: "Coming Soon",
  images: {
    ribbon: "/competition/oil-rig/ribbon.svg",
    books: "/competition/oil-rig/books.svg",
    clover: "/competition/oil-rig/clover.svg",
    pen: "/competition/oil-rig/pen.svg",
  },
  prizes: [
    {
      title: "1st Winner",
      reward: "Coming Soon",
      tape: "/competition/oil-rig/tape-grey.svg",
      rotate: "-3deg",
      offset: "translate-y-2",
    },
    {
      title: "2nd Winner",
      reward: "Coming Soon",
      tape: "/competition/oil-rig/tape-blue.svg",
      rotate: "2deg",
      offset: "-translate-y-2",
    },
    {
      title: "3rd Winner",
      reward: "Coming Soon",
      tape: "/competition/oil-rig/tape-pink.svg",
      rotate: "1deg",
      offset: "translate-y-4",
    },
    {
      title: "4th Winner",
      reward: "Coming Soon",
      tape: "/competition/oil-rig/tape-green.svg",
      rotate: "-2deg",
      offset: "-translate-y-1",
    },
    {
      title: "5th Winner",
      reward: "Coming Soon",
      tape: "/competition/oil-rig/tape-grey.svg",
      rotate: "3deg",
      offset: "translate-y-3",
    },
  ],
};

// Mapping data per competition
const competitionData: Record<string, any> = {
  "oil-rig": {
    hero: oilRigHeroData,
    about: oilRigAboutData,
    faq: oilRigFaqData,
    help: oilRigHelpData,
    cta: oilRigCtaData,
    prizepool: oilRigPrizepoolData,
    timeline: { left: oilRigLeftTimeline, right: oilRigRightTimeline },
  },
  "business-case": {
    hero: bccHeroData,
    about: bccAboutData,
    faq: bccFaqData,
    help: bccHelpData,
    prizepool: bccPrizepoolData,
    timeline: { left: bccLeftTimeline, right: bccRightTimeline },
  },
  "case-study": {
    hero: caseStudyHeroData,
    about: caseStudyAboutData,
    faq: caseStudyFaqData,
    help: caseStudyHelpData,
    prizepool: caseStudyPrizepoolData,
    timeline: { left: caseStudyLeftTimeline, right: caseStudyRightTimeline },
  },
  "fracturing-fluid-design": {
    hero: ffdHeroData,
    about: ffdAboutData,
    faq: ffdFaqData,
    help: ffdHelpData,
    prizepool: ffdPrizepoolData,
    timeline: { left: ffdLeftTimeline, right: ffdRightTimeline },
  },
  "paper-and-poster": {
    hero: papHeroData,
    about: papAboutData,
    faq: papFaqData,
    help: papHelpData,
    prizepool: papPrizepoolData,
    timeline: { left: papLeftTimeline, right: papRightTimeline },
  },
  petrosmart: {
    hero: petrosmartHeroData,
    about: petrosmartAboutData,
    faq: petrosmartFaqData,
    help: petrosmartHelpData,
    prizepool: petrosmartPrizepoolData,
    timeline: { left: petrosmartLeftTimeline, right: petrosmartRightTimeline },
  },
  "plan-of-development": {
    hero: podHeroData,
    about: podAboutData,
    faq: podFaqData,
    help: podHelpData,
    prizepool: podPrizepoolData,
    timeline: { left: podLeftTimeline, right: podRightTimeline },
  },
  "geothermal-case": {
    hero: geoHeroData,
    about: geoAboutData,
    faq: geoFaqData,
    help: geoHelpData,
    prizepool: geoPrizepoolData,
    timeline: { left: geoLeftTimeline, right: geoRightTimeline },
  },
};

export default function CompetitionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const data = competitionData[slug] || competitionData["oil-rig"];

  return (
    <Layout withNavbar withFooter>
      <CompetitionHero data={data.hero} />
      <CompetitionAbout data={data.about} />
      <CompetitionTimeline
        leftItems={data.timeline.left}
        rightItems={data.timeline.right}
      />
      <CompetitionCTA data={data.cta || defaultCtaData} />
      <CompetitionPrizepool data={data.prizepool || defaultPrizepoolData} />
      <CompetitionHelp faqData={data.faq} helpData={data.help} />
    </Layout>
  );
}
