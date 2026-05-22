import { z } from "zod";

export const studentProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  goals: z.string().min(10, "Descreva seus objetivos (mínimo 10 caracteres)"),
  currentRole: z.string().optional(),
  desiredRole: z.string().optional(),
  skills: z.array(z.string()).default([]),
  areasOfInterest: z.array(z.string()).default([]),
  linkedinUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

export const mentorProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  expertise: z
    .string()
    .min(10, "Descreva sua experiência (mínimo 10 caracteres)"),
  skills: z.array(z.string()).default([]),
  areasOfExpertise: z.array(z.string()).default([]),
  yearsExperience: z.number().int().min(0).max(50).default(0),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  maxStudents: z.number().int().min(1).max(10).default(3),
  linkedinUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type MentorProfileInput = z.infer<typeof mentorProfileSchema>;
