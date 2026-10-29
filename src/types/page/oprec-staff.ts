type Form1 = {
  id: string;
  status: "interviewed" | "pending" | "accepted" | "rejected";
  name: string;
  email: string;
  department: string;
  faculty: string;
  batch: string;
  student_id: string;
  phone_number: string;
  line_id: string;
  about_petrolida: string;
  primary_division_id: string;
  secondary_division_id: string;
};
type Form2 = {
  about_primary_division: string;
  reason_join_primary_division: string;
  innovation_idea_primary_division: string;
  previous_experience_primary_division: string;
};

type Form3 = {
  about_secondary_division: string;
  reason_join_secondary_division: string;
  innovation_idea_secondary_division: string;
  previous_experience_secondary_division: string;
};

type Form4 = {
  required_document_link: string;
  portfolio_asset_link: string;
};

type TypeOprecStaff = Form1 & Form2 & Form3 & Form4;

export type { Form1, Form2, Form3, Form4, TypeOprecStaff };
