import { z } from "zod";

export const validateUserSignupSchema = z.object({
  name: z
    .string()
    .min(3, { error: "Name should be at least 3 characters" })
    .max(30, { error: "Name is too long" }),
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .max(64, { error: "password is too long" }),
});

export const validateUserLoginSchema = z.object({
  email: z.email(),
  password: z.string({ error: "Password is required" }).min(1, { error: "Password is required" })
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, { error: "Password must have at least 8 characters" }).max(64, { error: "Password is too long" }),
  confirmPassword: z.string()
}).refine((val) => val.password === val.confirmPassword, {
  error: "password do not match",
  path: ["confirmPassword"]
})