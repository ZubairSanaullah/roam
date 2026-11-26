import type { LucideIcon } from "lucide-react-native";
import Bath from "lucide-react-native/icons/bath";
import Building2 from "lucide-react-native/icons/building-2";
import Flame from "lucide-react-native/icons/flame";
import PawPrint from "lucide-react-native/icons/paw-print";
import Trees from "lucide-react-native/icons/trees";
import Utensils from "lucide-react-native/icons/utensils";
import Waves from "lucide-react-native/icons/waves";
import Wifi from "lucide-react-native/icons/wifi";

export type StayCategory = "All Stays" | "Cabins" | "Beach" | "City" | "Villas";

export type StaySort = "recommended" | "rating_desc" | "price_asc";

export interface StayAmenityItem {
  label: string;
  icon: LucideIcon;
}

export interface StayPolicyItem {
  title: string;
  detail: string;
}

export interface StayProperty {
  id: string;
  title: string;
  location: string;
  category: Exclude<StayCategory, "All Stays">;
  rating: string;
  ratingValue: number;
  reviewCount: number;
  pricePerNight: number;
  maxGuests: number;
  petFriendly: boolean;
  hasHotTub: boolean;
  imageUri: string;
  description: string;
  amenities: readonly StayAmenityItem[];
  policies: readonly StayPolicyItem[];
}

export const STAY_CATEGORIES: readonly StayCategory[] = [
  "All Stays",
  "Cabins",
  "Beach",
  "City",
  "Villas",
] as const;

