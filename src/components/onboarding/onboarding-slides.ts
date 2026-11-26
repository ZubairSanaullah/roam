export interface OnboardingSlide {
  id: string;
  location: string;
  title: string;
  subtitle: string;
  imageUri: string;
}

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    id: "discover",
    location: "Whistler, BC",
    title: "Find a stay that\nfits your story",
    subtitle:
      "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
    imageUri:
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "search",
    location: "Amalfi Coast, Italy",
    title: "Describe your\nideal getaway",
    subtitle:
      "Tell roam what matters in one sentence: quiet forest views, pet-friendly patios, or stays under $300 a night.",
    imageUri:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "policies",
    location: "Lake Arrowhead, CA",
    title: "Book with total\nconfidence",
    subtitle:
      "Get exact answers on house rules, check-in, and cancellation straight from each stay's verified policies.",
    imageUri:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
  },
] as const;
