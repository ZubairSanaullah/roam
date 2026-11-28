import type { LucideIcon } from "lucide-react-native";
import Bath from "lucide-react-native/icons/bath";
import Building2 from "lucide-react-native/icons/building-2";
import Car from "lucide-react-native/icons/car";
import Flame from "lucide-react-native/icons/flame";
import Laptop from "lucide-react-native/icons/laptop";
import PawPrint from "lucide-react-native/icons/paw-print";
import Sun from "lucide-react-native/icons/sun";
import Trees from "lucide-react-native/icons/trees";
import Utensils from "lucide-react-native/icons/utensils";
import Waves from "lucide-react-native/icons/waves";
import Wifi from "lucide-react-native/icons/wifi";
import Zap from "lucide-react-native/icons/zap";
import type { StayAmenityItem, StayCategory } from "@/data/stays";

export const SANITY_PROJECT_ID =
  process.env.EXPO_PUBLIC_SANITY_PROJECT_ID || "z4fffltf";
export const SANITY_DATASET =
  process.env.EXPO_PUBLIC_SANITY_DATASET || "production";
export const SANITY_API_VERSION = "2026-02-01";

type SanityCategory = "cabins" | "beach" | "city" | "villas";

const CATEGORY_MAP: Record<SanityCategory, Exclude<StayCategory, "All Stays">> = {
  cabins: "Cabins",
  beach: "Beach",
  city: "City",
  villas: "Villas",
};

const AMENITY_META: Record<string, { label: string; icon: LucideIcon }> = {
  "hot-tub": { label: "Hot Tub", icon: Bath },
  "dedicated-workspace": { label: "Dedicated Workspace", icon: Laptop },
  "free-parking": { label: "Free Parking", icon: Car },
  "fast-wifi": { label: "Fast Wi-Fi", icon: Wifi },
  fireplace: { label: "Fireplace", icon: Flame },
  firepit: { label: "Firepit", icon: Flame },
  "wood-stove": { label: "Wood Stove", icon: Flame },
  pool: { label: "Pool", icon: Waves },
  "infinity-pool": { label: "Infinity Pool", icon: Waves },
  beachfront: { label: "Beachfront", icon: Waves },
  "chef-kitchen": { label: "Chef Kitchen", icon: Utensils },
  "forest-trail": { label: "Forest Trail", icon: Trees },
  "city-skyline": { label: "City Skyline", icon: Building2 },
  "ev-charger": { label: "EV Charger", icon: Zap },
  "patio-deck": { label: "Patio or Deck", icon: Sun },
};

export interface LiveStaySummary {
  id: string;
  title: string;
  location: string;
  category: Exclude<StayCategory, "All Stays">;
  rating: string;
  ratingValue: number;
  reviewCount: number;
  pricePerNight: number;
  tagline: string;
  imageUri: string;
}

export interface LiveStayImage {
  _key: string;
  url: string;
  alt: string;
}

export interface LiveStaySleepingRoom {
  _key: string;
  roomName: string;
  bedDetails: string;
}

export interface LiveStayHost {
  name: string;
  avatarUrl?: string;
  avatarAlt?: string;
  bio?: string;
  isSuperhost: boolean;
  responseTime?: string;
  memberSince?: number;
}

export interface LiveStayPolicy {
  _id: string;
  title: string;
  category: string;
  summary: string;
  exactText: string;
}

export interface LiveStayNote {
  _key: string;
  title: string;
  detail: string;
}

export interface LiveStayDetail extends LiveStaySummary {
  images: LiveStayImage[];
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  petFriendly: boolean;
  amenities: StayAmenityItem[];
  sleepingArrangements: LiveStaySleepingRoom[];
  description: string;
  neighborhoodOverview?: string;
  highlights: string[];
  checkInTime: string;
  checkOutTime: string;
  host?: LiveStayHost;
  policies: LiveStayPolicy[];
  staySpecificNotes: LiveStayNote[];
}

interface RawSanityStaySummary {
  _id: string;
  slug?: string;
  title?: string;
  location?: string;
  category?: SanityCategory;
  rating?: number;
  reviewCount?: number;
  pricePerNight?: number;
  tagline?: string;
  imageUrl?: string;
}

interface RawSanityStayDetail extends RawSanityStaySummary {
  images?: { _key?: string; alt?: string; url?: string }[];
  maxGuests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  petFriendly?: boolean;
  amenities?: string[];
  sleepingArrangements?: { _key?: string; roomName?: string; bedDetails?: string }[];
  description?: string;
  neighborhoodOverview?: string;
  highlights?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  host?: {
    name?: string;
    avatarUrl?: string;
    avatarAlt?: string;
    bio?: string;
    isSuperhost?: boolean;
    responseTime?: string;
    memberSince?: number;
  };
  policies?: {
    _id?: string;
    title?: string;
    category?: string;
    summary?: string;
    exactText?: string;
  }[];
  staySpecificNotes?: { _key?: string; title?: string; detail?: string }[];
}

