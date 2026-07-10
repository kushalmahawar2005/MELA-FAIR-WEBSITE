import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Content from "@/models/Content";
import { defaultHomeContent } from "@/lib/content";

const CONTENT_KEY = "home";

export async function GET() {
  try {
    await connectToDatabase();

    let doc = await Content.findOne({ key: CONTENT_KEY });
    if (!doc) {
      doc = await Content.create({ key: CONTENT_KEY, data: defaultHomeContent });
    }

    return NextResponse.json(doc.data);
  } catch (error: any) {
    console.error("Fetch content error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    let doc = await Content.findOne({ key: CONTENT_KEY });
    if (!doc) {
      doc = await Content.create({ key: CONTENT_KEY, data: defaultHomeContent });
    }

    let nextData = doc.data;

    if (body && typeof body.section === "string" && "value" in body) {
      nextData = { ...doc.data, [body.section]: body.value };
    } else if (body?.data) {
      nextData = body.data;
    } else {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    doc.data = nextData;
    await doc.save();

    return NextResponse.json(doc.data);
  } catch (error: any) {
    console.error("Update content error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
