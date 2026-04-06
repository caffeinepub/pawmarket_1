import { StatusBadge } from "@/components/StatusBadge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useCallerProviderProfile,
  useCreateProviderProfile,
  useMyBookingsAsProvider,
  useUpdateBookingStatus,
  useUpdateProviderProfile,
} from "@/hooks/useQueries";
import { CATEGORIES } from "@/lib/categories";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, CheckCircle, Loader2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProviderDashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } =
    useCallerProviderProfile();
  const { data: bookings, isLoading: bookingsLoading } =
    useMyBookingsAsProvider();
  const createProfile = useCreateProviderProfile();
  const updateProfile = useUpdateProviderProfile();
  const updateStatus = useUpdateBookingStatus();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio);
      setCategory(profile.category);
      setPrice(profile.pricePerHour.toString());
      setCity(profile.city);
      setAvailability(profile.availability);
    }
  }, [profile]);

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-xl font-semibold text-muted-foreground mb-4">
          Please log in to manage your provider profile.
        </p>
        <Button
          onClick={() => void navigate({ to: "/login" })}
          className="bg-primary text-primary-foreground"
          data-ocid="provider_dash.primary_button"
        >
          Login
        </Button>
      </div>
    );
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      displayName,
      bio,
      category,
      pricePerHour: BigInt(Math.round(Number(price))),
      city,
      availability,
    };
    try {
      if (profile) {
        await updateProfile.mutateAsync(data);
        toast.success("Profile updated!");
      } else {
        await createProfile.mutateAsync(data);
        toast.success("Provider profile created!");
      }
      setEditing(false);
    } catch {
      toast.error("Failed to save profile.");
    }
  }

  async function handleBookingStatus(bookingId: bigint, status: string) {
    try {
      await updateStatus.mutateAsync({ bookingId, newStatus: status });
      toast.success(`Booking ${status}.`);
    } catch {
      toast.error("Failed to update booking.");
    }
  }

  const isSaving = createProfile.isPending || updateProfile.isPending;

  return (
    <main
      className="max-w-5xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="provider_dash.page"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Provider Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your service listing and incoming bookings.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6" data-ocid="provider_dash.tab">
          <TabsTrigger value="profile">My Listing</TabsTrigger>
          <TabsTrigger value="bookings">Incoming Bookings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          {profileLoading ? (
            <Skeleton
              className="h-64 rounded-2xl"
              data-ocid="provider_dash.loading_state"
            />
          ) : !profile || editing ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl shadow-card p-6"
              data-ocid="provider_dash.panel"
            >
              <h2 className="text-lg font-semibold text-foreground mb-5">
                {profile ? "Edit Your Listing" : "Create Your Listing"}
              </h2>
              <form
                onSubmit={handleSaveProfile}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>Display Name</Label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Business name"
                      required
                      data-ocid="provider_dash.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>City</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Your city"
                      required
                      data-ocid="provider_dash.input"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Bio</Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your services..."
                    rows={3}
                    required
                    data-ocid="provider_dash.textarea"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger data-ocid="provider_dash.select">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Price/hr ($)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="25"
                      required
                      data-ocid="provider_dash.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Availability</Label>
                    <Input
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="Mon-Fri 9-5"
                      required
                      data-ocid="provider_dash.input"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  {editing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing(false)}
                      data-ocid="provider_dash.cancel_button"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSaving || !category}
                    className="bg-primary text-primary-foreground"
                    data-ocid="provider_dash.submit_button"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                        Saving...
                      </>
                    ) : profile ? (
                      "Save Changes"
                    ) : (
                      "Create Listing"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl shadow-card p-6"
              data-ocid="provider_dash.card"
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {profile.displayName}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.city} · {profile.availability} · $
                    {Number(profile.pricePerHour)}/hr
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {profile.bio}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                  data-ocid="provider_dash.edit_button"
                >
                  Edit Listing
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    profile.isActive
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {profile.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  ★ {Number(profile.rating)} ({Number(profile.reviewCount)}{" "}
                  reviews)
                </span>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Incoming Requests
          </h2>
          {bookingsLoading ? (
            <div data-ocid="provider_dash.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl mb-3" />
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="flex flex-col gap-3" data-ocid="provider_dash.list">
              {bookings.map((b, i) => (
                <div
                  key={b.id.toString()}
                  className="bg-card border border-border rounded-xl p-4 shadow-xs"
                  data-ocid={`provider_dash.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Booking #{b.id.toString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Date: {b.requestedDate} · Pet #{b.petId.toString()}
                      </p>
                      {b.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Note: {b.notes}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  {b.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleBookingStatus(b.id, "accepted")}
                        disabled={updateStatus.isPending}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-1"
                        data-ocid={`provider_dash.confirm_button.${i + 1}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookingStatus(b.id, "declined")}
                        disabled={updateStatus.isPending}
                        className="text-destructive border-destructive/30 gap-1"
                        data-ocid={`provider_dash.delete_button.${i + 1}`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookingStatus(b.id, "completed")}
                        disabled={updateStatus.isPending}
                        data-ocid={`provider_dash.secondary_button.${i + 1}`}
                      >
                        Mark Completed
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="provider_dash.empty_state"
            >
              <p>No incoming bookings yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
