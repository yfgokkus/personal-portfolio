import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  createExperienceSchema,
  updateExperienceSchema,
  deleteExperienceSchema,
} from "@/lib/validations/experiences.validation";
import { ZodError } from "zod";
import { toErrorString } from "@/lib/zod";

export async function GET() {
  try {
    const experiences = await prisma.experiences.findMany({
      orderBy: {
        start_date: "desc",
      },
    });

    if (!experiences || experiences.length === 0) {
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
      data: experiences,
    });
  } catch (error) {
    console.error("Failed to fetch experiences:", error);

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
        error: "Failed to fetch projects",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createExperienceSchema.parse(body);

    const experience = await prisma.experiences.create({
      data: {
        role: validatedData.role,
        description: validatedData.description,
        corporation: validatedData.corporation,
        location: validatedData.location,
        start_date: validatedData.start_date,
        end_date: validatedData.end_date ?? null,
      },
    });

    return NextResponse.json(
      { success: true, data: experience },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: toErrorString(error),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create experience",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateExperienceSchema.parse(body);

    const { id, ...updateData } = validatedData;

    const experience = await prisma.experiences.update({
      where: { id },
      data: {
        ...updateData,
        end_date: updateData.end_date ?? null,
      },
    });

    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: toErrorString(error) },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Experience not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to update experience" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = deleteExperienceSchema.parse(body);

    await prisma.experiences.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: toErrorString(error) },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Experience not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete experience" },
      { status: 500 },
    );
  }
}
