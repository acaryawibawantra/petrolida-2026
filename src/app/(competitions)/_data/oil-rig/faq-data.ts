export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "What is the Oil Rig competition about?",
    answer:
      "This competition focuses on offshore and oil rig related problem solving. Teams are expected to analyze the theme and present a practical solution that matches the brief.",
  },
  {
    question: "What should we submit?",
    answer:
      "Please submit the files requested in the guidebook, such as your analysis document, presentation slides, or other supporting materials required by the competition stage.",
  },
  {
    question: "Can we revise files after upload?",
    answer:
      "If the submission window is still open and editing is available, you may replace the file. After the deadline, submissions are locked for assessment.",
  },
  {
    question: "How are participants judged?",
    answer:
      "Judging usually considers the quality of the idea, technical feasibility, presentation clarity, and how well the submission follows the case instructions.",
  },
  {
    question: "Where can we ask for help?",
    answer:
      "Use the Competition PIC contact listed in the help section if you need clarification about the rules, submission format, or technical issues.",
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
