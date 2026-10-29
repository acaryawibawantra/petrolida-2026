export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "Who can participate in this competition?",
    answer:
      "Participation is open to teams that meet the official requirements in the guidebook for the selected competition. Please review the eligibility section before registering.",
  },
  {
    question: "How do we register?",
    answer:
      "Register through the competition page, complete the required team information, and follow the instructions shown on the dashboard until the registration is confirmed.",
  },
  {
    question: "What files do we need to submit?",
    answer:
      "Submit the files requested for your competition stage, such as proposal documents, presentation slides, papers, posters, or analysis reports, according to the guidebook format.",
  },
  {
    question: "Can we revise our submission after uploading it?",
    answer:
      "You can usually revise your submission before the deadline if the dashboard still allows it. After the deadline, the file will be locked for assessment.",
  },
  {
    question: "Where can we ask further questions?",
    answer:
      "You can contact the Competition PIC through the help section on this page if you need clarification about registration, files, or technical issues.",
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
