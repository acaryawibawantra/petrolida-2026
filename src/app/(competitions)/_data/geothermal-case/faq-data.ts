export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "What is the Geothermal Case competition about?",
    answer:
      "This competition focuses on geothermal-related problem solving, where teams analyze the case and develop a practical, well-supported recommendation.",
  },
  {
    question: "What should be included in the submission?",
    answer:
      "Submit the analysis document and any presentation material required in the guidebook. Make sure the solution is clear, structured, and aligned with the case brief.",
  },
  {
    question: "Can we use external references?",
    answer:
      "Yes, references are allowed as long as they are relevant, credible, and properly used to support your analysis.",
  },
  {
    question: "Can we revise the file before the deadline?",
    answer:
      "Yes, if the dashboard still allows it. Once the submission deadline has passed, the uploaded file will be locked for review.",
  },
  {
    question: "Where can we ask about the case details?",
    answer:
      "If you need clarification about the prompt or submission rules, please contact the Competition PIC through the help section on this page.",
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
