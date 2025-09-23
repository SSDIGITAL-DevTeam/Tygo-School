import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const StudentSchema = z.object({
  id: z.string().min(1), // Student ID (business id, not uuid)
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  currentClass: z.string().min(1),
  status: z.enum(["Active", "Non Active"]),
  flag: z.enum(["green", "yellow", "red"]),
});

export const StudentUpdateSchema = StudentSchema.partial();

export const RegistrationSchema = z.object({
  student_id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  currentClass: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type StudentInput = z.infer<typeof StudentSchema>;
export type StudentUpdateInput = z.infer<typeof StudentUpdateSchema>;
export type RegistrationInput = z.infer<typeof RegistrationSchema>;

