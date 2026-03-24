import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// POST /api/ai/photo-analysis — AI-powered physique analysis
// ═══════════════════════════════════════════════════════════

interface PhotoAnalysisRequest {
  imageUrl: string;
  previousImageUrl?: string;
}

interface PhotoAnalysisResponse {
  analysis: string;
  recommendations: string[];
  comparisonAvailable: boolean;
}

export async function POST(request: Request) {
  try {
    const body: PhotoAnalysisRequest = await request.json();

    if (!body.imageUrl) {
      return NextResponse.json(
        { error: "Missing required field: imageUrl" },
        { status: 400 }
      );
    }

    // In production: send image(s) to vision model for analysis
    // const result = await analyzePhysique(body.imageUrl, body.previousImageUrl);

    const mockAnalysis: PhotoAnalysisResponse = {
      analysis:
        "Visible improvement in shoulder width and upper chest development. Arms showing increased definition. Waist appears slightly leaner. Lagging areas: rear delts could use more volume. Overall trajectory: positive.",
      recommendations: [
        "Add 2 sets face pulls per session",
        "Consider rear delt flyes as first exercise",
      ],
      comparisonAvailable: !!body.previousImageUrl,
    };

    return NextResponse.json(mockAnalysis, { status: 200 });
  } catch (error) {
    console.error("Photo analysis POST error:", error);
    return NextResponse.json(
      { error: "Failed to analyze photo" },
      { status: 500 }
    );
  }
}
