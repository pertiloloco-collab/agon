import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// GET /api/rewards/[id]/media — Returns media for a reward
// POST /api/rewards/[id]/media — Adds media to a reward
// ═══════════════════════════════════════════════════════════

interface RewardMedia {
  id: string;
  rewardId: string;
  url: string;
  thumbnailUrl: string | null;
  type: "image" | "video";
  sortOrder: number;
  createdAt: string;
}

const mockMedia: RewardMedia[] = [
  {
    id: "media-001",
    rewardId: "reward-001",
    url: "https://placeholder.supabase.co/storage/v1/rewards/media-001.jpg",
    thumbnailUrl:
      "https://placeholder.supabase.co/storage/v1/rewards/media-001-thumb.jpg",
    type: "image",
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In production: fetch media from database for this reward
    // const media = await db.select().from(rewardMedia).where(eq(rewardMedia.rewardId, id));

    const media = mockMedia.filter((m) => m.rewardId === id);

    return NextResponse.json({ media }, { status: 200 });
  } catch (error) {
    console.error("Reward media GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reward media" },
      { status: 500 }
    );
  }
}

interface UploadMediaRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UploadMediaRequest = await request.json();

    if (!body.fileName || !body.fileType) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fileType" },
        { status: 400 }
      );
    }

    // In production: generate a signed upload URL and create a media record
    // const signedUrl = await supabase.storage.createSignedUploadUrl(...);
    // const [media] = await db.insert(rewardMedia).values({...}).returning();

    const newMedia = {
      id: `media-${crypto.randomUUID()}`,
      url: `https://placeholder.supabase.co/storage/v1/rewards/${id}/${body.fileName}`,
      thumbnailUrl: body.fileType.startsWith("image/")
        ? `https://placeholder.supabase.co/storage/v1/rewards/${id}/thumb-${body.fileName}`
        : null,
      sortOrder: mockMedia.length + 1,
    };

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error("Reward media POST error:", error);
    return NextResponse.json(
      { error: "Failed to upload reward media" },
      { status: 500 }
    );
  }
}
