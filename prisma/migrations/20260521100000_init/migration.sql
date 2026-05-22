-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "goals" TEXT NOT NULL DEFAULT '',
    "currentRole" TEXT,
    "desiredRole" TEXT,
    "skills" TEXT[],
    "areasOfInterest" TEXT[],
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "embedding" vector(3072),
    "embeddingUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "expertise" TEXT NOT NULL DEFAULT '',
    "skills" TEXT[],
    "areasOfExpertise" TEXT[],
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "currentRole" TEXT,
    "company" TEXT,
    "maxStudents" INTEGER NOT NULL DEFAULT 3,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "embedding" vector(3072),
    "embeddingUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorships" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "topic" TEXT,
    "rejectionReason" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "mentorshipId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "mentorshipId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_profiles_userId_key" ON "mentor_profiles"("userId");

-- CreateIndex
CREATE INDEX "messages_mentorshipId_createdAt_idx" ON "messages"("mentorshipId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_mentorshipId_key" ON "feedbacks"("mentorshipId");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_profiles" ADD CONSTRAINT "mentor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_mentorshipId_fkey" FOREIGN KEY ("mentorshipId") REFERENCES "mentorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_mentorshipId_fkey" FOREIGN KEY ("mentorshipId") REFERENCES "mentorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
