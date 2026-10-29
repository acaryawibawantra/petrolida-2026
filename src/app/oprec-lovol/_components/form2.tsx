import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form2 } from "@/types/page/lovol-registration";

const skillOptions = [
  { label: "No Proficiency", value: 1 },
  { label: "Poor", value: 2 },
  { label: "Decent", value: 3 },
  { label: "Good", value: 4 },
  { label: "Very Good", value: 5 },
];

export default function Form2Components() {
  const { control } = useFormContext<Form2>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[35px] font-bold">What's Your Skill Level?</h2>
        <p className="text-xl font-medium text-[#7A7A7A]">
          Select Your Expertise and Unlock Opportunities Tailored Just for You!
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <FormField
          control={control}
          name="english_proficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                English Proficiency
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  className="flex justify-evenly"
                >
                  {skillOptions.map((option) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center gap-3"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="communication_skill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Communication Skill
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  className="flex justify-evenly"
                >
                  {skillOptions.map((option) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center gap-3"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fast_response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Fast Response
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  className="flex justify-evenly"
                >
                  {skillOptions.map((option) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center gap-3"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="time_management"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Time Management
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  className="flex justify-evenly"
                >
                  {skillOptions.map((option) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center gap-3"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
