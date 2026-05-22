"use client";

import { Star, Briefcase, BookOpen, MessageSquare, User } from "lucide-react";
import type { MentorWithProfile } from "@/types/mentorship";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { MatchBadge } from "./MatchBadge";
import { RequestModal } from "./RequestModal";
import Link from "next/link";
import { useState } from "react";

interface MentorCardProps {
  mentor: MentorWithProfile;
  matchScore?: number;
  explanation?: string;
}

export function MentorCard({ mentor, matchScore, explanation }: MentorCardProps) {
  const [requestOpen, setRequestOpen] = useState(false);
  const profile = mentor.mentorProfile;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow flex flex-col">
        <CardContent className="pt-6 space-y-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {getInitials(mentor.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{mentor.name}</p>
                {profile?.currentRole && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {profile.currentRole}
                    {profile.company && ` @ ${profile.company}`}
                  </p>
                )}
                {profile && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">
                      {profile.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({profile.totalReviews})
                    </span>
                  </div>
                )}
              </div>
            </div>
            {matchScore !== undefined && (
              <MatchBadge score={matchScore} explanation={explanation} />
            )}
          </div>

          {profile?.areasOfExpertise && profile.areasOfExpertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.areasOfExpertise.slice(0, 4).map((area) => (
                <Badge key={area} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {profile.areasOfExpertise.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.areasOfExpertise.length - 4}
                </Badge>
              )}
            </div>
          )}

          {profile?.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {profile?.yearsExperience !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              {profile.yearsExperience} anos de experiência
            </div>
          )}

          <div className="flex gap-2 mt-auto pt-2">
            <Button
              className="flex-1"
              size="sm"
              onClick={() => setRequestOpen(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Solicitar mentoria
            </Button>
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link href={`/app/profile/${mentor.id}`}>
                <User className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <RequestModal
        mentorId={mentor.id}
        mentorName={mentor.name}
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />
    </>
  );
}
