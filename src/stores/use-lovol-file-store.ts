import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface LovolFileAttachment {
  cv_asset: File | null;
  follow_proof_asset: File | null;
}

type LovolRegisterStore = {
  fileAttachment: LovolFileAttachment;
  setFile: (type: keyof LovolFileAttachment, file: File | null) => void;
  resetFiles: () => void;
};

const initialFile: LovolFileAttachment = {
  cv_asset: null,
  follow_proof_asset: null,
};

const useLovolRegistrationStore = create<LovolRegisterStore>()(
  devtools(
    (set) => ({
      fileAttachment: initialFile,

      setFile: (type, file) =>
        set((state) => ({
          fileAttachment: {
            ...state.fileAttachment,
            [type]: file,
          },
        })),

      resetFiles: () => set({ fileAttachment: initialFile }),
    }),
    { name: "lovol-registration-form" },
  ),
);

export default useLovolRegistrationStore;
