// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Prisma } from "@/lib/generated/prisma/client";
import { ZodError } from "zod";
import {
  createMessageSchema,
  updateMessageSchema,
  deleteMessageSchema,
} from "@/lib/validations/message.validation";
import { toErrorString } from "@/lib/zod";

export async function GET() {
  try {
    const messages = await prisma.messages.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    const message = await prisma.messages.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: toErrorString(error),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create message" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateMessageSchema.parse(body);

    const message = await prisma.messages.update({
      where: { id: validatedData.id },
      data: { is_read: validatedData.is_read },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: toErrorString(error),
        },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Message not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = deleteMessageSchema.parse(body);

    await prisma.messages.delete({
      where: { id: validatedData.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: toErrorString(error),
        },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Message not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
