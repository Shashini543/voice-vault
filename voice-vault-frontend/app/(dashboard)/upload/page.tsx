import { UploadForm } from "@/components/upload/UploadForm";

export default function UploadPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white light:text-slate-900">Upload Study Notes</h1>
        <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
          Upload your notes and we&apos;ll transform them into audio.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
