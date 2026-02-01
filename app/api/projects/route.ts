import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
} from "@/lib/validations/project.validation";
import { ZodError } from "zod";
import { toErrorString } from "@/lib/zod";
import { deleteFromR2 } from "@/lib/r2";

// ------------- GET ------------------

export async function GET() {
  try {
    const projects = await prisma.projects.findMany({
      include: {
        project_images: {
          select: {
            image: true,
          },
        },
      },
    });

    if (!projects || projects.length === 0) {
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
      data: projects,
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
        error: "Failed to fetch projects",
      },
      { status: 500 },
    );
  }
}

// ------------- POST ------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const project = await prisma.projects.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        project_date: validatedData.project_date,
        github_link: validatedData.github_link,
        project_images: validatedData.project_images
          ? {
              create: validatedData.project_images.map((img) => ({
                image: img.image,
              })),
            }
          : undefined,
      },
      include: {
        project_images: true,
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
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
        error: "Failed to create project",
      },
      { status: 500 },
    );
  }
}

// ------------- PATCH ------------------

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    const { id, project_images, ...updateData } = validatedData;

    const project = await prisma.projects.update({
      where: { id },
      data: {
        ...updateData,
        project_images: project_images
          ? {
              deleteMany: {},
              create: project_images.map((img) => ({
                image: img.image,
              })),
            }
          : undefined,
      },
      include: {
        project_images: true,
      },
    });

    return NextResponse.json({ success: true, data: project });
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
      },
      { status: 500 },
    );
  }
}

// ------------- DELETE ------------------

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = deleteProjectSchema.parse(body);

    const project = await prisma.projects.findUnique({
      where: { id },
      include: { project_images: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    for (const img of project.project_images) {
      await deleteFromR2(img.image).catch((err) =>
        console.error("R2 delete failed:", err),
      );
    }
    await prisma.projects.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
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
      { success: false, error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
