import { StarRating } from "@/components/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useCreateBooking,
  useMyPets,
  useProviderProfile,
} from "@/hooks/useQueries";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/categories";
import { Principal } from "@icp-sdk/core/principal";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Clock, DollarSign, Loader2, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ProviderProfilePage() {
  const { principalId } = useParams({ from: "/provider/$principalId" });
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  let principal: Principal | null = null;
  try {
    principal = Principal.fromText(principalId);
  } catch {
    // invalid principal
  }

  const { data: provider, isLoading } = useProviderProfile(principal);
  const { data: pets } = useMyPets();
  const createBooking = useCreateBooking();

  const [petId, setPetId] = useState<string>("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Skeleton className="h-48 rounded-2xl mb-6" />
        <Skeleton className="h-6 w-1/2 mb-3" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div
        className="max-w-3xl mx-auto px-4 py-20 text-center"
        data-ocid="provider.error_state"
      >
        <p className="text-xl font-semibold text-muted-foreground">
          Provider not found.
        </p>
      </div>
    );
  }

  const initials = provider.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.displayName)}&background=1F6F6A&color=fff&size=120`;

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!identity) {
      toast.error("Please log in to book a service.");
      void navigate({ to: "/login" });
      return;
    }
    if (!petId) {
      toast.error("Please select a pet.");
      return;
    }
    try {
      await createBooking.mutateAsync({
        providerId: provider!.owner,
        petId: BigInt(petId),
        requestedDate: date,
        notes,
      });
      toast.success("Booking request sent!");
      setPetId("");
      setDate("");
      setNotes("");
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  }

  return (
    <main
      className="max-w-4xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="provider.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl shadow-card p-6 sm:p-8 mb-8"
      >
        <div className="flex items-start gap-6 flex-wrap">
          <Avatar className="w-24 h-24 shrink-0">
            <AvatarImage src={avatarUrl} alt={provider.displayName} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {provider.displayName}
                </h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <StarRating rating={Number(provider.rating)} size="md" />
                  <span className="text-sm text-muted-foreground">
                    ({Number(provider.reviewCount)} reviews)
                  </span>
                </div>
              </div>
              <Badge
                className={
                  provider.isActive
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }
              >
                {provider.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {provider.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {provider.availability}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />$
                {Number(provider.pricePerHour)}/hr
              </span>
            </div>

            <div className="mt-3">
              <Badge
                variant="outline"
                className="bg-accent text-accent-foreground border-accent/30"
              >
                {CATEGORY_DISPLAY_NAMES[provider.category] ?? provider.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-foreground mb-2">About</h2>
          <p className="text-muted-foreground leading-relaxed">
            {provider.bio}
          </p>
        </div>
      </motion.div>

      {/* Booking Form */}
      {provider.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl shadow-card p-6 sm:p-8"
          data-ocid="provider.panel"
        >
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Star className="w-5 h-5 text-star" /> Book this Service
          </h2>
          <form onSubmit={handleBook} className="flex flex-col gap-4">
            {pets && pets.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <Label>Select Pet</Label>
                <Select value={petId} onValueChange={setPetId}>
                  <SelectTrigger data-ocid="provider.select">
                    <SelectValue placeholder="Choose your pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem
                        key={pet.id.toString()}
                        value={pet.id.toString()}
                      >
                        {pet.name} ({pet.breed})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                {identity
                  ? "Add a pet to your profile first to make a booking."
                  : "Log in and add a pet to your profile to make a booking."}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="booking-date">Requested Date</Label>
              <Input
                id="booking-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                data-ocid="provider.input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="booking-notes">Notes (optional)</Label>
              <Textarea
                id="booking-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes..."
                rows={3}
                data-ocid="provider.textarea"
              />
            </div>

            <Button
              type="submit"
              disabled={createBooking.isPending || !petId || !date}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full"
              data-ocid="provider.submit_button"
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                "Send Booking Request"
              )}
            </Button>
          </form>
        </motion.div>
      )}
    </main>
  );
}
