import { z } from "zod";

export const createMentorshipSchema = z.object({
  mentorId: z.string().min(1),
  topic: z.string().min(3, "Descreva o tópico da mentoria"),
  message: z.string().min(10, "Escreva uma mensagem para o mentor").max(500),
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const rejectMentorshipSchema = z.object({
  reason: z.string().max(300).optional(),
});

export type CreateMentorshipInput = z.infer<typeof createMentorshipSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type RejectMentorshipInput = z.infer<typeof rejectMentorshipSchema>;
