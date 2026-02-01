import { NextRequest, NextResponse } from "next/server";
import { uploadDocument, validateDocSize, verifyFileSignature } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validation = validateDocSize(file.size);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const isValid = verifyFileSignature(buffer.slice(0, 8), file.type);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid file. File type does not match content.",
        },
        { status: 400 },
      );
    }

    const { uploadUrl, imagePath } = await uploadDocument(file.name, file.type);

    await fetch(uploadUrl, {
      method: "PUT",
      body: buffer,
      headers: { "Content-Type": file.type },
    });

    return NextResponse.json({ success: true, imagePath });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 400 },
    );
  }
}
