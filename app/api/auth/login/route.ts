import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // In production: look up user by email, verify password with bcrypt
    // const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    // const valid = await bcrypt.compare(password, user.passwordHash);

    // Prototype: return success with mock user data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: "mock-user-id-001",
          name: "Warrior",
          email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
