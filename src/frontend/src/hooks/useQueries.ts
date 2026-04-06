import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, Pet, ProviderProfile } from "../backend";
import { UserRole } from "../backend";
import { useActor } from "./useActor";

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllProviders() {
  const { actor, isFetching } = useActor();
  return useQuery<ProviderProfile[]>({
    queryKey: ["allProviders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllProviders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProvidersByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ProviderProfile[]>({
    queryKey: ["providersByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProvidersByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useProviderProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ProviderProfile | null>({
    queryKey: ["providerProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getProviderProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useCallerProviderProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<ProviderProfile | null>({
    queryKey: ["callerProviderProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerProviderProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyPets() {
  const { actor, isFetching } = useActor();
  return useQuery<Pet[]>({
    queryKey: ["myPets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCallerPets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyBookingsAsParent() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["myBookingsAsParent"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyBookingsAsPetParent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyBookingsAsProvider() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["myBookingsAsProvider"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyBookingsAsProvider();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      breed: string;
      age: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addPet(data.name, data.breed, data.age, data.notes);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myPets"] }),
  });
}

export function useUpdatePet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      breed: string;
      age: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePet(
        data.id,
        data.name,
        data.breed,
        data.age,
        data.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myPets"] }),
  });
}

export function useDeletePet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePet(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myPets"] }),
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      providerId: Principal;
      petId: bigint;
      requestedDate: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        data.providerId,
        data.petId,
        data.requestedDate,
        data.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myBookingsAsParent"] }),
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { bookingId: bigint; newStatus: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(data.bookingId, data.newStatus);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBookingsAsProvider"] });
      qc.invalidateQueries({ queryKey: ["myBookingsAsParent"] });
    },
  });
}

export function useCreateProviderProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      displayName: string;
      bio: string;
      category: string;
      pricePerHour: bigint;
      city: string;
      availability: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProviderProfile(
        data.displayName,
        data.bio,
        data.category,
        data.pricePerHour,
        data.city,
        data.availability,
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["callerProviderProfile"] }),
  });
}

export function useUpdateProviderProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      displayName: string;
      bio: string;
      category: string;
      pricePerHour: bigint;
      city: string;
      availability: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProviderProfile(
        data.displayName,
        data.bio,
        data.category,
        data.pricePerHour,
        data.city,
        data.availability,
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["callerProviderProfile"] }),
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(data.user, data.role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerRole"] }),
  });
}

export function useToggleProviderActive() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleProviderActive(principal);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allProviders"] }),
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      bookingId: bigint;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitReview(data.bookingId, data.rating, data.comment);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myBookingsAsParent"] }),
  });
}
