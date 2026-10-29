export interface LovolRegistrant {
  name: string;
  email: string;
  major: string;
  batch: string;
  student_id: string;
  practical_work: string;
  phone_number: string;
  line_id: string;
  information_form: string;
  about_petrolida: string;
  primary_division: string;
  primary_motivation: string;
  secondary_division: string;
  secondary_motivation: string;
  english_proficiency: number;
  communication_skill: number;
  fast_response: number;
  time_management: number;
  willing_to_pay: boolean;
  transfer_to_other_division: boolean;
  cv_asset: string | null;
  follow_prof_asset: string | null;
}

export interface LovolRegistrantResponse {
  success: boolean;
  message: string;
  data: LovolRegistrant;
}
