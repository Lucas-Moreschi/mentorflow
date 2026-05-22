import { Badge } from "@/components/ui/badge";
import type { MentorshipStatus } from "@/types/mentorship";

const statusConfig: Record<MentorshipStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }> = {
  PENDING: { label: "Aguardando", variant: "warning" },
  ACTIVE: { label: "Ativa", variant: "success" },
  COMPLETED: { label: "Concluída", variant: "secondary" },
  REJECTED: { label: "Recusada", variant: "destructive" },
  CANCELLED: { label: "Cancelada", variant: "outline" },
};

interface MentorshipStatusBadgeProps {
  status: MentorshipStatus;
}

export function MentorshipStatusBadge({ status }: MentorshipStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant as any}>{config.label}</Badge>;
}
