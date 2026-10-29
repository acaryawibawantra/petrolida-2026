import { create } from "zustand";
import { DevtoolsOptions, devtools } from "zustand/middleware";

export interface FileAttachment {
  portfolio_asset: File | null;
}

type RegisterFormState = {
  fileAttachment: FileAttachment;
  setFile: (type: keyof FileAttachment, file: File | null) => void;
  resetFiles: () => void;
};

const initialFile: FileAttachment = {
  portfolio_asset: null,
};

const useOprecFormStore = create<RegisterFormState>()(
  devtools(
    (set) => ({
      fileAttachment: initialFile,

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
    }),
    { name: "oprec-staff-form" } as DevtoolsOptions,
  ),
);

export default useOprecFormStore;
