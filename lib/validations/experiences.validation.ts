import { z } from "zod";

export const experienceSchema = z.object({
  id: z.uuid().optional(),
  role: z.string().min(1, "Role is required"),
  description: z.string().nullable().optional(),
  corporation: z.string().min(1, "Corporation is required"),
  location: z.string().min(1, "Location is required"),
  start_date: z.coerce.date("Invalid start date"),
  end_date: z.coerce.date("Invalid end date").nullable().optional(),
  created_at: z.date().optional(),
});

export const createExperienceSchema = experienceSchema.omit({
  id: true,
  created_at: true,
});

export const updateExperienceSchema = experienceSchema.partial().extend({
  id: z.uuid({ message: "Invalid ID" }),
});

export const deleteExperienceSchema = z.object({
  id: z.uuid({ message: "Invalid ID" }),
});
