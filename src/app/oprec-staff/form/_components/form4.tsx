import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Form4 } from "@/types/page/oprec-staff";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import UploadFile from "./upload-file";

export default function Form4Components() {
  const { control } = useFormContext<Form4>();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[35px] font-bold">Finalizing Your Application</h2>
        <p className="text-xl font-medium text-[#7A7A7A]">
          To complete your registration, please provide the required documents
          and, if applicable, your portfolio.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="required_document_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Required Documents Folder Link{" "}
                <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the Google Drive folder link containing your KTM, CV, Twibbon, and Proof of Follow assets."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-gray-500">
                Please ensure the Google Drive folder is publicly accessible
                (anyone with the link can view). Include your KTM, CV, Twibbon,
                and at least one screenshot of following a Petrolida
                professional social media account (LinkedIn, Instagram, or
                TikTok).
              </p>
              <Link
                className="text-sm underline"
                target="_blank"
                href={
                  "https://petrolida.com/link/TWIBBONOPRECSTAFFPETROLIDA2026"
                }
              >
                Download Twibbon Here
              </Link>
              <FormMessage />
            </FormItem>
          )}
        />
        <UploadFile
          name="portfolio_asset"
          title="Portfolio (Optional)"
          description="Mandatory for applicants to: Media Production (Editing & Field), Experiential Design, Creative Design, UI/UX, and Special Task for Finance."
          variant="lg"
          supportFiles={["pdf"]}
          accept={{
            "application/pdf": [".pdf"],
          }}
        />
      </div>
    </div>
  );
}
