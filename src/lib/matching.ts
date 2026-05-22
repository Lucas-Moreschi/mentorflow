import { prisma } from "./prisma";
import { gemini } from "./gemini";
import type { MentorMatch } from "@/types/mentorship";

interface RawMentorResult {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  similarity: number;
  bio: string | null;
  expertise: string;
  skills: string[];
  areas_of_expertise: string[];
  years_experience: number;
  current_role: string | null;
  company: string | null;
  max_students: number;
  linkedin_url: string | null;
  github_url: string | null;
  average_rating: number;
  total_reviews: number;
}

export async function rankMentors(studentId: string): Promise<MentorMatch[]> {
  const studentResult = await prisma.$queryRaw<{ embedding: string }[]>`
    SELECT embedding::text FROM student_profiles WHERE "userId" = ${studentId}
  `;

  if (!studentResult[0]?.embedding) return [];

  const embedding = studentResult[0].embedding;

  const mentors = await prisma.$queryRaw<RawMentorResult[]>`
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      u."avatarUrl" AS avatar_url,
      1 - (mp.embedding <=> ${embedding}::vector) AS similarity,
      mp.bio,
      mp.expertise,
      mp.skills,
      mp."areasOfExpertise" AS areas_of_expertise,
      mp."yearsExperience" AS years_experience,
      mp."currentRole" AS current_role,
      mp.company,
      mp."maxStudents" AS max_students,
      mp."linkedinUrl" AS linkedin_url,
      mp."githubUrl" AS github_url,
      mp."averageRating" AS average_rating,
      mp."totalReviews" AS total_reviews
    FROM mentor_profiles mp
    JOIN users u ON u.id = mp."userId"
    WHERE mp.embedding IS NOT NULL
      AND u.id NOT IN (
        SELECT "mentorId" FROM mentorships
        WHERE "studentId" = ${studentId}
          AND status IN ('PENDING', 'ACTIVE')
      )
    ORDER BY mp.embedding <=> ${embedding}::vector
    LIMIT 20
  `;

  const ranked = mentors
    .map((m) => ({
      mentor: {
        id: m.user_id,
        name: m.name,
        email: m.email,
        role: "MENTOR" as const,
        avatarUrl: m.avatar_url,
        mentorProfile: {
          id: "",
          userId: m.user_id,
          bio: m.bio,
          expertise: m.expertise,
          skills: m.skills,
          areasOfExpertise: m.areas_of_expertise,
          yearsExperience: m.years_experience,
          currentRole: m.current_role,
          company: m.company,
          maxStudents: m.max_students,
          linkedinUrl: m.linkedin_url,
          githubUrl: m.github_url,
          averageRating: m.average_rating,
          totalReviews: m.total_reviews,
        },
      },
      matchScore: Math.min(100, Math.max(0, Math.round(Number(m.similarity) * 100))),
      explanation: "",
    }))
    .filter((m) => m.matchScore >= 25);

  if (process.env.GEMINI_API_KEY) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
    });

    if (studentProfile) {
      const topMatches = ranked.slice(0, 5);

      // Load all cached explanations in one query
      const cached = await prisma.matchExplanationCache.findMany({
        where: {
          studentId,
          mentorId: { in: topMatches.map((m) => m.mentor.id) },
        },
      });
      const cacheMap = new Map(cached.map((c) => [c.mentorId, c.explanation]));

      // Only call API for mentors not yet cached
      for (const match of topMatches) {
        const hit = cacheMap.get(match.mentor.id);
        if (hit) {
          match.explanation = hit;
          continue;
        }
        try {
          const explanation = await generateMatchExplanation(
            studentProfile,
            match.mentor.mentorProfile!,
            match.matchScore
          );
          match.explanation = explanation;
          await prisma.matchExplanationCache.upsert({
            where: { studentId_mentorId: { studentId, mentorId: match.mentor.id } },
            create: { studentId, mentorId: match.mentor.id, explanation },
            update: { explanation, createdAt: new Date() },
          });
        } catch (err) {
          console.error("generateMatchExplanation failed for", match.mentor.id, err);
        }
      }
    }
  }

  return ranked;
}

async function generateMatchExplanation(
  student: { goals: string; skills: string[]; areasOfInterest: string[]; desiredRole: string | null },
  mentor: { expertise: string; skills: string[]; areasOfExpertise: string[]; currentRole: string | null; company: string | null },
  matchScore: number
): Promise<string> {
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = `Analyze this student-mentor compatibility and explain in 2-3 concise sentences why they are a good match. Be specific and concrete, referencing their actual skills and goals. Write in Portuguese (Brazil).

Student: goals="${student.goals}", skills=[${student.skills.join(", ")}], interests=[${student.areasOfInterest.join(", ")}], wants to become="${student.desiredRole ?? "not specified"}"

Mentor: expertise="${mentor.expertise}", skills=[${mentor.skills.join(", ")}], areas=[${mentor.areasOfExpertise.join(", ")}], role="${mentor.currentRole ?? "not specified"}" at "${mentor.company ?? "unknown company"}"

Compatibility score: ${matchScore}%

Write a brief, encouraging explanation for the student.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
