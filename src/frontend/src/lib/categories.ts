export const CATEGORIES = [
  {
    id: "Grooming",
    name: "Grooming",
    icon: "✂️",
    description:
      "Professional grooming, baths, haircuts & nail trims for your furry friend.",
  },
  {
    id: "Walker",
    name: "Dog Walker",
    icon: "🦮",
    description: "Daily walks and exercise to keep your pup happy and healthy.",
  },
  {
    id: "Trainer",
    name: "Dog Trainer",
    icon: "🎓",
    description:
      "Certified trainers for obedience, behaviour correction & tricks.",
  },
  {
    id: "PetTransport",
    name: "Pet Transport",
    icon: "🚐",
    description: "Safe and comfortable transport to vet appointments and more.",
  },
  {
    id: "DogMating",
    name: "Dog Mating",
    icon: "🐾",
    description:
      "Connect with reputable breeders for responsible dog mating services.",
  },
];

export const CATEGORY_DISPLAY_NAMES: Record<string, string> =
  Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));
