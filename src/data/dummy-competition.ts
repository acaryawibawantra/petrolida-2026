export interface CompetitionData {
  id: string;
  name: string;
  slug: string;
  registrationStatus: "incomplete" | "complete";
  administrativeStatus: "incomplete" | "complete";
  paymentMethod: "invoice" | "payment_gateway";
  paymentStatus: "unpaid" | "paid";
  invoiceUrl?: string;
  teamInfo: {
    teamName: string;
    email: string;
    institution: string;
    competition: string;
  };
  teamLeader: MemberInfo;
  members: MemberInfo[];
}

export interface MemberInfo {
  fullName: string;
  major: string;
  batch: string;
  email: string;
  whatsappNumber: string;
  files: {
    studentIdCard?: string;
    proofOfInstagramStory?: string;
    proofOfTwibbon?: string;
    proofOfFollowing?: string;
  };
}

// Dummy data untuk user yang ikut Paper and Poster
export const dummyUserCompetition: CompetitionData = {
  id: "1",
  name: "Paper and Poster",
  slug: "paper-and-poster",
  registrationStatus: "incomplete",
  administrativeStatus: "incomplete",
  paymentMethod: "invoice", // or "payment_gateway"
  paymentStatus: "unpaid",
  invoiceUrl: "https://example.com/invoice/123",
  teamInfo: {
    teamName: "Dacor",
    email: "email@example.com",
    institution: "IIBUS",
    competition: "Paper and Poster",
  },
  teamLeader: {
    fullName: "nama lengkap",
    major: "Mathematics",
    batch: "2023",
    email: "email@example.com",
    whatsappNumber: "0812345789",
    files: {
      studentIdCard: "file-url-1",
      proofOfInstagramStory: "file-url-2",
      proofOfTwibbon: "file-url-3",
      proofOfFollowing: "file-url-4",
    },
  },
  members: [
    {
      fullName: "nama lengkap",
      major: "Mathematics",
      batch: "2023",
      email: "email@example.com",
      whatsappNumber: "0812345789",
      files: {
        studentIdCard: "file-url-1",
        proofOfInstagramStory: "file-url-2",
        proofOfTwibbon: "file-url-3",
        proofOfFollowing: "file-url-4",
      },
    },
  ],
};

// List semua competition yang tersedia
export const availableCompetitions = [
  { name: "Paper and Poster", slug: "paper-and-poster" },
  { name: "Case Study", slug: "case-study" },
  { name: "Fracturing Fluid Design", slug: "fracturing-fluid-design" },
  { name: "Oil Rig Design", slug: "oil-rig-design" },
  { name: "Petrosmart", slug: "petrosmart" },
  { name: "Business Case", slug: "business-case" },
  { name: "Plan of Development", slug: "plan-of-development" },
];
