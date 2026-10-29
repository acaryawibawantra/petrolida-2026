import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Form2 } from "@/types/page/oprec-staff";

export default function Form2Components() {
  const { control } = useFormContext<Form2>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[35px] font-bold">Your Primary Division</h2>
        <p className="text-xl font-medium text-[#7A7A7A]">
          Tell us why you're a great fit for your first-choice division.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="about_primary_division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What do you know about this division?{" "}
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us what you know about the roles and responsibilities within this division."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="reason_join_primary_division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Why do you want to join this division?{" "}
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain what motivates you to join this team."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="innovation_idea_primary_division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What ideas would you bring to this division?{" "}
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share any ideas you have for new projects or improvements."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="previous_experience_primary_division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please describe any relevant previous experience. (Optional){" "}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detail any past projects, roles, or skills that relate to this position."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
