type OprecResponseBasic = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  department: string;
  batch: string;
  student_id: string;
  phone_number: string;
  line_id: string;
  status: "interviewed" | "pending" | "accepted" | "rejected";
};

type OprecResponseGeneral = {
  about_petrolida: string;
  primary_division: string;
  secondary_division: string;
  accepted_division: string;
};

type OprecResponsePrimaryDivision = {
  about_primary_division: string;
  reason_join_primary_division: string;
  innovation_idea_primary_division: string;
  previous_experience_primary_division: string;
};

type OprecResponseSecondaryDivision = {
  about_secondary_division: string;
  reason_join_secondary_division: string;
  innovation_idea_secondary_division: string;
  previous_experience_secondary_division: string;
};

type OprecResponseDocuments = {
  required_document_link: string;
  portfolio_asset_link: string;
};

type TypeOprecStaffResponse = OprecResponseBasic &
  OprecResponseGeneral &
  OprecResponsePrimaryDivision &
  OprecResponseSecondaryDivision &
  OprecResponseDocuments;

export type {
  OprecResponseBasic,
  OprecResponseGeneral,
  OprecResponsePrimaryDivision,
  OprecResponseSecondaryDivision,
  OprecResponseDocuments,
  TypeOprecStaffResponse,
};
