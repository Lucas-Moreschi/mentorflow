import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { ExternalLink, Github, Linkedin, Pencil, Star, BookOpen } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, mentorProfile: true },
  });

  if (!user) redirect("/login");

  const profile = user.studentProfile ?? user.mentorProfile;
  const isMentor = user.role === "MENTOR";

  const reviews = isMentor
    ? await prisma.feedback.findMany({
        where: { mentorship: { mentorId: session.user.id } },
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/app/profile/edit">
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

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
                    <span>({user.mentorProfile.totalReviews})</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
              {isMentor && user.mentorProfile?.currentRole && (
                <p className="text-sm font-medium mt-1">
                  {user.mentorProfile.currentRole}
                  {user.mentorProfile.company && ` @ ${user.mentorProfile.company}`}
                </p>
              )}
              {!isMentor && user.studentProfile?.currentRole && (
                <p className="text-sm font-medium mt-1">
                  {user.studentProfile.currentRole}
                  {user.studentProfile.desiredRole && ` → ${user.studentProfile.desiredRole}`}
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

      {isMentor && user.mentorProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Experiência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.mentorProfile.expertise && (
              <p className="text-sm leading-relaxed">{user.mentorProfile.expertise}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{user.mentorProfile.yearsExperience}</span>
              anos de experiência
            </div>
            {user.mentorProfile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.mentorProfile.skills.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            )}
            {user.mentorProfile.areasOfExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.mentorProfile.areasOfExpertise.map((a) => (
                  <Badge key={a} variant="secondary">{a}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isMentor && user.studentProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Objetivos & Interesses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.studentProfile.goals && (
              <p className="text-sm leading-relaxed">{user.studentProfile.goals}</p>
            )}
            {user.studentProfile.skills.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Habilidades</p>
                <div className="flex flex-wrap gap-2">
                  {user.studentProfile.skills.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {user.studentProfile.areasOfInterest.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Interesses</p>
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

      {isMentor && reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Minhas avaliações
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
                    <div className="flex items-center gap-1">
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

      {(profile?.linkedinUrl || profile?.githubUrl) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Links</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
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
