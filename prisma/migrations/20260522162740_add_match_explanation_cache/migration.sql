-- CreateTable
CREATE TABLE "match_explanation_cache" (
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_explanation_cache_pkey" PRIMARY KEY ("studentId","mentorId")
);
