"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: string;
  signature: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

type CloudinaryUploadButtonProps = {
  folder: string;
  onUploaded: (url: string) => void;
  accept?: string;
  className?: string;
};

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function CloudinaryUploadButton({
  folder,
  onUploaded,
  accept = "image/*",
  className = "",
}: CloudinaryUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("File size must be under 10 MB.");
      return;
    }

    setIsUploading(true);

    try {
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const signatureData = (await signatureResponse.json()) as
        | CloudinarySignature
        | { message?: string };

      if (!signatureResponse.ok) {
        throw new Error(
          "message" in signatureData && signatureData.message
            ? signatureData.message
            : "Unable to prepare upload."
        );
      }

      const { cloudName, apiKey, folder: signedFolder, timestamp, signature } =
        signatureData as CloudinarySignature;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", signedFolder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: formData }
      );
      const uploadData = (await uploadResponse.json()) as CloudinaryUploadResponse;

      if (!uploadResponse.ok || !uploadData.secure_url) {
        throw new Error(uploadData.error?.message || "Cloudinary upload failed.");
      }

      onUploaded(uploadData.secure_url);
      toast.success("Asset uploaded to Cloudinary.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Asset upload failed."
      );
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void uploadFile(file);
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-accent-yellow/30 bg-accent-yellow/10 px-3 text-xs font-display uppercase tracking-wider text-accent-yellow transition hover:border-accent-yellow hover:bg-accent-yellow hover:text-deep-purple disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        {isUploading ? "Uploading" : "Upload"}
      </button>
    </>
  );
}
