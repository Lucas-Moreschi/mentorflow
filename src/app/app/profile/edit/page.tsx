import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudentProfileForm } from "@/components/profile/StudentProfileForm";
import { MentorProfileForm } from "@/components/profile/MentorProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, mentorProfile: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar perfil</h1>
        <p className="text-muted-foreground mt-1">
          Mantenha seu perfil atualizado para encontrar melhores matches
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {user.role === "STUDENT" ? "Perfil de estudante" : "Perfil de mentor"}
          </CardTitle>
          <CardDescription>
            {user.role === "STUDENT"
              ? "Seus objetivos e interesses serão usados pelo algoritmo de matching"
              : "Suas especialidades serão analisadas pela IA para encontrar os melhores estudantes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.role === "STUDENT" ? (
            <StudentProfileForm profile={user.studentProfile} />
          ) : (
            <MentorProfileForm profile={user.mentorProfile} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
