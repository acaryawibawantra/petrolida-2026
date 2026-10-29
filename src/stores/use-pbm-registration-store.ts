import { create } from "zustand";
import { DevtoolsOptions, devtools } from "zustand/middleware";

import { RegistrationFormPBMResponse } from "@/types/page/pbm-registration";

export interface FileAttachment {
  follow_instagram: File | null;
  follow_tiktok: File | null;
}

type RegisterFormState = {
  fileAttachment: FileAttachment;
  setFile: (type: keyof FileAttachment, file: File | null) => void;
  resetFiles: () => void;
  successData: RegistrationFormPBMResponse | null;
  setSuccessData: (data: RegistrationFormPBMResponse | null) => void;
};

const initialFile: FileAttachment = {
  follow_instagram: null,
  follow_tiktok: null,
};

const initialSuccessData: RegistrationFormPBMResponse | null = null;

const usePBMRegistrationStore = create<RegisterFormState>()(
  devtools(
    (set) => ({
      fileAttachment: initialFile,
      successData: initialSuccessData,

      setFile: (type, file) => {
        set((state) => {
          const newFileAttachment = {
            ...state.fileAttachment,
            [type]: file,
          };

          return {
            fileAttachment: newFileAttachment,
          };
        });
      },

      resetFiles: () => {
        set({ fileAttachment: initialFile });
      },

      setSuccessData: (data) => {
        set({ successData: data });
      },
    }),
    { name: "pbm-registration-form" } as DevtoolsOptions,
  ),
);

export default usePBMRegistrationStore;
