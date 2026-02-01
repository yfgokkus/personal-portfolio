// lib/validations/user-info.validation.ts
import { z } from "zod";

export const userInfoBaseSchema = z
  .object({
    full_name: z.string().min(1).max(100).optional(),
    titles: z.string().min(1).optional(),
    about_title: z.string().min(1).max(200, "Title is too long").optional(),
    about_desc: z
      .string()
      .min(1)
      .max(2000, "Description is too long")
      .optional(),
    email: z.email("Invalid email address").optional(),
  })
  .refine(
    (data) =>
      (!!data.about_title && !!data.about_desc) ||
      (!data.about_title && !data.about_desc),
    {
      message: "Title and description must be provided together",
    },
  );

export type UserInfoInput = z.infer<typeof userInfoBaseSchema>;
