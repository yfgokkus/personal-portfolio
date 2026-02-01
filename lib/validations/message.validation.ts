// lib/validations/message.validation.ts
import { z } from "zod";

export const createMessageSchema = z.object({
  sender_name: z.string().min(1, "Name is required").max(100),
  sender_email: z.email("Invalid email address"),
  body: z.string().min(1, "Message is required").max(5000),
});

export const updateMessageSchema = z.object({
  id: z.uuid({ message: "Invalid ID" }),
  is_read: z.boolean(),
});

export const deleteMessageSchema = z.object({
  id: z.uuid({ message: "Invalid ID" }),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type DeleteMessageInput = z.infer<typeof deleteMessageSchema>;
