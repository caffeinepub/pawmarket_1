import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style =
    statusStyles[status.toLowerCase()] ?? "bg-muted text-muted-foreground";
  return (
    <Badge
      variant="outline"
      className={`capitalize text-xs font-medium ${style}`}
    >
      {status}
    </Badge>
  );
}
