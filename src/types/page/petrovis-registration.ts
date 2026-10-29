export type PetrovisRegistrationForm = {
  spe_id?: string;
  email: string;
  name: string;
  institution: string;
  department: string;
  batch: string;
  student_id_number: string;
  student_id_card: File;
  phone_number: string;
  motivation_joining_company_visit: string;
  have_you_ever_participated_company_visit: boolean;
  how_did_hear_this_event: string;
  payment_method: "QRIS";
  voucher_code?: string;
};

export type PetrovisRegistrationResponse = {
  invoice_url: string;
};

export type PetrovisSPE = {
  id: string;
  name: string;
};

export type PetrovisListItem = {
  id: string;
  spe: string;
  email: string;
  name: string;
  institution: string;
  status: "paid" | "pending" | "cancelled" | "verified" | string;
};

export type PetrovisDetail = {
  id: string;
  spe: string;
  email: string;
  name: string;
  institution: string;
  department: string;
  batch: string;
  student_id_number: string;
  student_id_card: string;
  phone_number: string;
  motivation_joining_company_visit: string;
  have_you_ever_participated_company_visit: boolean;
  how_did_hear_this_event: string;
  status: "paid" | "pending" | "cancelled" | "verified" | string;
};

export type PetrovisRegistrantCount = {
  total: number;
  paid: number;
  pending: number;
  cancelled: number;
};
