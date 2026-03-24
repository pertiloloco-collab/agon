import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // In production: scrape the URL and extract product details
    // For now, return mock extracted data
    return NextResponse.json(
      {
        success: true,
        url,
        extracted: {
          title: "Product Name",
          price: "$49.99",
          imageUrl: null,
          description: "Product description extracted from the provided URL.",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Extract URL POST error:", error);
    return NextResponse.json(
      { error: "Failed to extract URL data" },
      { status: 500 }
    );
  }
}
