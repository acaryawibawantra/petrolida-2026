export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "Who can join the Business Case competition?",
    answer:
      "Teams that meet the official guidebook requirements can join this competition. Please check the eligibility rules before registering to make sure your team is eligible.",
  },
  {
    question: "What should the team submit?",
    answer:
      "Participants are expected to submit the required case solution documents and presentation materials according to the format stated in the guidebook.",
  },
  {
    question: "Can we use our own business model or framework?",
    answer:
      "Yes, as long as it supports your solution and stays within the competition rules. Your analysis should be clear, relevant, and aligned with the case prompt.",
  },
  {
    question: "What if we need to update our file before the deadline?",
    answer:
      "If the dashboard still allows editing, you may replace your uploaded file before the deadline. After the submission window closes, changes are no longer accepted.",
  },
  {
    question: "How do we ask about the case or submission rules?",
    answer:
      "Use the Competition PIC contact listed in the help section if you need clarification about the case brief, scoring, or submission process.",
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
