import { FileImage, FileText, Upload } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";

import useLovolRegistrationStore, {
  LovolFileAttachment,
} from "@/stores/use-lovol-file-store";
import { useFormContext } from "react-hook-form";

type UploadFileProps = {
  name: keyof LovolFileAttachment;
  supportFiles?: string[];
  accept?: Accept;
  className?: string;
  title: string;
  description?: string | ReactNode;
  isRequired?: boolean;
  variant: "md" | "lg";
  // lg | md | sm but sm is only for mobile
};

// https://react-dropzone.js.org/#section-accepting-specific-file-types
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

export default function UploadFile({
  name,
  supportFiles = [],
  accept = {},
  className,
  title,
  description,
  isRequired,
  variant,
}: UploadFileProps) {
  const [error, setError] = useState({ message: "" });
  const [, setFileUrl] = useState("");

  const { setFile, fileAttachment } = useLovolRegistrationStore();

  const { setValue } = useFormContext();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0];
        const message =
          err.code === "file-too-large"
            ? "Ukuran file terlalu besar"
            : err.code === "file-invalid-type"
              ? "Tipe file tidak didukung"
              : err.message;

        setError({ message });
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      setError({ message: "" });

      //  zustand
      setFile(name, file);

      // react hook form
      setValue(name, file, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [name, setFile, setValue],
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 3_000_000, // 3MB
    accept,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    }
  }, [acceptedFiles]);

  return (
    <section className={twMerge(`${className}`, "flex w-full flex-col")}>
      <div className="mb-[6px]">
        <h5
          className={twMerge(
            "text-sm font-semibold",
            isRequired === true
              ? "after:ml-0.5 after:text-red-600 after:content-['*']"
              : "",
          )}
        >
          {title}
        </h5>
      </div>
      <div>
        {fileAttachment[name]?.name ? (
          // Uploaded File
          <>
            <div
              className={twMerge(
                "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-default-500 max-md:py-[18px]",
                variant === "md" ? "py-6" : "py-8",
              )}
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <FileText size={26} />
                  <p
                    className={twMerge(
                      "px-10 text-sm font-bold text-slate-900 max-md:text-sm",
                    )}
                  >
                    {fileAttachment[name]?.name}
                  </p>

                  {acceptedFiles.length === 0 && (
                    <>
                      <p className="px-10 text-xs text-default-500">
                        The maximum file size is 3 Mb in{" "}
                        {supportFiles.join("/")} format
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Default
          <section className="flex flex-col gap-4">
            {error.message === "" ? (
              <>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />

                  <div className="flex flex-col gap-2 text-default-500  ">
                    <div className="flex h-[60px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#EFEFEF] text-slate-900">
                      <Upload size={24} /> Upload file here
                    </div>
                    <div className="flex flex-col gap-1 self-start">
                      {description === "" ? null : (
                        <p className="text-sm font-medium text-[#9D9D9D]">
                          {description}
                        </p>
                      )}
                      <p className="text-sm font-medium text-[#9D9D9D]">
                        The maximum file size is 3 Mb in .
                        {supportFiles.join(" ")} format
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={twMerge(
                    "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-danger-500 max-md:py-[18px]",
                    variant === "md" ? "py-6" : "py-8",
                  )}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />

                  <div className="flex flex-col items-center justify-center gap-2 text-center text-danger-500 ">
                    <FileImage className="text-default-700" size={32} />
                    <div className="flex flex-col gap-1">
                      <p
                        className={twMerge(
                          "font-bold max-md:text-sm",
                          variant === "md" ? "text-base" : "text-lg",
                        )}
                      >
                        Upload Filed!
                      </p>
                      <div className="flex flex-col gap-1">
                        <p
                          className={twMerge(
                            "font-semibold",
                            variant === "md" ? "text-sm" : "text-base",
                          )}
                        >
                          {error.message}
                        </p>
                        <p className="px-10 text-sm">
                          Click or Drag & Drop
                          <br />
                          <span>
                            Format file : {supportFiles.join(", ")} <br />{" "}
                            maksimal file : 3Mb
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
