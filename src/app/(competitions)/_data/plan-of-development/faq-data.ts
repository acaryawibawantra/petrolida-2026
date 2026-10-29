export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "What is the Plan of Development competition about?",
    answer:
      "This competition focuses on developing a clear and feasible development plan based on the given topic and requirements.",
  },
  {
    question: "What do we need to submit?",
    answer:
      "Please submit the development plan document and any supporting presentation material required by the guidebook.",
  },
  {
    question: "Can the file be replaced before the deadline?",
    answer:
      "Yes, if the dashboard still allows editing, you can update your submission before the deadline. After that, the file will be locked.",
  },
  {
    question: "How is the plan evaluated?",
    answer:
      "Judges usually assess structure, feasibility, clarity, and how well the plan answers the problem statement.",
  },
  {
    question: "Where can we ask about the rules?",
    answer:
      "Please contact the Competition PIC through the help section if you need clarification about the prompt, file format, or submission flow.",
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
