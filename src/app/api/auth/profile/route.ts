import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { decodeUserEmail } from "@/lib/auth-token";

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userCookie = request.cookies.get("naaz-user")?.value;
    const sessionEmail = decodeUserEmail(userCookie);
    
    if (!sessionEmail) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, phone, currentPassword, newPassword } = await request.json();
    const email = sessionEmail;

    // Password change flow — verify current password before updating.
    if (typeof newPassword === "string" && newPassword.length > 0) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { message: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const matches = await bcrypt.compare(
        typeof currentPassword === "string" ? currentPassword : "",
        user.password
      );
      if (!matches) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 401 }
        );
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return NextResponse.json({ message: "Password changed successfully" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { name, phone } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      createdAt: updatedUser.createdAt,
    });
  } catch (error: unknown) {
    console.error("Update profile API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
