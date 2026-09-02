import { z } from "zod";
import { ACCEPTED_UPLOAD_TYPES, MAX_UPLOAD_SIZE_BYTES } from "@/lib/constants";

export const uploadSchema = z.object({
  title: z.string().optional(),
  file: z
    .instanceof(File, { message: "Please choose a file to upload" })
    .refine((file) => file.size > 0, "Please choose a file to upload")
    .refine(
      (file) => file.size <= MAX_UPLOAD_SIZE_BYTES,
      "File is too large. Maximum size is 50 MB"
    )
    .refine(
      (file) => ACCEPTED_UPLOAD_TYPES.includes(file.type as (typeof ACCEPTED_UPLOAD_TYPES)[number]),
      "Unsupported file type. Use PDF, TXT, PNG, or JPG"
    ),
});

export type UploadFormValues = z.infer<typeof uploadSchema>;
