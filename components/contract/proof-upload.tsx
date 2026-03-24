"use client";

import { useRef, useState } from "react";
import { Camera, Check, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProofUploadProps {
  onUpload: (file: File) => void;
  currentProofUrl?: string;
}

export function ProofUpload({ onUpload, currentProofUrl }: ProofUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentProofUrl ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    onUpload(file);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative">
          <div className="h-16 w-16 overflow-hidden rounded-md border border-[#1F1F1F]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Proof"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E]">
            <Check className="h-2.5 w-2.5 text-[#050505]" strokeWidth={3} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-md",
            "border border-dashed border-[#525252] hover:border-[#C9A84C]/50",
            "text-[#525252] hover:text-[#C9A84C] transition-colors"
          )}
        >
          <Camera className="h-5 w-5" />
          <span className="text-[8px] uppercase tracking-wider">Upload</span>
        </button>
      )}

      {!preview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-[#A3A3A3] hover:text-[#C9A84C] transition-colors"
        >
          Take photo or choose image
        </button>
      )}

      {preview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-[#A3A3A3] hover:text-[#C9A84C] transition-colors"
        >
          Replace image
        </button>
      )}
    </div>
  );
}
