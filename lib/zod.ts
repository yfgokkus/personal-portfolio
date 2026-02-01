// lib/zod.ts
import { ZodError } from "zod";

export type FieldError = {
  field: string;
  message: string;
};

export function toFieldErrors(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export function toErrorString(error: ZodError): string {
  return error.issues.map((issue) => issue.message).join(", ");
}
