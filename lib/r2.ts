// lib/r2.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\.+/g, ".")
    .substring(0, 100);
}

export async function uploadProjectImage(
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; imagePath: string }> {
  return await uploadImage(filename, contentType, "project-images");
}
export async function uploadResumeImage(
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; imagePath: string }> {
  return await uploadImage(filename, contentType, "resume-images");
}
export async function uploadImage(
  filename: string,
  contentType: string,
  folderName: string,
): Promise<{ uploadUrl: string; imagePath: string }> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(contentType)) {
    throw new Error("Invalid image type. Allowed: JPEG, PNG, WebP, GIF");
  }

  const sanitizedFilename = sanitizeFilename(filename);
  const key = `${folderName}/${Date.now()}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
  const imagePath = `/${key}`;

  return { uploadUrl, imagePath };
}

// Upload resume
export async function uploadDocument(
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; imagePath: string }> {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  if (!allowedTypes.includes(contentType)) {
    throw new Error("Invalid document type. Allowed: PDF, DOC, DOCX");
  }

  const sanitizedFilename = sanitizeFilename(filename);
  const key = `resumes/${Date.now()}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
  const imagePath = `/${key}`;

  return { uploadUrl, imagePath };
}

export async function deleteFromR2(filePath: string): Promise<void> {
  const key = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
  );
}

export async function deleteManyFromR2(fileUrls: string[]) {
  const objects = fileUrls.map((url) => {
    const { pathname } = new URL(url);
    return { Key: pathname.slice(1) };
  });

  await r2.send(
    new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Delete: {
        Objects: objects,
        Quiet: true,
      },
    }),
  );
}

// Validate image file
export function validateImgSize(fileSize: number): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (fileSize > maxSize) {
    return { valid: false, error: "Image too large. Maximum size: 5MB" };
  }

  return { valid: true };
}

// Validate resume file
export function validateDocSize(fileSize: number): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (fileSize > maxSize) {
    return { valid: false, error: "Document too large. Maximum size: 10MB" };
  }

  return { valid: true };
}

// Allowed MIME types with their magic bytes (file signatures)
const IMAGE_SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF
  "image/gif": [[0x47, 0x49, 0x46, 0x38]], // GIF8
};

const DOCUMENT_SIGNATURES: Record<string, number[][]> = {
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
  // DOCX/DOC are ZIP-based, start with PK
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    [0x50, 0x4b, 0x03, 0x04],
  ],
  "application/msword": [[0xd0, 0xcf, 0x11, 0xe0]], // OLE format
};

// Verify file signature matches MIME type
export function verifyFileSignature(
  buffer: ArrayBuffer,
  mimeType: string,
): boolean {
  const arr = new Uint8Array(buffer);
  const signatures = { ...IMAGE_SIGNATURES, ...DOCUMENT_SIGNATURES }[mimeType];

  if (!signatures) return false;

  return signatures.some((signature) =>
    signature.every((byte, i) => arr[i] === byte),
  );
}
