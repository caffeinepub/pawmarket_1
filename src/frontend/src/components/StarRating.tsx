import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, max = 5, size = "sm" }: StarRatingProps) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <Star
          key={`star-${star}`}
          className={`${sz} ${star <= rating ? "fill-star text-star" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}
