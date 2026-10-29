export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "What does the Paper and Poster competition require?",
    answer:
      "This competition typically asks participants to prepare a written paper and a poster based on the topic and format provided in the guidebook.",
  },
  {
    question: "Can we use a poster template?",
    answer:
      "Yes, you may use the provided template or create your own design as long as it follows the size, layout, and branding requirements in the guidebook.",
  },
  {
    question: "Do we need to submit both paper and poster together?",
    answer:
      "Please follow the submission rules on the competition page. In most cases, both files are part of the judging process, so make sure neither is missed.",
  },
  {
    question: "Can we edit the paper after uploading?",
    answer:
      "If the submission period is still open and the dashboard allows it, you can update your file. Once the deadline passes, the uploaded version will be used for review.",
  },
  {
    question: "Where can we confirm the file format and deadline?",
    answer:
      "Check the guidebook and timeline section on this landing page. If anything is unclear, you can contact the Competition PIC through the help section.",
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
