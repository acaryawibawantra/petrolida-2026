import UploadFile from "@/app/competition/register/form/_components/upload-file";
import type { Accept } from "react-dropzone";

interface UploadAreaProps {
  value: File | null;
  onChange: (file: File | null) => void;
  description?: string;
  accept?: Accept;
  supportFiles?: string[];
  maxSize?: number;
}

export default function UploadArea({
  value,
  onChange,
  description = "Upload your submission file (PDF only)",
  accept = { "application/pdf": [".pdf"] },
  supportFiles = ["pdf"],
  maxSize = 10_000_000,
}: UploadAreaProps) {
  return (
    <UploadFile
      title=""
      value={value}
      onChange={onChange}
      isRequired={false}
      description={description}
      accept={accept}
      supportFiles={supportFiles}
      variant="md"
      maxSize={maxSize}
    />
  );
}
