import { create } from "zustand";
import { DevtoolsOptions, devtools } from "zustand/middleware";

export interface PetrovisFileAttachment {
  student_id_card: File | null;
  proof_of_payment: File | null;
}

type PetrovisFormState = {
  fileAttachment: PetrovisFileAttachment;
  setFile: (type: keyof PetrovisFileAttachment, file: File | null) => void;
  resetFiles: () => void;
};

const initialFile: PetrovisFileAttachment = {
  student_id_card: null,
  proof_of_payment: null,
};

const usePetrovisFormStore = create<PetrovisFormState>()(
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
    { name: "oprec-petrovis-form" } as DevtoolsOptions,
  ),
);

export default usePetrovisFormStore;
