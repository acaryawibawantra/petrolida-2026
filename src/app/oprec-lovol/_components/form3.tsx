import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form3 } from "@/types/page/lovol-registration";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import UploadFile from "./upload-file";

export default function Form3Components() {
  const { register, control } = useFormContext<Form3>();

  useEffect(() => {
    register("cv_asset");
    register("follow_proof_asset");
  }, [register]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[35px] font-bold">You`re Almost There!</h2>
        <p className="text-xl font-medium text-[#7A7A7A]">
          Just One More Step Provide the Necessary Proofs and Attachments to
          Finalize Your Registration.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="willing_to_pay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Are you willing to pay ? <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(value === "true")}
                  className="flex gap-8"
                >
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="transfer_to_other_division"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Are you willing to be transferred to another division that isn’t
                your choice ? <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(value === "true")}
                  className="flex gap-8"
                >
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <UploadFile
          name="cv_asset"
          title="Please upload your CV here"
          variant="lg"
          supportFiles={["pdf"]}
          accept={{
            "application/pdf": [".pdf"],
          }}
        />

        <UploadFile
          name="follow_proof_asset"
          title="Proof of Followed PETROLIDA 2026 Official Instagram"
          variant="lg"
          supportFiles={["jpeg", "jpg", "png"]}
          accept={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
          }}
        />
      </div>
    </div>
  );
}
