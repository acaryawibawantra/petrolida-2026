type Form1 = {
  name: string;
  email: string;
  major: string;
  batch: string;
  student_id: string;
  practical_work: string;
  phone_number: string;
  line_id: string;
  information_from: string;
  about_petrolida: string;
  primary_division: string;
  primary_motivation: string;
  secondary_division: string;
  secondary_motivation: string;
};

type Form2 = {
  english_proficiency: number;
  communication_skill: number;
  fast_response: number;
  time_management: number;
};

type Form3 = {
  willing_to_pay: boolean;
  transfer_to_other_division: boolean;
  cv_asset?: any;
  follow_proof_asset?: any;
};

type TypeLovolRegistration = Form1 & Form2 & Form3;

export type { Form1, Form2, Form3, TypeLovolRegistration };
