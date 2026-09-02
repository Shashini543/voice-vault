"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema, type UploadFormValues } from "@/lib/validations/upload";
import { uploadNote } from "@/lib/api/notes";
import { getErrorMessage } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Dropzone } from "./Dropzone";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const tips = [
  "PDF files with selectable text produce the most accurate results",
  "Images should be clear, well-lit, and with legible handwriting",
  "Organize notes by topic for more focused audio episodes",
];

export function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UploadFormValues>({ resolver: zodResolver(uploadSchema) });

  const selectedFile = watch("file");

  async function onSubmit(values: UploadFormValues) {
    setError(null);
    try {
      await uploadNote({ file: values.file, title: values.title });
      router.push(ROUTES.notes);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <p className="mb-5 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <Dropzone
          id="file"
          file={selectedFile}
          onFileSelect={(file) => setValue("file", file as File, { shouldValidate: true })}
        />
        {errors.file && <p className="mt-2 text-xs text-red-400">{errors.file.message}</p>}

        <Button type="submit" className="mt-5 w-full" isLoading={isSubmitting} disabled={isSubmitting}>
          Upload Notes
        </Button>
      </form>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 light:text-slate-500">
          Tips for best results
        </p>
        <ul className="mt-3 space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-slate-300 light:text-slate-600">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-500" />
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
