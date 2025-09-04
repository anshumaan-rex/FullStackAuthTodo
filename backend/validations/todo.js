import { z } from "zod";

export const validateTodoCreateSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required" })
    .max(40, { error: "Title is too long" })
    .trim(),
  description: z
    .string()
    .trim()
    .max(400, { error: "Description is too long" })
    .optional(),
});

export const validateTodoUpdateSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required" })
    .max(40, { error: "Title is too long" })
    .trim()
    .optional(),
  description: z
    .string()
    .trim()
    .max(400, { error: "Description is too long" })
    .optional(),
  completed: z.boolean().optional()
});
