import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  validateImgSize,
  verifyFileSignature,
  deleteFromR2,
  uploadResumeImage,
} from "@/lib/r2";

export async function GET(req: NextRequest) {
  const { id } = await req.json();

  try {
    const images = await prisma.resume_images.findMany({
      where: {
        resume_id: id,
      },
    });

    if (!images || images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No projects found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error occurred",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project images",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // 1. Validate size
    const validation = validateImgSize(file.size);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 2. Verify MIME type against file signature
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

    // 3. Upload to R2
    const { uploadUrl, imagePath } = await uploadResumeImage(
      file.name,
      file.type,
    );

    // 4. Upload the actual file using the presigned URL
    await fetch(uploadUrl, {
      method: "PUT",
      body: buffer,
      headers: { "Content-Type": file.type },
    });

    return NextResponse.json({ imagePath });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { imagePath }: { imagePath: string } = await req.json();

    if (!imagePath) {
      return NextResponse.json(
        {
          error: "image array is required",
        },
        { status: 400 },
      );
    }

    await deleteFromR2(imagePath);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Delete image error:", err);

    return NextResponse.json(
      {
        error: "Failed to delete image",
      },
      { status: 500 },
    );
  }
}
