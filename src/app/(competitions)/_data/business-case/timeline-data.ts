export interface TimelineItem {
  label: string;
  date: string;
  topPercent: number;
}

export const leftTimelineItems: TimelineItem[] = [
  {
    label: "Normal Registration",
    date: "8th March - 3rd April 2026",
    topPercent: 5,
  },
  {
    label: "Preliminary Submission Deadline (Abstract)",
    date: "10th April 2026",
    topPercent: 20,
  },
  {
    label: "Semifinal Case Distribution",
    date: "13th April 2026",
    topPercent: 35,
  },
  {
    label: "Finalist Announcement",
    date: "1st May 2026",
    topPercent: 50,
  },
  {
    label: "Mentoring Session",
    date: "4th - 6th May 2026",
    topPercent: 65,
  },
  {
    label: "Technical Meeting",
    date: "8th May 2026",
    topPercent: 80,
  },
];

export const rightTimelineItems: TimelineItem[] = [
  {
    label: "Case Distribution",
    date: "16th March 2026",
    topPercent: 10,
  },
  {
    label: "Semifinalist Announcement",
    date: "13th April 2026",
    topPercent: 25,
  },
  {
    label: "Semifinalist Submission",
    date: "26th April 2026",
    topPercent: 40,
  },
  {
    label: "TM Mentoring Session",
    date: "3rd May 2026",
    topPercent: 55,
  },
  {
    label: "Final Submission Deadline (PPT + Poster)",
    date: "7th May 2026",
    topPercent: 70,
  },
  {
    label: "Competition Day",
    date: "9th May 2026",
    topPercent: 85,
  },
  {
    label: "Gala Dinner",
    date: "10th May 2026",
    topPercent: 95,
  },
];
