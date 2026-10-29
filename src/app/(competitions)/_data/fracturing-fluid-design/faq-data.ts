export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "Who can participate in Fracturing Fluid Design?",
    answer:
      "Teams that meet the competition requirements listed in the guidebook may join. Please review the eligibility and registration sections before signing up.",
  },
  {
    question: "What is the expected output?",
    answer:
      "Participants should prepare the required design or analysis files in the format requested by the guidebook, along with any supporting presentation material.",
  },
  {
    question: "Can we change the submission before the deadline?",
    answer:
      "Yes, if the dashboard still allows edits, you can update the uploaded file before the deadline. After the deadline, the submission is final.",
  },
  {
    question: "How are submissions evaluated?",
    answer:
      "Evaluation usually considers technical feasibility, creativity, clarity of explanation, and consistency with the case requirements.",
  },
  {
    question: "Where can we get help if something is unclear?",
    answer:
      "Please use the Competition PIC contact shown in the help section if you need clarification about the prompt, format, or submission flow.",
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
