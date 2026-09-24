import { z } from "zod"

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    institution: z.string().trim(),
    role: z.enum(["admin", "teacher", "student"], { message: "Select a primary role" }),
    password: z
      .string()
      .regex(/[a-z]/, "Add a lowercase letter")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    agreeToTerms: z
      .boolean()
      .refine((value) => value, {
        message: "You must accept the Terms of Service to continue",
      }),
  })
  .refine((values) => !values.confirmPassword || values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpValues = z.infer<typeof signUpSchema>