export const LOCAL_STAYS: readonly StayProperty[] = [
  {
    id: "modern-cabin-hot-tub",
    title: "Modern Cabin with Hot Tub",
    location: "Lake Arrowhead, CA",
    category: "Cabins",
    rating: "4.9",
    ratingValue: 4.9,
    reviewCount: 342,
    pricePerNight: 280,
    maxGuests: 4,
    petFriendly: true,
    hasHotTub: true,
    imageUri:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    description:
      "Quiet cedar A-frame tucked under towering pines with a private cedar hot tub, wood-burning firepit, fenced deck for pets, and fast fiber Wi-Fi.",
    amenities: [
      { label: "Hot Tub", icon: Bath },
      { label: "Pet Friendly", icon: PawPrint },
      { label: "Firepit", icon: Flame },
    ],
    policies: [
      {
        title: "Free cancellation",
        detail: "Full refund up to 7 days before check-in. 50% refund up to 48 hours prior.",
      },
      {
        title: "Pet & quiet hours",
        detail: "Up to 2 dogs welcome with no extra pet fee. Quiet hours run 10:00 PM to 7:00 AM.",
      },
    ],
  },
  {
    id: "whistler-alpine-retreat",
    title: "Alpine Timber Retreat",
    location: "Whistler, BC",
    category: "Cabins",
    rating: "4.9",
    ratingValue: 4.9,
    reviewCount: 218,
    pricePerNight: 320,
    maxGuests: 6,
    petFriendly: true,
    hasHotTub: true,
    imageUri:
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Lakefront mountain cabin with panoramic peak views, heated soaking tub on the wrap-around deck, and secluded forest trails right out the back door.",
    amenities: [
      { label: "Hot Tub", icon: Bath },
      { label: "Pet Friendly", icon: PawPrint },
      { label: "Forest Trail", icon: Trees },
    ],
    policies: [
      {
        title: "Flexible check-in",
        detail: "Self check-in via smart keypad from 3:00 PM. Checkout is 11:00 AM.",
      },
      {
        title: "House rules",
        detail: "No parties or indoor smoking. Pets are welcome on ground-floor living areas.",
      },
    ],
  },
  {
    id: "malibu-cliffside-villa",
    title: "Oceanfront Horizon Villa",
    location: "Malibu, CA",
    category: "Villas",
    rating: "4.8",
    ratingValue: 4.8,
    reviewCount: 164,
    pricePerNight: 490,
    maxGuests: 8,
    petFriendly: false,
    hasHotTub: true,
    imageUri:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    description:
      "Sun-drenched coastal villa with infinity pool, cliffside hot tub overlooking the Pacific, outdoor dining terrace, and private beach stairs.",
    amenities: [
      { label: "Infinity Pool", icon: Waves },
      { label: "Hot Tub", icon: Bath },
      { label: "Chef Kitchen", icon: Utensils },
    ],
    policies: [
      {
        title: "Cancellation policy",
        detail: "Full refund up to 14 days before arrival. Travel credit within 7 days.",
      },
      {
        title: "Property guidelines",
        detail: "No pets permitted on the property. Pool heating included year-round.",
      },
    ],
  },
  {
    id: "big-bear-forest-haven",
    title: "Secluded Pine A-Frame",
    location: "Big Bear, CA",
    category: "Cabins",
    rating: "4.7",
    ratingValue: 4.7,
    reviewCount: 129,
    pricePerNight: 225,
    maxGuests: 4,
    petFriendly: true,
    hasHotTub: false,
    imageUri:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Cozy quiet forest cabin under $250 a night with cast-iron stove, wrap-around deck, dog-friendly yard, and starry mountain skies.",
    amenities: [
      { label: "Pet Friendly", icon: PawPrint },
      { label: "Wood Stove", icon: Flame },
      { label: "Fast Wi-Fi", icon: Wifi },
    ],
    policies: [
      {
        title: "Free cancellation",
        detail: "Full refund up to 5 days before check-in.",
      },
      {
        title: "Pet friendly",
        detail: "Dogs of any size welcome. Please keep pets off upstairs bedding.",
      },
    ],
  },
  {
    id: "carmel-dune-beach-house",
    title: "Coastal Glass Beach House",
    location: "Carmel, CA",
    category: "Beach",
    rating: "4.9",
    ratingValue: 4.9,
    reviewCount: 195,
    pricePerNight: 365,
    maxGuests: 5,
    petFriendly: true,
    hasHotTub: false,
    imageUri:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    description:
      "Bright oceanfront beach house steps from white sand, featuring floor-to-ceiling coastal views, heated outdoor shower, and dog-friendly patio.",
    amenities: [
      { label: "Beachfront", icon: Waves },
      { label: "Pet Friendly", icon: PawPrint },
      { label: "Fast Wi-Fi", icon: Wifi },
    ],
    policies: [
      {
        title: "Check-in & parking",
        detail: "Private 2-car driveway included. Check-in after 4:00 PM.",
      },
      {
        title: "Beach & pets",
        detail: "Leashed dogs allowed on Carmel Beach; outdoor rinse station provided.",
      },
    ],
  },
  {
    id: "soho-sunlit-city-loft",
    title: "Sunlit Architectural Loft",
    location: "New York, NY",
    category: "City",
    rating: "4.8",
    ratingValue: 4.8,
    reviewCount: 284,
    pricePerNight: 295,
    maxGuests: 2,
    petFriendly: false,
    hasHotTub: false,
    imageUri:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    description:
      "Quiet top-floor city apartment with 12-foot ceilings, acoustic glass windows, espresso bar, and dedicated remote-work desk.",
    amenities: [
      { label: "Fast Wi-Fi", icon: Wifi },
      { label: "City Skyline", icon: Building2 },
    ],
    policies: [
      {
        title: "Building quiet hours",
        detail: "Quiet residential loft building; quiet hours begin at 10:00 PM nightly.",
      },
      {
        title: "Cancellation policy",
        detail: "Full refund up to 48 hours before check-in.",
      },
    ],
  },
  {
    id: "aspen-snow-chalet",
    title: "Timber Ridge Chalet",
    location: "Aspen, CO",
    category: "Cabins",
    rating: "4.9",
    ratingValue: 4.9,
    reviewCount: 152,
    pricePerNight: 275,
    maxGuests: 4,
    petFriendly: true,
    hasHotTub: true,
    imageUri:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    description:
      "Warm snow-country cabin with private outdoor hot tub, quiet woodland setting, fireplace, and pet-friendly mudroom under $300 a night.",
    amenities: [
      { label: "Hot Tub", icon: Bath },
      { label: "Pet Friendly", icon: PawPrint },
      { label: "Fireplace", icon: Flame },
    ],
    policies: [
      {
        title: "Winter access",
        detail: "Heated driveway cleared every morning. AWD recommended in winter.",
      },
      {
        title: "Free cancellation",
        detail: "Full refund up to 7 days prior to arrival.",
      },
    ],
  },
  {
    id: "palm-springs-desert-villa",
    title: "Mid-Century Courtyard Villa",
    location: "Palm Springs, CA",
    category: "Villas",
    rating: "4.8",
    ratingValue: 4.8,
    reviewCount: 207,
    pricePerNight: 340,
    maxGuests: 6,
    petFriendly: true,
    hasHotTub: true,
    imageUri:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    description:
      "Architectural desert villa featuring saltwater pool, spa hot tub, shaded citrus courtyard, and private walled yard for pets.",
    amenities: [
      { label: "Pool", icon: Waves },
      { label: "Hot Tub", icon: Bath },
      { label: "Pet Friendly", icon: PawPrint },
    ],
    policies: [
      {
        title: "Outdoor noise ordinance",
        detail: "Palm Springs ordinance prohibits outdoor amplified music at all hours.",
      },
      {
        title: "Pet friendly",
        detail: "Fully walled courtyard ideal for dogs; max 2 pets.",
      },
    ],
  },
] as const;

