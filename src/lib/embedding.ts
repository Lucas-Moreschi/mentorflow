import { gemini } from "./gemini";
import { prisma } from "./prisma";
import type { StudentProfile, MentorProfile } from "@prisma/client";

export function buildStudentText(profile: StudentProfile): string {
  const parts = [
    "Student seeking mentorship.",
    profile.goals ? `Learning goals: ${profile.goals}.` : "",
    profile.skills.length > 0 ? `Current skills: ${profile.skills.join(", ")}.` : "",
    profile.areasOfInterest.length > 0 ? `Interested in: ${profile.areasOfInterest.join(", ")}.` : "",
    profile.currentRole ? `Currently working as: ${profile.currentRole}.` : "",
    profile.desiredRole ? `Wants to become: ${profile.desiredRole}.` : "",
    profile.bio ? `Bio: ${profile.bio}` : "",
  ];
  return parts.filter(Boolean).join(" ");
}

export function buildMentorText(profile: MentorProfile): string {
  const parts = [
    "Experienced mentor available for mentorship.",
    profile.areasOfExpertise.length > 0 ? `Areas of expertise: ${profile.areasOfExpertise.join(", ")}.` : "",
    profile.skills.length > 0 ? `Technical skills: ${profile.skills.join(", ")}.` : "",
    profile.expertise ? `Background: ${profile.expertise}.` : "",
    profile.currentRole ? `Current role: ${profile.currentRole}.` : "",
    profile.company ? `At company: ${profile.company}.` : "",
    `Years of experience: ${profile.yearsExperience}.`,
    profile.bio ? `Bio: ${profile.bio}` : "",
  ];
  return parts.filter(Boolean).join(" ");
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = gemini.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateAndSaveEmbedding(
  userId: string,
  role: "STUDENT" | "MENTOR"
): Promise<void> {
  if (!process.env.GEMINI_API_KEY) return;

  if (role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return;

    const text = buildStudentText(profile);
    if (!text.trim()) return;

    const embedding = await generateEmbedding(text);
    const vectorLiteral = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      UPDATE student_profiles
      SET embedding = ${vectorLiteral}::vector,
          "embeddingUpdatedAt" = NOW()
      WHERE "userId" = ${userId}
    `;
  } else {
    const profile = await prisma.mentorProfile.findUnique({ where: { userId } });
    if (!profile) return;

    const text = buildMentorText(profile);
    if (!text.trim()) return;

    const embedding = await generateEmbedding(text);
    const vectorLiteral = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      UPDATE mentor_profiles
      SET embedding = ${vectorLiteral}::vector,
          "embeddingUpdatedAt" = NOW()
      WHERE "userId" = ${userId}
    `;
  }
}
