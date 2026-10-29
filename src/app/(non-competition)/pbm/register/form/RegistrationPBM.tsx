"use client";

import Input from "@/components/form/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegistrationFormPBMType } from "@/types/page/pbm-registration";
import { useFormContext } from "react-hook-form";
import UploadFile from "./uploadFile";

type RegistrationPBMProps = {
  batchList?: { id: string; name: string }[];
  isBatchLoading: boolean;
};

export default function RegistrationPBM({
  batchList,
  isBatchLoading,
}: RegistrationPBMProps) {
  const { control } = useFormContext<RegistrationFormPBMType>();

  return (
    <div>
      <div className="flex flex-col gap-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" id="name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: 6282131943171"
                  type="number"
                  id="phone_number"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="institution"
          rules={{ required: "Institution is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>University/Institution</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: Sepuluh Nopember Institute of Technology"
                  id="institution"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: Petroleum Engineering"
                  id="major"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <UploadFile
          name="follow_instagram"
          title="Proof of Followed PETROLIDA 2026 Official Instagram"
          supportFiles={["JPG", "PNG", "JPEG"]}
          accept={{ "image/*": [] }}
          variant="lg"
          isRequired
        />

        <UploadFile
          name="follow_tiktok"
          title="Proof of Followed PETROLIDA 2026 Official Tiktok"
          supportFiles={["JPG", "PNG", "JPEG"]}
          accept={{ "image/*": [] }}
          variant="lg"
          isRequired
        />

        <FormField
          name="batch_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Batch <span className="text-red-600">*</span>
              </FormLabel>

              <Select
                onValueChange={field.onChange}
                disabled={isBatchLoading}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="text-left">
                    <SelectValue
                      placeholder={
                        isBatchLoading ? "Loading.." : "Select an option"
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {batchList?.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          name="information_from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Where did you hear us from?{" "}
                <span className="text-red-600">*</span>
              </FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="text-left">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="ITS GE">ITS GE</SelectItem>
                  <SelectItem value="SPE International">
                    SPE International
                  </SelectItem>
                  <SelectItem value="Student Organization">
                    Student Organization
                  </SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
