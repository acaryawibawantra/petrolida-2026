export type RegistrationFormPBMType = {
  name: string;
  phone_number: string;
  institution: string;
  email: string;
  follow_instagram: string;
  follow_tiktok: string;
  batch_id: string;
  information_from: string;
  major?: string;
};

export type RegistrationFormPBMResponse = {
  id: string;
  name: string;
  phone_number: string;
  institution: string;
  email: string;
  follow_instagram: string;
  follow_tiktok: string;
  batch: string;
  group_whatsapp: string;
};

export type SuccessPageProps = {
  apiResponse: RegistrationFormPBMResponse | null;
};
