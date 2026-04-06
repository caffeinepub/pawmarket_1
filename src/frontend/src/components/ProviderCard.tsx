import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { ProviderProfile } from "../backend";
import { CATEGORY_DISPLAY_NAMES } from "../lib/categories";
import { StarRating } from "./StarRating";

interface ProviderCardProps {
  provider: ProviderProfile;
  index?: number;
}

export function ProviderCard({ provider, index = 1 }: ProviderCardProps) {
  const principalStr = provider.owner.toString();
  const initials = provider.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.displayName)}&background=1F6F6A&color=fff&size=80`;

  return (
    <div
      className="bg-card border border-border rounded-xl shadow-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
      data-ocid={`provider.item.${index}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-14 h-14 shrink-0">
          <AvatarImage src={avatarUrl} alt={provider.displayName} />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {provider.displayName}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <StarRating rating={Number(provider.rating)} />
            <span className="text-xs text-muted-foreground">
              ({Number(provider.reviewCount)})
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{provider.city}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {provider.bio}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          className="text-xs bg-accent text-accent-foreground border-accent/30"
        >
          {CATEGORY_DISPLAY_NAMES[provider.category] ?? provider.category}
        </Badge>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          {provider.availability}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="font-bold text-foreground">
          ${Number(provider.pricePerHour)}
          <span className="text-xs font-normal text-muted-foreground">/hr</span>
        </span>
        <Link
          to="/provider/$principalId"
          params={{ principalId: principalStr }}
        >
          <Button
            size="sm"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full"
            data-ocid={`provider.primary_button.${index}`}
          >
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
