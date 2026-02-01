import { z } from "zod";

// For creating project images inside project create/update (no project_id needed)
export const nestedProjectImageSchema = z.object({
  image: z.string().min(1, "Image URL is required"),
});

// For standalone project_images operations
export const projectImageSchema = z.object({
  id: z.uuid().optional(),
  project_id: z.uuid({ message: "Invalid project ID" }),
  image: z.string().min(1, "Image URL is required"),
});

export const updateProjectImageSchema = projectImageSchema.partial().extend({
  id: z.uuid({ message: "Invalid ID" }),
});

export const deleteProjectImageSchema = z.object({
  id: z.uuid({ message: "Invalid ID" }),
});

// ---------------- PROJECT ----------------

export const projectSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().nullable().optional(),

  github_link: z.url("Invalid GitHub URL").nullable().optional(),

  project_date: z.coerce.date("Invalid date format"),
  created_at: z.date().optional(),

  project_images: z.array(nestedProjectImageSchema).optional(),
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  created_at: true,
});

export const updateProjectSchema = projectSchema.partial().extend({
  id: z.uuid({ message: "Invalid ID" }),
});

export const deleteProjectSchema = z.object({
  id: z.uuid({ message: "Invalid ID" }),
});
