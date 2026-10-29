import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetDepartment, useGetLovolDivision } from "@/hooks/use-master-data";
import { Form1 } from "@/types/page/lovol-registration";

export default function Form1Components() {
  const { control } = useFormContext<Form1>();

  const { divisionList: SubdivisionList } = useGetLovolDivision();
  const { departmentList: DEPARTMENT } = useGetDepartment();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[35px] font-bold">Tell us About Yourself!</h2>
        <p className="text-xl font-medium text-[#7A7A7A]">
          Help us get to know you better! It only takes a minute to fill in your
          personal details
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Major <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your major" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DEPARTMENT?.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Academic Year <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your academic year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="student_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Student ID <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., NRP 12345678"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="practical_work"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Especially for the batch 2023, are there plans for Practical
                Work (Kerja Praktek) in May/June 2026?
                <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="-">-</SelectItem>
                </SelectContent>
              </Select>
              <FormLabel className="text-gray-400">
                If you are batch 2024 or 2025, please answer with "-" option
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Whatsapp Number <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ex : 08123456789"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="line_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Line ID <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ex : @lineid"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                Add the “@” symbols before writing the ID
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="information_from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Where do you get information about PETROLIDA ?{" "}
                <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="about_petrolida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What do you know about PETROLIDA?{" "}
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide a brief description of what you know about PETROLIDA."
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
          name="primary_division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Primary Division <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary division" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SubdivisionList?.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="primary_motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please tell us what your motivation choose Primary Division
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write here"
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
          name="secondary_division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Secondary Division <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your secondary division" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SubdivisionList?.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="secondary_motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please tell us what your motivation choose Secondary Division
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write here"
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
