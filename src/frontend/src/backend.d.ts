import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    status: string;
    createdAt: bigint;
    notes: string;
    requestedDate: string;
    petId: bigint;
    petParent: Principal;
    providerId: Principal;
}
export interface Pet {
    id: bigint;
    age: bigint;
    owner: Principal;
    name: string;
    notes: string;
    breed: string;
}
export interface ProviderProfile {
    bio: string;
    displayName: string;
    owner: Principal;
    city: string;
    pricePerHour: bigint;
    isActive: boolean;
    availability: string;
    category: string;
    rating: bigint;
    reviewCount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPet(name: string, breed: string, age: bigint, notes: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(providerId: Principal, petId: bigint, requestedDate: string, notes: string): Promise<void>;
    createProviderProfile(displayName: string, bio: string, category: string, pricePerHour: bigint, city: string, availability: string): Promise<void>;
    deletePet(id: bigint): Promise<void>;
    getCallerProviderProfile(): Promise<ProviderProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProviderProfile(principal: Principal): Promise<ProviderProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllProviders(): Promise<Array<ProviderProfile>>;
    listCallerPets(): Promise<Array<Pet>>;
    listMyBookingsAsPetParent(): Promise<Array<Booking>>;
    listMyBookingsAsProvider(): Promise<Array<Booking>>;
    listProvidersByCategory(category: string): Promise<Array<ProviderProfile>>;
    submitReview(bookingId: bigint, rating: bigint, comment: string): Promise<void>;
    toggleProviderActive(principal: Principal): Promise<void>;
    updateBookingStatus(bookingId: bigint, newStatus: string): Promise<void>;
    updatePet(id: bigint, name: string, breed: string, age: bigint, notes: string): Promise<void>;
    updateProviderProfile(displayName: string, bio: string, category: string, pricePerHour: bigint, city: string, availability: string): Promise<void>;
}
