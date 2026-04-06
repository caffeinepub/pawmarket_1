import type { Pet } from "@/backend";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddPet,
  useDeletePet,
  useMyBookingsAsParent,
  useMyPets,
  useSubmitReview,
  useUpdatePet,
} from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, PawPrint, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ParentDashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: pets, isLoading: petsLoading } = useMyPets();
  const { data: bookings, isLoading: bookingsLoading } =
    useMyBookingsAsParent();

  const addPet = useAddPet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();
  const submitReview = useSubmitReview();

  const [addOpen, setAddOpen] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petNotes, setPetNotes] = useState("");

  // Review state
  const [reviewBookingId, setReviewBookingId] = useState<bigint | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <PawPrint className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-xl font-semibold text-muted-foreground mb-4">
          Please log in to view your dashboard.
        </p>
        <Button
          onClick={() => void navigate({ to: "/login" })}
          className="bg-primary text-primary-foreground"
          data-ocid="parent.primary_button"
        >
          Login
        </Button>
      </div>
    );
  }

  function openAdd() {
    setPetName("");
    setPetBreed("");
    setPetAge("");
    setPetNotes("");
    setAddOpen(true);
  }

  function openEdit(pet: Pet) {
    setEditPet(pet);
    setPetName(pet.name);
    setPetBreed(pet.breed);
    setPetAge(pet.age.toString());
    setPetNotes(pet.notes);
  }

  async function handleAddPet(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addPet.mutateAsync({
        name: petName,
        breed: petBreed,
        age: BigInt(petAge),
        notes: petNotes,
      });
      toast.success("Pet added!");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add pet.");
    }
  }

  async function handleUpdatePet(e: React.FormEvent) {
    e.preventDefault();
    if (!editPet) return;
    try {
      await updatePet.mutateAsync({
        id: editPet.id,
        name: petName,
        breed: petBreed,
        age: BigInt(petAge),
        notes: petNotes,
      });
      toast.success("Pet updated!");
      setEditPet(null);
    } catch {
      toast.error("Failed to update pet.");
    }
  }

  async function handleDeletePet(id: bigint) {
    try {
      await deletePet.mutateAsync(id);
      toast.success("Pet removed.");
    } catch {
      toast.error("Failed to delete pet.");
    }
  }

  async function handleSubmitReview(bookingId: bigint) {
    try {
      await submitReview.mutateAsync({
        bookingId,
        rating: BigInt(reviewRating),
        comment: reviewComment,
      });
      toast.success("Review submitted!");
      setReviewBookingId(null);
      setReviewComment("");
    } catch {
      toast.error("Failed to submit review.");
    }
  }

  return (
    <main
      className="max-w-5xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="parent.page"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your pets and track your bookings.
        </p>
      </div>

      <Tabs defaultValue="pets">
        <TabsList className="mb-6" data-ocid="parent.tab">
          <TabsTrigger value="pets">My Pets</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        {/* Pets Tab */}
        <TabsContent value="pets">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Pets</h2>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={openAdd}
                  size="sm"
                  className="bg-primary text-primary-foreground"
                  data-ocid="parent.open_modal_button"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Pet
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="parent.dialog">
                <DialogHeader>
                  <DialogTitle>Add a Pet</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPet} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label>Name</Label>
                      <Input
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="Buddy"
                        required
                        data-ocid="parent.input"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Breed</Label>
                      <Input
                        value={petBreed}
                        onChange={(e) => setPetBreed(e.target.value)}
                        placeholder="Golden Retriever"
                        required
                        data-ocid="parent.input"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Age (years)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      placeholder="3"
                      required
                      data-ocid="parent.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Notes</Label>
                    <Textarea
                      value={petNotes}
                      onChange={(e) => setPetNotes(e.target.value)}
                      placeholder="Any special notes..."
                      rows={2}
                      data-ocid="parent.textarea"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddOpen(false)}
                      className="flex-1"
                      data-ocid="parent.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addPet.isPending}
                      className="flex-1 bg-primary text-primary-foreground"
                      data-ocid="parent.submit_button"
                    >
                      {addPet.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Add Pet"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {petsLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              data-ocid="parent.loading_state"
            >
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : pets && pets.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="parent.list"
            >
              {pets.map((pet, i) => (
                <motion.div
                  key={pet.id.toString()}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-card"
                  data-ocid={`parent.item.${i + 1}`}
                >
                  {editPet?.id === pet.id ? (
                    <form
                      onSubmit={handleUpdatePet}
                      className="flex flex-col gap-3"
                    >
                      <Input
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="Name"
                        required
                        data-ocid="parent.input"
                      />
                      <Input
                        value={petBreed}
                        onChange={(e) => setPetBreed(e.target.value)}
                        placeholder="Breed"
                        required
                        data-ocid="parent.input"
                      />
                      <Input
                        type="number"
                        value={petAge}
                        onChange={(e) => setPetAge(e.target.value)}
                        placeholder="Age"
                        required
                        data-ocid="parent.input"
                      />
                      <Textarea
                        value={petNotes}
                        onChange={(e) => setPetNotes(e.target.value)}
                        placeholder="Notes"
                        rows={2}
                        data-ocid="parent.textarea"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditPet(null)}
                          data-ocid="parent.cancel_button"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={updatePet.isPending}
                          className="bg-primary text-primary-foreground"
                          data-ocid="parent.save_button"
                        >
                          {updatePet.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            {pet.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pet.breed} · {pet.age.toString()} yrs
                          </p>
                          {pet.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {pet.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(pet)}
                            className="h-7 w-7"
                            data-ocid={`parent.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePet(pet.id)}
                            disabled={deletePet.isPending}
                            className="h-7 w-7 text-destructive"
                            data-ocid={`parent.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="parent.empty_state"
            >
              <PawPrint className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No pets yet. Add your first pet!</p>
            </div>
          )}
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Your Bookings
          </h2>
          {bookingsLoading ? (
            <div data-ocid="parent.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl mb-3" />
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="flex flex-col gap-3" data-ocid="parent.list">
              {bookings.map((b, i) => (
                <div
                  key={b.id.toString()}
                  className="bg-card border border-border rounded-xl p-4 shadow-xs"
                  data-ocid={`parent.item.${i + 1}`}
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
                          {b.notes}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  {b.status === "completed" && (
                    <div className="mt-3 border-t border-border pt-3">
                      {reviewBookingId === b.id ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none"
                              >
                                <span
                                  className={
                                    star <= reviewRating
                                      ? "text-star"
                                      : "text-muted-foreground/40"
                                  }
                                >
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                          <Textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Your review..."
                            rows={2}
                            data-ocid="parent.textarea"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReviewBookingId(null)}
                              data-ocid="parent.cancel_button"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReview(b.id)}
                              disabled={submitReview.isPending}
                              className="bg-primary text-primary-foreground"
                              data-ocid="parent.submit_button"
                            >
                              Submit Review
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewBookingId(b.id)}
                          data-ocid={`parent.secondary_button.${i + 1}`}
                        >
                          Leave a Review
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="parent.empty_state"
            >
              <p>No bookings yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
