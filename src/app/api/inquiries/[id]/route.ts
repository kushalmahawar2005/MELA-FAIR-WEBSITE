import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    const updated = await Inquiry.findOneAndUpdate(
      { id },
      { $set: { status: body.status } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