export interface StaySearchFilters {
  query?: string;
  category?: StayCategory;
  petFriendlyOnly?: boolean;
  hotTubOnly?: boolean;
  underThreeHundred?: boolean;
  sort?: StaySort;
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "with",
  "and",
  "or",
  "for",
  "in",
  "near",
  "under",
  "below",
  "less",
  "than",
  "night",
  "nightly",
  "stay",
  "stays",
  "place",
  "places",
  "find",
  "me",
  "want",
  "looking",
]);

/**
 * Filters and ranks local stays using natural-language constraint parsing
 * (price caps, pet friendly, hot tub) plus category and keyword matching.
 */
export function searchStays(
  stays: readonly StayProperty[],
  {
    query = "",
    category = "All Stays",
    petFriendlyOnly = false,
    hotTubOnly = false,
    underThreeHundred = false,
    sort = "recommended",
  }: StaySearchFilters,
): StayProperty[] {
  const normalized = query.trim().toLowerCase();

  const priceMatch = normalized.match(/(?:under|below|max|<=?)\s*\$?\s*(\d+)/);
  const parsedMaxPrice = priceMatch ? Number(priceMatch[1]) : null;
  const requiresPets = petFriendlyOnly || /\b(pet|pets|dog|dogs|pet-friendly|pet friendly)\b/.test(normalized);
  const requiresHotTub = hotTubOnly || /\b(hot tub|hottub|jacuzzi|spa)\b/.test(normalized);

  const tokens = normalized
    .replace(/(?:under|below|max|<=?)\s*\$?\s*\d+/g, " ")
    .replace(/\$?\d+/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

  const scored = stays
    .filter((stay) => {
      if (category !== "All Stays" && stay.category !== category) return false;
      if (requiresPets && !stay.petFriendly) return false;
      if (requiresHotTub && !stay.hasHotTub) return false;
      if (underThreeHundred && stay.pricePerNight >= 300) return false;
      if (parsedMaxPrice !== null && stay.pricePerNight > parsedMaxPrice) return false;

      if (tokens.length === 0) return true;

      const haystack = [
        stay.title,
        stay.location,
        stay.category,
        stay.description,
        ...stay.amenities.map((a) => a.label),
      ]
        .join(" ")
        .toLowerCase();

      // Match when at least one meaningful query token appears (or all for tight queries <= 2 tokens)
      const hits = tokens.filter((token) => {
        if (token === "cabin" || token === "cabins") {
          return haystack.includes("cabin") || stay.category === "Cabins";
        }
        if (token === "villa" || token === "villas") {
          return haystack.includes("villa") || stay.category === "Villas";
        }
        return haystack.includes(token);
      });

      return tokens.length <= 2 ? hits.length === tokens.length : hits.length >= Math.ceil(tokens.length / 2);
    })
    .map((stay) => {
      const haystack = [
        stay.title,
        stay.location,
        stay.category,
        stay.description,
        ...stay.amenities.map((a) => a.label),
      ]
        .join(" ")
        .toLowerCase();

      const relevance = tokens.reduce(
        (acc, token) => (haystack.includes(token) ? acc + 1 : acc),
        0,
      );
      return { stay, relevance };
    });

  if (sort === "price_asc") {
    scored.sort((a, b) => a.stay.pricePerNight - b.stay.pricePerNight);
  } else if (sort === "rating_desc") {
    scored.sort(
      (a, b) => b.stay.ratingValue - a.stay.ratingValue || b.stay.reviewCount - a.stay.reviewCount,
    );
  } else {
    scored.sort(
      (a, b) =>
        b.relevance - a.relevance ||
        b.stay.ratingValue - a.stay.ratingValue ||
        a.stay.pricePerNight - b.stay.pricePerNight,
    );
  }

  return scored.map((entry) => entry.stay);
}
