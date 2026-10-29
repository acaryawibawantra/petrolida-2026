"use client";

import { FileImage, FileText, Upload } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";

type UploadFileProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  supportFiles?: string[];
  accept?: Accept;
  className?: string;
  title: string;
  description?: string | ReactNode;
  isRequired?: boolean;
  variant?: "md" | "lg";
  maxSize?: number; // in bytes
};

export default function UploadFile({
  value,
  onChange,
  supportFiles = ["jpg", "jpeg", "png"],
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  className,
  title,
  description,
  isRequired = true,
  variant = "md",
  maxSize = 10_000_000, // default 10MB (matches API limit)
}: UploadFileProps) {
  const [error, setError] = useState({ message: "" });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0];
        const maxSizeMB = Math.round(maxSize / 1_000_000);
        const message =
          err.code === "file-too-large"
            ? `File size is too large (max ${maxSizeMB}MB)`
            : err.code === "file-invalid-type"
              ? "File type is not supported"
              : err.message;

        setError({ message });
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      setError({ message: "" });

      // IMPORTANT: File is passed as-is without any compression or modification
      // The original file quality and size are preserved
      onChange(file);
    },
    [onChange, maxSize],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: maxSize,
    accept,
  });

  return (
    <section className={twMerge(`${className}`, "flex w-full flex-col")}>
      <div className="mb-[6px]">
        <h5
          className={twMerge(
            "text-base font-semibold text-gray-700",
            isRequired === true
              ? "after:ml-0.5 after:text-red-600 after:content-['*']"
              : "",
          )}
        >
          {title}
        </h5>
      </div>
      <div>
        {value?.name ? (
          // Uploaded File
          <div
            className={twMerge(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 max-md:py-[24px]",
              variant === "md" ? "py-8" : "py-10",
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <div className="flex flex-col items-center gap-2">
                <FileText size={32} className="text-primary-500" />
                <p className="px-10 text-base font-bold text-slate-900 max-md:text-sm">
                  {value.name}
                </p>
                <p className="px-10 text-sm text-gray-500">
                  Click or drag to replace file
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Default or Error State
          <section className="flex flex-col gap-4">
            {error.message === "" ? (
              <>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />

                  <div className="flex h-[80px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#EFEFEF] text-slate-900 hover:bg-gray-200 transition-colors">
                    <Upload size={28} /> Upload file here
                  </div>
                </div>
                <div className="flex flex-col gap-1 self-start text-gray-500">
                  {description && (
                    <p className="text-sm font-medium text-[#9D9D9D]">
                      {description}
                    </p>
                  )}
                  <p className="text-sm font-medium text-[#9D9D9D]">
                    Maximum file size is {Math.round(maxSize / 1_000_000)}MB in{" "}
                    {supportFiles.join(", ")} format
                  </p>
                </div>
              </>
            ) : (
              <div
                className={twMerge(
                  "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-500 max-md:py-[24px]",
                  variant === "md" ? "py-8" : "py-10",
                )}
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center gap-2 text-center text-red-500">
                  <FileImage className="text-red-500" size={36} />
                  <div className="flex flex-col gap-1">
                    <p
                      className={twMerge(
                        "font-bold max-md:text-sm",
                        variant === "md" ? "text-base" : "text-lg",
                      )}
                    >
                      Upload Failed!
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
                          Format: {supportFiles.join(", ")} <br /> Max size:{" "}
                          {Math.round(maxSize / 1_000_000)}MB
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
