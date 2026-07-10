import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Internal Server Error";
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    const lowerEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const newPassword = typeof password === "string" ? password : "";

    if (!lowerEmail) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email" },
        { status: 404 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