export function withSanityImageParams(url: string, width = 1200): string {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=max&w=${width}&q=80`;
}

function mapAmenities(
  slugs: readonly string[] | undefined,
  petFriendly: boolean,
): StayAmenityItem[] {
  const items: StayAmenityItem[] = [];
  if (petFriendly) {
    items.push({ label: "Pet Friendly", icon: PawPrint });
  }
  for (const slug of slugs ?? []) {
    const meta = AMENITY_META[slug];
    items.push(meta ?? { label: slug, icon: Sun });
  }
  return items;
}

async function fetchGroq<T>(
  query: string,
  params?: Record<string, string | number | boolean>,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
  );
  url.searchParams.set("query", query);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    }
  }

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`Sanity query failed with status ${response.status}`);
  }
  const payload = (await response.json()) as { result: T };
  return payload.result;
}

const LIVE_STAYS_QUERY = `*[_type == "stay" && !(_id in path("drafts.**"))] | order(rating desc, reviewCount desc, title asc) {
  _id,
  "slug": slug.current,
  title,
  "location": location.display,
  category,
  rating,
  reviewCount,
  pricePerNight,
  tagline,
  "imageUrl": images[0].asset->url
}`;

const LIVE_STAY_BY_ID_QUERY = `*[_type == "stay" && !(_id in path("drafts.**")) && (slug.current == $id || _id == $id)][0] {
  _id,
  "slug": slug.current,
  title,
  "location": location.display,
  category,
  rating,
  reviewCount,
  pricePerNight,
  tagline,
  "imageUrl": images[0].asset->url,
  images[]{
    _key,
    alt,
    "url": asset->url
  },
  maxGuests,
  bedrooms,
  beds,
  bathrooms,
  petFriendly,
  amenities,
  sleepingArrangements[]{
    _key,
    roomName,
    bedDetails
  },
  description,
  neighborhoodOverview,
  highlights,
  checkInTime,
  checkOutTime,
  host->{
    name,
    "avatarUrl": avatar.asset->url,
    "avatarAlt": avatar.alt,
    bio,
    isSuperhost,
    responseTime,
    memberSince
  },
  policies[]->{
    _id,
    title,
    category,
    summary,
    exactText
  },
  staySpecificNotes[]{
    _key,
    title,
    detail
  }
}`;

function mapSummary(raw: RawSanityStaySummary): LiveStaySummary {
  const ratingValue = typeof raw.rating === "number" ? raw.rating : 4.8;
  return {
    id: raw.slug || raw._id,
    title: raw.title || "Untitled Stay",
    location: raw.location || "Location unavailable",
    category: raw.category ? CATEGORY_MAP[raw.category] : "Cabins",
    rating: ratingValue.toFixed(1),
    ratingValue,
    reviewCount: typeof raw.reviewCount === "number" ? raw.reviewCount : 0,
    pricePerNight: typeof raw.pricePerNight === "number" ? raw.pricePerNight : 0,
    tagline: raw.tagline || "",
    imageUri: withSanityImageParams(raw.imageUrl || "", 1200),
  };
}

export async function fetchLiveStays(signal?: AbortSignal): Promise<LiveStaySummary[]> {
  const rows = await fetchGroq<RawSanityStaySummary[]>(LIVE_STAYS_QUERY, undefined, signal);
  return (rows ?? []).map(mapSummary);
}

export async function fetchLiveStayById(
  id: string,
  signal?: AbortSignal,
): Promise<LiveStayDetail | null> {
  const raw = await fetchGroq<RawSanityStayDetail | null>(
    LIVE_STAY_BY_ID_QUERY,
    { id },
    signal,
  );
  if (!raw) return null;

  const summary = mapSummary(raw);
  const images = (raw.images ?? [])
    .filter((img): img is { _key: string; alt?: string; url: string } =>
      Boolean(img?.url && img?._key),
    )
    .map((img) => ({
      _key: img._key,
      alt: img.alt || summary.title,
      url: withSanityImageParams(img.url, 1200),
    }));

  const petFriendly = Boolean(raw.petFriendly);

  return {
    ...summary,
    images:
      images.length > 0
        ? images
        : summary.imageUri
          ? [{ _key: "cover", alt: summary.title, url: summary.imageUri }]
          : [],
    maxGuests: typeof raw.maxGuests === "number" ? raw.maxGuests : 2,
    bedrooms: typeof raw.bedrooms === "number" ? raw.bedrooms : 1,
    beds: typeof raw.beds === "number" ? raw.beds : 1,
    bathrooms: typeof raw.bathrooms === "number" ? raw.bathrooms : 1,
    petFriendly,
    amenities: mapAmenities(raw.amenities, petFriendly),
    sleepingArrangements: (raw.sleepingArrangements ?? [])
      .filter((room): room is LiveStaySleepingRoom =>
        Boolean(room?._key && room?.roomName && room?.bedDetails),
      ),
    description: raw.description || summary.tagline,
    neighborhoodOverview: raw.neighborhoodOverview,
    highlights: (raw.highlights ?? []).filter(Boolean),
    checkInTime: raw.checkInTime || "3:00 PM",
    checkOutTime: raw.checkOutTime || "11:00 AM",
    host: raw.host?.name
      ? {
          name: raw.host.name,
          avatarUrl: raw.host.avatarUrl
            ? withSanityImageParams(raw.host.avatarUrl, 300)
            : undefined,
          avatarAlt: raw.host.avatarAlt,
          bio: raw.host.bio,
          isSuperhost: Boolean(raw.host.isSuperhost),
          responseTime: raw.host.responseTime,
          memberSince: raw.host.memberSince,
        }
      : undefined,
    policies: (raw.policies ?? []).filter(
      (pol): pol is LiveStayPolicy =>
        Boolean(pol?._id && pol?.title && pol?.summary && pol?.exactText),
    ),
    staySpecificNotes: (raw.staySpecificNotes ?? []).filter(
      (note): note is LiveStayNote =>
        Boolean(note?._key && note?.title && note?.detail),
    ),
  };
}
