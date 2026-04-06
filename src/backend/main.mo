import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProviderProfile = {
    owner : Principal;
    displayName : Text;
    bio : Text;
    category : Text;
    pricePerHour : Nat;
    city : Text;
    availability : Text;
    isActive : Bool;
    rating : Nat;
    reviewCount : Nat;
  };

  module ProviderProfile {
    public func update(profile : ProviderProfile, id : Text, displayName : Text, bio : Text, category : Text, pricePerHour : Nat, city : Text, availability : Text) : ProviderProfile {
      {
        profile with
        displayName;
        bio;
        category;
        pricePerHour;
        city;
        availability;
      };
    };

    public func compareByCategory(profile1 : ProviderProfile, profile2 : ProviderProfile) : Order.Order {
      Text.compare(profile1.category, profile2.category);
    };
  };

  type Pet = {
    id : Nat;
    owner : Principal;
    name : Text;
    breed : Text;
    age : Nat;
    notes : Text;
  };

  module Pet {
    public func update(pet : Pet, name : Text, breed : Text, age : Nat, notes : Text) : Pet {
      { pet with name; breed; age; notes };
    };
  };

  type Booking = {
    id : Nat;
    petParent : Principal;
    providerId : Principal;
    petId : Nat;
    requestedDate : Text;
    notes : Text;
    status : Text; // "pending", "accepted", "declined", "completed"
    createdAt : Int;
  };

  module Booking {
    public func update(booking : Booking, status : Text) : Booking {
      { booking with status };
    };
  };

  type Review = {
    id : Nat;
    bookingId : Nat;
    reviewer : Principal;
    providerId : Principal;
    rating : Nat;
    comment : Text;
  };

  module Review {
    public func new(id : Nat, bookingId : Nat, reviewer : Principal, providerId : Principal, rating : Nat, comment : Text) : Review {
      { id; bookingId; reviewer; providerId; rating; comment };
    };
  };

  // Initialize persistent storage
  let providerProfiles = Map.empty<Principal, ProviderProfile>();
  let pets = Map.empty<Nat, Pet>();
  let bookings = Map.empty<Nat, Booking>();
  let reviews = Map.empty<Nat, Review>();
  let petParentToBookingIds = Map.empty<Principal, [Nat]>();
  let providerToBookingIds = Map.empty<Principal, [Nat]>();
  let providerToReviewIds = Map.empty<Principal, [Nat]>();

  // Persistent counters for IDs
  var nextPetId = 1;
  var nextBookingId = 1;
  var nextReviewId = 1;

  // Internal helper functions
  func getNextPetId() : Nat {
    let id = nextPetId;
    nextPetId += 1;
    id;
  };

  func getNextBookingId() : Nat {
    let id = nextBookingId;
    nextBookingId += 1;
    id;
  };

  func getNextReviewId() : Nat {
    let id = nextReviewId;
    nextReviewId += 1;
    id;
  };

  func addBookingToPetParent(petParent : Principal, bookingId : Nat) {
    let existing = switch (petParentToBookingIds.get(petParent)) {
      case (null) { [] };
      case (?list) { list };
    };
    petParentToBookingIds.add(petParent, existing.concat([bookingId]));
  };

  func addBookingToProvider(provider : Principal, bookingId : Nat) {
    let existing = switch (providerToBookingIds.get(provider)) {
      case (null) { [] };
      case (?list) { list };
    };
    providerToBookingIds.add(provider, existing.concat([bookingId]));
  };

  func addReviewToProvider(provider : Principal, reviewId : Nat) {
    let existing = switch (providerToReviewIds.get(provider)) {
      case (null) { [] };
      case (?list) { list };
    };
    providerToReviewIds.add(provider, existing.concat([reviewId]));
  };

  // PROVIDER PROFILE FUNCTIONS

  public shared ({ caller }) func createProviderProfile(displayName : Text, bio : Text, category : Text, pricePerHour : Nat, city : Text, availability : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to create a provider profile.");
    };
    if (providerProfiles.containsKey(caller)) { Runtime.trap("Provider profile already exists.") };
    let profile = {
      owner = caller;
      displayName;
      bio;
      category;
      pricePerHour;
      city;
      availability;
      isActive = true;
      rating = 0;
      reviewCount = 0;
    };
    providerProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateProviderProfile(displayName : Text, bio : Text, category : Text, pricePerHour : Nat, city : Text, availability : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to update a provider profile.");
    };
    let existing = providerProfiles.get(caller);
    if (existing.isNull()) { Runtime.trap("Provider profile does not exist.") };
    let profile = existing.unwrap();
    if (profile.owner != caller) {
      Runtime.trap("Unauthorized: You can only update your own provider profile.");
    };
    providerProfiles.add(
      caller,
      ProviderProfile.update(profile, caller.toText(), displayName, bio, category, pricePerHour, city, availability),
    );
  };

  public query ({ caller }) func getCallerProviderProfile() : async ?ProviderProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to access provider profiles.");
    };
    providerProfiles.get(caller);
  };

  public query func getProviderProfile(principal : Principal) : async ?ProviderProfile {
    providerProfiles.get(principal);
  };

  public query func listProvidersByCategory(category : Text) : async [ProviderProfile] {
    providerProfiles.values().toArray().filter(func(p) { p.category == category });
  };

  public shared ({ caller }) func toggleProviderActive(principal : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action.");
    };
    let existing = providerProfiles.get(principal);
    if (existing.isNull()) { Runtime.trap("Provider profile does not exist.") };
    let profile = existing.unwrap();
    providerProfiles.add(principal, { profile with isActive = not profile.isActive });
  };

  public query func listAllProviders() : async [ProviderProfile] {
    providerProfiles.values().toArray();
  };

  // PET PROFILE FUNCTIONS

  public shared ({ caller }) func addPet(name : Text, breed : Text, age : Nat, notes : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to add a pet.");
    };
    let petId = getNextPetId();
    let newPet = {
      id = petId;
      owner = caller;
      name;
      breed;
      age;
      notes;
    };
    pets.add(petId, newPet);
    petId;
  };

  public shared ({ caller }) func updatePet(id : Nat, name : Text, breed : Text, age : Nat, notes : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to update a pet.");
    };
    switch (pets.get(id)) {
      case (null) { Runtime.trap("Pet not found.") };
      case (?existing) {
        if (existing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not have permission to update this pet profile.");
        };
        pets.add(id, Pet.update(existing, name, breed, age, notes));
      };
    };
  };

  public shared ({ caller }) func deletePet(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to delete a pet.");
    };
    switch (pets.get(id)) {
      case (null) { Runtime.trap("Pet not found.") };
      case (?existing) {
        if (existing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not have permission to delete this pet profile.");
        };
        pets.remove(id);
      };
    };
  };

  public query ({ caller }) func listCallerPets() : async [Pet] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to access your pets.");
    };
    pets.values().toArray().filter(func(p) { p.owner == caller });
  };

  // BOOKING FUNCTIONS

  public shared ({ caller }) func createBooking(providerId : Principal, petId : Nat, requestedDate : Text, notes : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to create a booking.");
    };
    // Check if provider exists and is active
    switch (providerProfiles.get(providerId)) {
      case (null) { Runtime.trap("Provider profile does not exist.") };
      case (?provider) {
        if (not provider.isActive) { Runtime.trap("Provider is currently unavailable.") };
      };
    };
    // Check that pet exists for this caller
    switch (pets.get(petId)) {
      case (null) { Runtime.trap("Pet not found.") };
      case (?pet) { if (pet.owner != caller) { Runtime.trap("You do not own this pet.") } };
    };
    let bookingId = getNextBookingId();
    let newBooking = {
      id = bookingId;
      petParent = caller;
      providerId;
      petId;
      requestedDate;
      notes;
      status = "pending";
      createdAt = Time.now();
    };
    bookings.add(bookingId, newBooking);
    addBookingToPetParent(caller, bookingId);
    addBookingToProvider(providerId, bookingId);
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, newStatus : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to update a booking.");
    };
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found.") };
      case (?existing) {
        if (existing.providerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not have permission to update this booking.");
        };
        bookings.add(bookingId, Booking.update(existing, newStatus));
      };
    };
  };

  public query ({ caller }) func listMyBookingsAsPetParent() : async [Booking] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to access your bookings.");
    };
    bookings.values().toArray().filter(func(b) { b.petParent == caller });
  };

  public query ({ caller }) func listMyBookingsAsProvider() : async [Booking] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to access your bookings.");
    };
    bookings.values().toArray().filter(func(b) { b.providerId == caller });
  };

  // REVIEW FUNCTIONS

  public shared ({ caller }) func submitReview(bookingId : Nat, rating : Nat, comment : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please register to submit a review.");
    };
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found.") };
      case (?booking) {
        if (booking.petParent != caller) { Runtime.trap("You do not own this booking.") };
        if (booking.status != "completed") { Runtime.trap("Can only review completed bookings.") };

        let reviewId = getNextReviewId();
        reviews.add(reviewId, Review.new(reviewId, bookingId, caller, booking.providerId, rating, comment));
        addReviewToProvider(booking.providerId, reviewId);

        // Recalculate provider rating
        switch (providerProfiles.get(booking.providerId)) {
          case (null) { /* Provider deleted, ignore */ };
          case (?provider) {
            let newReviewCount = provider.reviewCount + 1;
            let totalRating = provider.rating * provider.reviewCount + rating;
            let newAvgRating = totalRating / newReviewCount;
            providerProfiles.add(
              booking.providerId,
              { provider with rating = newAvgRating; reviewCount = newReviewCount },
            );
          };
        };
      };
    };
  };

  // Generate system seed data
  let seedPrincipal1 = Principal.fromText("2vxsx-fae");
  let seedPrincipal2 = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
  let seedPrincipal3 = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
  let seedPrincipal4 = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai");
  let seedPrincipal5 = Principal.fromText("renrk-eyaaa-aaaaa-aaada-cai");

  // Seed providers
  providerProfiles.add(
    seedPrincipal1,
    {
      owner = seedPrincipal1;
      displayName = "Happy Tails Pet Sitting";
      bio = "Experienced pet sitter with 5 years of experience.";
      category = "Pet Sitting";
      pricePerHour = 50;
      city = "New York";
      availability = "Weekdays & Weekends";
      isActive = true;
      rating = 5;
      reviewCount = 1;
    },
  );
  providerProfiles.add(
    seedPrincipal2,
    {
      owner = seedPrincipal2;
      displayName = "Paws & Claws Dog Walking";
      bio = "Professional dog walker. I love animals!";
      category = "Dog Walking";
      pricePerHour = 30;
      city = "San Francisco";
      availability = "Weekdays only";
      isActive = true;
      rating = 4;
      reviewCount = 1;
    },
  );
  providerProfiles.add(
    seedPrincipal3,
    {
      owner = seedPrincipal3;
      displayName = "Kitty Care Cat Sitting";
      bio = "Cat lover for 10 years. I offer cat sitting services.";
      category = "Pet Sitting";
      pricePerHour = 40;
      city = "Boston";
      availability = "Weekends only";
      isActive = true;
      rating = 4;
      reviewCount = 1;
    },
  );

  // Seed pets
  pets.add(
    1,
    {
      id = 1;
      owner = seedPrincipal4;
      name = "Buddy";
      breed = "Golden Retriever";
      age = 3;
      notes = "Very energetic and loving.";
    },
  );
  nextPetId := 2;
  pets.add(
    2,
    {
      id = 2;
      owner = seedPrincipal5;
      name = "Shadow";
      breed = "Tabby Cat";
      age = 5;
      notes = "Loves to play with yarn.";
    },
  );
  nextPetId := 3;

  // Seed bookings
  bookings.add(
    1,
    {
      id = 1;
      petParent = seedPrincipal4;
      providerId = seedPrincipal1;
      petId = 1;
      requestedDate = "2024-03-01";
      notes = "Need pet sitting for 3 days.";
      status = "completed";
      createdAt = 0;
    },
  );
  nextBookingId := 2;
  bookings.add(
    2,
    {
      id = 2;
      petParent = seedPrincipal5;
      providerId = seedPrincipal2;
      petId = 2;
      requestedDate = "2024-03-05";
      notes = "Looking for daily walks.";
      status = "pending";
      createdAt = 0;
    },
  );
  nextBookingId := 3;
};
