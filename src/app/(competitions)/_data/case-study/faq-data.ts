export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "What is the focus of the Case Study competition?",
    answer:
      "Participants are expected to analyze the case prompt, identify the key problem, and propose a clear solution that is supported by logical reasoning and evidence.",
  },
  {
    question: "What files need to be submitted?",
    answer:
      "Please prepare the analysis document and any presentation materials required by the guidebook. Follow the file format and naming rules carefully.",
  },
  {
    question: "Can our team refine the solution after initial upload?",
    answer:
      "If the submission window is still open and the dashboard allows editing, you can replace the file. After the deadline, submissions are locked.",
  },
  {
    question: "How will the case be judged?",
    answer:
      "Judging is usually based on problem analysis, solution quality, feasibility, presentation clarity, and how well the submission follows the brief.",
  },
  {
    question: "Who should we contact for clarification?",
    answer:
      "Use the Competition PIC contact listed in the help section if you need help with the prompt, formatting, or submission flow.",
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
