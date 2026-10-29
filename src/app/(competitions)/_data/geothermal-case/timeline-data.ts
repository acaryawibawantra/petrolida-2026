export interface TimelineItem {
  label: string;
  date: string;
  topPercent: number;
}

export const leftTimelineItems: TimelineItem[] = [
  {
    label: "Early Registration",
    date: "8th - 11th March 2026",
    topPercent: 5,
  },
  {
    label: "Initial Case Distribution",
    date: "22nd March 2026",
    topPercent: 15,
  },
  {
    label: "Finalist Announcement",
    date: "19th April 2026",
    topPercent: 30,
  },
  {
    label: "Software Training",
    date: "25th - 26th April 2026",
    topPercent: 45,
  },
  {
    label: "Presentation Deck Submission Deadline",
    date: "7th May 2026, 23:59",
    topPercent: 65,
  },
  {
    label: "Competition Day",
    date: "9th May 2026",
    topPercent: 80,
  },
];

export const rightTimelineItems: TimelineItem[] = [
  {
    label: "Normal Registration",
    date: "12th March - 3rd April 2026",
    topPercent: 10,
  },
  {
    label: "Essay Submission Deadline",
    date: "12th April 2026",
    topPercent: 25,
  },
  {
    label: "Final Case Distribution",
    date: "19th - 22nd April 2026",
    topPercent: 40,
  },
  {
    label: "Project Report Submission Deadline",
    date: "7th May 2026, 23:59",
    topPercent: 55,
  },
  {
    label: "Technical Meeting",
    date: "8th May 2026",
    topPercent: 70,
  },
  {
    label: "Gala Dinner & Awarding Night",
    date: "10th May 2026",
    topPercent: 90,
  },
];
