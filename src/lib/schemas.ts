import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const itemCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const itemUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

