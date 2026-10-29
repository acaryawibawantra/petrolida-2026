import { SelectGroup } from "@radix-ui/react-select";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetDepartment,
  useGetDivision,
  useGetFaculty,
} from "@/hooks/use-master-data";
import { Form1 } from "@/types/page/oprec-staff";

export default function Form1Components() {
  const { control } = useFormContext<Form1>();

  const { divisionList: SubdivisionList } = useGetDivision();
  const { departmentList: DEPARTMENT } = useGetDepartment();
  const { facultyList: FACULTY } = useGetFaculty();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[35px] font-bold">General Information</h2>
        <p className="text-xl font-medium text-[#7A7A7A]">
          We're excited to get to know you! Please fill in your personal details
          below to start your application.
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
                <Input placeholder="Enter your name" {...field} />
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
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
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
                <Input placeholder="e.g., NRP 12345678" {...field} />
              </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Department <span className="text-red-600">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
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
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Faculty <span className="text-red-600">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your faculty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FACULTY?.map((e: any) => (
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
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Whatsapp Number <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="ex : 628123456789" {...field} />
              </FormControl>
              <FormDescription>Use 62 as prefix</FormDescription>
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
                <Input placeholder="ex : @lineid" {...field} />
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
          name="primary_division_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Primary Division <span className="text-red-600">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary division" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SubdivisionList?.map((division: any) => (
                    <SelectGroup key={division.id}>
                      <SelectLabel>{division.division}</SelectLabel>
                      {division.subdivisions.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="secondary_division_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Secondary Division <span className="text-red-600">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your secondary division" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SubdivisionList?.map((division: any) => (
                    <SelectGroup key={division.id}>
                      <SelectLabel>{division.division}</SelectLabel>
                      {division.subdivisions.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
