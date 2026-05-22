import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  Star,
  BookOpen,
  Target,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  if (id === session.user.id) redirect("/app/profile");

  const user = await prisma.user.findUnique({
    where: { id },
    include: { studentProfile: true, mentorProfile: true },
  });

  if (!user) notFound();

  const isMentor = user.role === "MENTOR";
  const profile = isMentor ? user.mentorProfile : user.studentProfile;

  // Fetch reviews for mentor profiles
  const reviews = isMentor
    ? await prisma.feedback.findMany({
        where: { mentorship: { mentorId: id } },
        include: {
          mentorship: {
            select: {
              topic: true,
              student: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Check if they share an active/pending mentorship (for chat link)
  const sharedMentorship = await prisma.mentorship.findFirst({
    where: {
      OR: [
        { studentId: session.user.id, mentorId: id },
        { studentId: id, mentorId: session.user.id },
      ],
      status: { in: ["ACTIVE", "PENDING"] },
    },
    select: { id: true, status: true },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back + actions header */}
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-1">
          <Link href={session.user.role === "STUDENT" ? "/app/mentors" : "/app/requests"}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Link>
        </Button>
        {sharedMentorship?.status === "ACTIVE" && (
          <Button asChild size="sm">
            <Link href={`/app/chat/${sharedMentorship.id}`}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Abrir chat
            </Link>
          </Button>
        )}
      </div>

      {/* Identity card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <Badge variant={isMentor ? "default" : "secondary"}>
                  {isMentor ? "Mentor" : "Estudante"}
                </Badge>
                {isMentor && user.mentorProfile && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {user.mentorProfile.averageRating.toFixed(1)}
                    <span>({user.mentorProfile.totalReviews} avaliações)</span>
                  </div>
                )}
              </div>
              {isMentor && user.mentorProfile?.currentRole && (
                <p className="text-sm font-medium mt-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  {user.mentorProfile.currentRole}
                  {user.mentorProfile.company && ` @ ${user.mentorProfile.company}`}
                </p>
              )}
              {!isMentor && user.studentProfile?.currentRole && (
                <p className="text-sm font-medium mt-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  {user.studentProfile.currentRole}
                  {user.studentProfile.desiredRole && (
                    <>
                      <span className="text-muted-foreground mx-1">→</span>
                      {user.studentProfile.desiredRole}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>

          {profile?.bio && (
            <>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Mentor: experience */}
      {isMentor && user.mentorProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Experiência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.mentorProfile.expertise && (
              <p className="text-sm leading-relaxed">{user.mentorProfile.expertise}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {user.mentorProfile.yearsExperience}
              </span>
              anos de experiência
            </div>
            {user.mentorProfile.skills.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Habilidades
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.mentorProfile.skills.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {user.mentorProfile.areasOfExpertise.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Áreas de expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.mentorProfile.areasOfExpertise.map((a) => (
                    <Badge key={a} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mentor: reviews */}
      {isMentor && reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4" />
              Avaliações
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({reviews.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review, i) => (
              <div key={review.id}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${n < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.mentorship.student.name}
                      {review.mentorship.topic && (
                        <> &middot; {review.mentorship.topic}</>
                      )}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Student: goals & interests */}
      {!isMentor && user.studentProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Objetivos & Interesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.studentProfile.goals && (
              <p className="text-sm leading-relaxed">{user.studentProfile.goals}</p>
            )}
            {user.studentProfile.skills.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Habilidades
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.studentProfile.skills.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {user.studentProfile.areasOfInterest.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Interesses
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.studentProfile.areasOfInterest.map((a) => (
                    <Badge key={a} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Links */}
      {(profile?.linkedinUrl || profile?.githubUrl) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Links</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3 flex-wrap">
            {profile.linkedinUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                  <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                </a>
              </Button>
            )}
            {profile.githubUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                  <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
