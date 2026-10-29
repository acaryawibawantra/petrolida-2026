export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "Who can join Petrosmart?",
    answer:
      "Teams that meet the requirements in the guidebook may participate. Please review the registration rules and eligibility section before signing up.",
  },
  {
    question: "What files are required?",
    answer:
      "Submit the documents or presentation materials requested for the current stage of the competition, following the format shown in the guidebook.",
  },
  {
    question: "Can we edit the upload before the deadline?",
    answer:
      "Yes, if the dashboard still allows changes. Once the deadline passes, the latest uploaded file will be used for review and further edits will be closed.",
  },
  {
    question: "How will the work be assessed?",
    answer:
      "Assessment is generally based on idea quality, relevance to the topic, feasibility, and how clearly the solution is communicated.",
  },
  {
    question: "Where can we ask for more information?",
    answer:
      "If you need help with rules or technical submission issues, please contact the Competition PIC through the help section on this page.",
  },
];

export const helpData = {
  title: "Need Help?",
  banner: "We're Got Answers!",
  ctaTitle: "You Still Have a Question?",
  ctaDescription:
    "Explore our FAQ above, if you can't find the answer you're looking for, please contact us.",
  ctaButtonText: "Competition PIC",
  images: {
    background: "/images/competition/Vector1101.svg",
    banner: "/images/competition/Vector513.svg",
    ctaBackground: "/images/competition/Vector1099.svg",
    decorations: {
      group1: "/images/competition/Group1.svg",
      group2: "/images/competition/Group2.svg",
      group3: "/images/competition/Group3.svg",
      group4: "/images/competition/Group4.svg",
      group5: "/images/competition/Group5.svg",
    },
  },
};
