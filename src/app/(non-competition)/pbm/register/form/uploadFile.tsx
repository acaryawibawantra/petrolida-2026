import usePBMRegistrationStore, {
  FileAttachment,
} from "@/stores/use-pbm-registration-store";
import { FileImage, FileText, Upload } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type UploadFileProps = {
  name: keyof FileAttachment;
  supportFiles?: string[];
  accept?: Accept;
  className?: string;
  title: string;
  description?: string | ReactNode;
  isRequired?: boolean;
  variant: "md" | "lg";
};

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
  const [, setfileUrl] = useState("");

  // Safe destructuring in case used outside FormProvider, though strictly seemingly used inside one here.
  const { setValue, clearErrors } = useFormContext() || {};

  const { setFile, fileAttachment } = usePBMRegistrationStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        const message =
          rejectedFiles[0].errors[0].code === "file-too-large"
            ? "Ukuran file terlalu besar"
            : rejectedFiles[0].errors[0].code === "file-invalid-type"
              ? "Tipe file tidak didukung"
              : (rejectedFiles[0].errors[0].message as string);
        setError({ message });
      } else {
        setError({ message: "" });
        const file = acceptedFiles[0];
        setFile(name, file);
        if (setValue) {
          // @ts-ignore - name is keyof FileAttachment but form expects string keys matching schema
          setValue(name, file, { shouldValidate: true });
        }
        if (clearErrors) {
          clearErrors(name as string);
        }
      }
    },
    [name, setFile, setValue, clearErrors],
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 mb
    accept,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setfileUrl(URL.createObjectURL(acceptedFiles[0]));
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
                        The maximum file size is 1Mb in {supportFiles.join("/")}
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
                        The maximum file size is 1Mb in {supportFiles.join(" ")}
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
                            maksimal file : 1Mb
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
