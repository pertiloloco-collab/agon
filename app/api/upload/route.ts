import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// POST /api/upload — Generic file upload handler
// ═══════════════════════════════════════════════════════════

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

interface UploadRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  context?: "progress_photo" | "proof" | "reward_media" | "profile";
}

interface UploadResponse {
  url: string;
  thumbnailUrl: string | null;
  size: number;
}

export async function POST(request: Request) {
  try {
    const body: UploadRequest = await request.json();

    if (!body.fileName || !body.fileType || !body.fileSize) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fileType, fileSize" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(body.fileType)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${body.fileType}. Allowed: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    const isVideo = ALLOWED_VIDEO_TYPES.includes(body.fileType);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (body.fileSize > maxSize) {
      const maxMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          error: `File too large. Maximum size for ${isVideo ? "video" : "image"} files is ${maxMB}MB.`,
        },
        { status: 400 }
      );
    }

    // In production: generate a signed upload URL from Supabase storage
    // const { data, error } = await supabase.storage
    //   .from('uploads')
    //   .createSignedUploadUrl(`${userId}/${context}/${fileName}`);

    const response: UploadResponse = {
      url: `https://placeholder.supabase.co/storage/v1/object/public/uploads/${body.context || "general"}/${body.fileName}`,
      thumbnailUrl: null,
      size: body.fileSize,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Upload POST error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
