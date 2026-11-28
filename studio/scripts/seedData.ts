export interface HostSeed {
  slug: string
  name: string
  avatarUrl: string
  avatarAlt: string
  bio: string
  isSuperhost: boolean
  responseTime: 'within an hour' | 'within a few hours' | 'within a day'
  languages: string[]
  memberSince: number
}

export interface PolicySeed {
  slug: string
  title: string
  category: 'cancellation' | 'pets' | 'check_in' | 'house_rules' | 'safety_parking'
  summary: string
  exactText: string
}

export interface StaySeed {
  slug: string
  title: string
  category: 'cabins' | 'beach' | 'city' | 'villas'
  location: {
    display: string
    city: string
    region: string
    country: string
  }
  images: {url: string; alt: string}[]
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  petFriendly: boolean
  amenities: string[]
  sleepingArrangements: {roomName: string; bedDetails: string}[]
  rating: number
  reviewCount: number
  tagline: string
  description: string
  neighborhoodOverview: string
  highlights: string[]
  checkInTime: string
  checkOutTime: string
  hostSlug: string
  policySlugs: string[]
  staySpecificNotes?: {title: string; detail: string}[]
}

export const HOSTS_SEED: HostSeed[] = [
  {
    slug: 'maya-chen',
    name: 'Maya Chen',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Maya Chen smiling outdoors',
    bio: 'Architect and mountain-town local curating quiet timber retreats across California and the Pacific Northwest.',
    isSuperhost: true,
    responseTime: 'within an hour',
    languages: ['English', 'Mandarin'],
    memberSince: 2019,
  },
  {
    slug: 'lucas-bennett',
    name: 'Lucas Bennett',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Lucas Bennett',
    bio: 'Former backcountry guide who restores alpine A-frames and keeps trail maps and firewood stocked for every guest.',
    isSuperhost: true,
    responseTime: 'within an hour',
    languages: ['English', 'French'],
    memberSince: 2018,
  },
  {
    slug: 'elena-rostova',
    name: 'Elena Rostova',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Elena Rostova',
    bio: 'Interior designer focused on warm natural materials, coastal daylight, and effortless indoor-outdoor living.',
    isSuperhost: true,
    responseTime: 'within a few hours',
    languages: ['English', 'Spanish'],
    memberSince: 2020,
  },
  {
    slug: 'marcus-vance',
    name: 'Marcus Vance',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Marcus Vance',
    bio: 'Hospitality operator managing sunlit urban lofts and quiet remote-work apartments in walkable neighborhoods.',
    isSuperhost: false,
    responseTime: 'within a few hours',
    languages: ['English'],
    memberSince: 2022,
  },
  {
    slug: 'claire-dubois',
    name: 'Claire Dubois',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Claire Dubois',
    bio: 'Longtime desert and wine-country host specializing in mid-century villas, courtyard pools, and private chef referrals.',
    isSuperhost: true,
    responseTime: 'within an hour',
    languages: ['English', 'French'],
    memberSince: 2017,
  },
  {
    slug: 'devon-brooks',
    name: 'Devon Brooks',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Devon Brooks',
    bio: 'Surfer and coastal builder maintaining breezy beach cottages with outdoor showers and dog-friendly decks.',
    isSuperhost: false,
    responseTime: 'within an hour',
    languages: ['English'],
    memberSince: 2021,
  },
  {
    slug: 'sofia-martinez',
    name: 'Sofia Martinez',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Sofia Martinez',
    bio: 'Design-minded Southwest and canyon host focused on tranquil adobe homes, stargazing decks, and local art.',
    isSuperhost: true,
    responseTime: 'within an hour',
    languages: ['English', 'Spanish'],
    memberSince: 2019,
  },
  {
    slug: 'noah-lindqvist',
    name: 'Noah Lindqvist',
    avatarUrl:
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=600&q=80',
    avatarAlt: 'Portrait of host Noah Lindqvist',
    bio: 'Scandinavian-inspired cabin builder crafting cedar soaking tubs, sauna decks, and cozy cold-weather sanctuaries.',
    isSuperhost: true,
    responseTime: 'within a few hours',
    languages: ['English', 'Swedish'],
    memberSince: 2020,
  },
]

export const POLICIES_SEED: PolicySeed[] = [
  {
    slug: 'flexible-cancellation-48h',
    title: 'Flexible Cancellation (48 Hours)',
    category: 'cancellation',
    summary: 'Full refund when canceled at least 48 hours before check-in.',
    exactText:
      'Guests receive a 100% refund of the nightly rate and cleaning fee if canceled at least 48 hours before the scheduled check-in time. Cancellations made within 48 hours of arrival are charged the first night plus the cleaning fee, and any remaining nights are refunded in full.',
  },
  {
    slug: 'moderate-cancellation-7d',
    title: 'Moderate Cancellation (7 Days)',
    category: 'cancellation',
    summary: 'Full refund up to 7 days before check-in; 50% refund up to 48 hours prior.',
    exactText:
      'Guests receive a full refund if canceled at least 7 days before check-in. Cancellations between 7 days and 48 hours before check-in qualify for a 50% refund of the nightly rate plus a full refund of the cleaning fee. No refund is issued within 48 hours of check-in.',
  },
  {
    slug: 'firm-cancellation-14d',
    title: 'Firm Cancellation (14 Days)',
    category: 'cancellation',
    summary: 'Full refund up to 14 days before arrival; 50% refund up to 7 days prior.',
    exactText:
      'Guests receive a full refund if canceled at least 14 days before the check-in date. Cancellations between 14 days and 7 days prior receive a 50% refund of the nightly rate. Cancellations made fewer than 7 days before arrival are non-refundable unless the dates are rebooked.',
  },
  {
    slug: 'pets-welcome-up-to-2',
    title: 'Dog-Friendly Stay (Up to 2 Dogs)',
    category: 'pets',
    summary: 'Up to 2 well-behaved dogs welcome with no extra nightly pet fee.',
    exactText:
      'Up to 2 house-trained dogs are welcome at no extra pet fee. Dogs may not be left unattended indoors unless crated, and guests must keep pets off upholstered sofas and beds using the provided pet throws. Please clean up all outdoor waste prior to checkout.',
  },
  {
    slug: 'no-pets-permitted',
    title: 'No Pets Permitted',
    category: 'pets',
    summary: 'No pets allowed on the property to keep the space allergen-free.',
    exactText:
      'Pets are not permitted anywhere on the property, including patios, garages, and yards, in order to maintain an allergen-free environment for future guests. Service animals as defined by applicable law are always accommodated.',
  },
  {
    slug: 'self-checkin-smart-keypad',
    title: 'Self Check-In via Smart Keypad',
    category: 'check_in',
    summary: 'Contactless entry with a unique keypad code sent 24 hours before arrival.',
    exactText:
      'Entry is contactless via the front door smart keypad. A unique time-bound door code is sent automatically 24 hours before check-in and remains active until checkout time. Early check-in or late checkout may be requested in advance subject to housekeeping turnover.',
  },
  {
    slug: 'quiet-hours-10pm-7am',
    title: 'Quiet Hours (10:00 PM to 7:00 AM)',
    category: 'house_rules',
    summary: 'Outdoor decks, hot tubs, and patios observe quiet hours from 10:00 PM to 7:00 AM.',
    exactText:
      'Neighborhood quiet hours run nightly from 10:00 PM to 7:00 AM. During these hours, keep voices low outdoors, avoid amplified music on decks or patios, and close hot tub covers promptly after use so neighbors enjoy peaceful nights.',
  },
  {
    slug: 'no-parties-no-smoking',
    title: 'No Parties or Indoor Smoking',
    category: 'house_rules',
    summary: 'Strictly no events, unregistered overnight guests, smoking, or vaping indoors.',
    exactText:
      'Parties, events, and commercial gatherings are strictly prohibited, and overnight occupancy may not exceed the confirmed guest count. Smoking, vaping, and open flames inside the home are not permitted and incur an immediate remediation fee.',
  },
  {
    slug: 'driveway-parking-guidelines',
    title: 'Private Driveway & Parking Guidelines',
    category: 'safety_parking',
    summary: 'Park only in designated driveway spaces; street parking is restricted overnight.',
    exactText:
      'Guests must park exclusively in the designated driveway or garage spaces listed for the stay. Overnight street parking is restricted in many mountain and coastal zones to preserve emergency vehicle access. Do not block neighboring driveways or shared access lanes.',
  },
]

const P = {
  cabinA:
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
  cabinB:
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80',
  cabinC:
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80',
  cabinD:
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
  cabinE:
    'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=1200&q=80',
  villaA:
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
  villaB:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  villaC:
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  villaD:
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  villaE:
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  beachA:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  beachB:
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
  beachC:
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  beachD:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  beachE:
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  cityA:
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  cityB:
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  cityC:
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  cityD:
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
  cityE:
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  intA:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  intB:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  intC:
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  intD:
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  intE:
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
  intF:
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  intG:
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
  intH:
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
  intI:
    'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1200&q=80',
  intJ:
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  intK:
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
  intL:
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
}

export const STAYS_SEED: StaySeed[] = [
  {
    slug: 'modern-cabin-hot-tub',
    title: 'Modern Cabin with Hot Tub',
    category: 'cabins',
    location: {
      display: 'Lake Arrowhead, CA',
      city: 'Lake Arrowhead',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.cabinA, alt: 'Modern cedar A-frame cabin tucked beneath tall pines'},
      {url: P.intA, alt: 'Warm open-plan timber living room with floor-to-ceiling windows'},
      {url: P.intJ, alt: 'Modern wood and stone kitchen ready for mountain cooking'},
    ],
    pricePerNight: 280,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    petFriendly: true,
    amenities: ['hot-tub', 'firepit', 'fast-wifi', 'dedicated-workspace', 'free-parking', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Primary Loft', bedDetails: '1 King bed with skylight'},
      {roomName: 'Pine Guest Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 342,
    tagline: 'Quiet cedar A-frame under towering pines with private hot tub and fenced dog deck.',
    description:
      'Quiet cedar A-frame tucked under towering pines with a private cedar hot tub, wood-burning firepit, fenced deck for pets, dedicated sunlit workspace, and fast fiber Wi-Fi. Built for slow mornings in the forest without sacrificing reliable remote work.',
    neighborhoodOverview:
      'Set on a peaceful dead-end mountain lane five minutes from Lake Arrowhead Village and quiet National Forest hiking trails.',
    highlights: [
      'Private cedar soaking tub on a fenced pine deck',
      'Fenced wraparound patio safe for dogs',
      'Ergonomic oak desk with 500 Mbps fiber Wi-Fi',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'maya-chen',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
      'driveway-parking-guidelines',
    ],
    staySpecificNotes: [
      {
        title: 'Fenced dog deck',
        detail:
          'The back cedar deck is enclosed with a 42-inch gate so dogs can roam safely outdoors while supervised.',
      },
    ],
  },
  {
    slug: 'whistler-alpine-retreat',
    title: 'Alpine Timber Retreat',
    category: 'cabins',
    location: {
      display: 'Whistler, BC',
      city: 'Whistler',
      region: 'BC',
      country: 'Canada',
    },
    images: [
      {url: P.cabinB, alt: 'Alpine timber cabin surrounded by evergreen forest and lake view'},
      {url: P.intB, alt: 'Bright timber-framed lounge with mountain view glass'},
      {url: P.intL, alt: 'Cozy primary bedroom suite with crisp linens'},
    ],
    pricePerNight: 320,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2.5,
    petFriendly: true,
    amenities: ['hot-tub', 'forest-trail', 'fireplace', 'free-parking', 'ev-charger', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Peak Primary Suite', bedDetails: '1 King bed'},
      {roomName: 'Alpine Bedroom', bedDetails: '1 Queen bed'},
      {roomName: 'Bunk Den', bedDetails: '2 Twin beds'},
    ],
    rating: 4.9,
    reviewCount: 218,
    tagline: 'Lakefront mountain cabin with wrap-around hot tub deck and direct forest trail access.',
    description:
      'Lakefront mountain cabin with panoramic peak views, heated soaking tub on the wrap-around deck, stone wood-burning fireplace, and secluded forest trails right out the back door. Designed for ski weekends, trail runs, and relaxed evenings with dogs.',
    neighborhoodOverview:
      'Quiet Nordic valley setting ten minutes south of Whistler Village, bordering the Valley Trail network.',
    highlights: [
      'Direct trailhead step-out behind the cabin',
      'Private heated hot tub overlooking evergreens',
      'Level-2 EV charger in the heated carport',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'lucas-bennett',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'no-parties-no-smoking',
      'driveway-parking-guidelines',
    ],
  },
  {
    slug: 'malibu-cliffside-villa',
    title: 'Oceanfront Horizon Villa',
    category: 'villas',
    location: {
      display: 'Malibu, CA',
      city: 'Malibu',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.villaA, alt: 'Oceanfront horizon villa overlooking the Pacific coastline'},
      {url: P.intC, alt: 'Sunlit coastal dining and living room opening to terrace'},
      {url: P.intK, alt: 'Chef kitchen with stone island and ocean light'},
    ],
    pricePerNight: 490,
    maxGuests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3.5,
    petFriendly: false,
    amenities: ['infinity-pool', 'hot-tub', 'chef-kitchen', 'beachfront', 'free-parking', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Ocean Primary', bedDetails: '1 King bed'},
      {roomName: 'Terrace Suite', bedDetails: '1 Queen bed'},
      {roomName: 'Canyon Room', bedDetails: '1 Queen bed'},
      {roomName: 'Garden Suite', bedDetails: '1 Queen bed'},
    ],
    rating: 4.8,
    reviewCount: 164,
    tagline: 'Sun-drenched cliffside villa with infinity pool, spa hot tub, and private beach stairs.',
    description:
      'Sun-drenched coastal villa with infinity pool, cliffside hot tub overlooking the Pacific, outdoor dining terrace, chef kitchen, and private beach stairs. Every bedroom opens to salty ocean air and unobstructed sunset horizons.',
    neighborhoodOverview:
      'Tucked along a private bluff cove off Pacific Coast Highway, minutes from Point Dume hiking bluffs.',
    highlights: [
      'Year-round heated saltwater infinity pool',
      'Private gated stairs down to sandy cove',
      'Wolf and Sub-Zero chef kitchen',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'elena-rostova',
    policySlugs: [
      'firm-cancellation-14d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
      'no-parties-no-smoking',
    ],
    staySpecificNotes: [
      {
        title: 'Pool & spa heating',
        detail: 'Pool heating to 82F is included year-round; hot tub heats to 102F on demand.',
      },
    ],
  },
  {
    slug: 'big-bear-forest-haven',
    title: 'Secluded Pine A-Frame',
    category: 'cabins',
    location: {
      display: 'Big Bear, CA',
      city: 'Big Bear',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.cabinC, alt: 'Secluded pine A-frame cabin surrounded by mountain trees'},
      {url: P.intE, alt: 'Cozy wooden interior with natural light and reading nook'},
    ],
    pricePerNight: 225,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    petFriendly: true,
    amenities: ['wood-stove', 'fast-wifi', 'dedicated-workspace', 'free-parking', 'forest-trail'],
    sleepingArrangements: [
      {roomName: 'Mezzanine Loft', bedDetails: '1 Queen bed'},
      {roomName: 'Downstairs Bedroom', bedDetails: '1 Queen bed'},
    ],
    rating: 4.7,
    reviewCount: 129,
    tagline: 'Cozy quiet forest cabin under $250 with cast-iron stove and dog-friendly yard.',
    description:
      'Cozy quiet forest cabin under $250 a night with cast-iron wood stove, wrap-around deck, dog-friendly yard, dedicated desk nook, and starry mountain skies. Ideal for writers, couples, and dog owners seeking solitude in the pines.',
    neighborhoodOverview:
      'Located in Moonridge on a quiet wooded hillside bordering Sugarloaf trailheads and close to Bear Mountain.',
    highlights: [
      'Cast-iron wood stove with seasoned firewood included',
      'Quiet pine-shaded deck for stargazing',
      'Work-ready desk overlooking Jeffrey pines',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'lucas-bennett',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'carmel-dune-beach-house',
    title: 'Coastal Glass Beach House',
    category: 'beach',
    location: {
      display: 'Carmel, CA',
      city: 'Carmel',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.beachA, alt: 'Coastal glass beach house with bright modern facade'},
      {url: P.intD, alt: 'Airy living space with ocean daylight and clean lines'},
      {url: P.intJ, alt: 'Minimalist white oak kitchen steps from the beach'},
    ],
    pricePerNight: 365,
    maxGuests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    petFriendly: true,
    amenities: ['beachfront', 'fast-wifi', 'free-parking', 'fireplace', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Cypress Suite', bedDetails: '1 King bed'},
      {roomName: 'Dune Room', bedDetails: '1 Queen bed'},
      {roomName: 'Sunroom', bedDetails: '1 Daybed'},
    ],
    rating: 4.9,
    reviewCount: 195,
    tagline: 'Bright oceanfront beach house steps from white sand with dog-friendly patio.',
    description:
      'Bright oceanfront beach house steps from white sand, featuring floor-to-ceiling coastal views, heated outdoor rinse shower, gas fireplace, and dog-friendly courtyard patio. Walk barefoot to Carmel Beach at sunrise and downtown cafes at dusk.',
    neighborhoodOverview:
      'Quiet Carmel-by-the-Sea block two minutes on foot from dog-friendly white sands and cypress paths.',
    highlights: [
      'Warm outdoor shower for rinsing off sand and paws',
      'Private 2-car driveway off Scenic Road',
      'Gas hearth and ocean-breeze glass doors',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'devon-brooks',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'driveway-parking-guidelines',
    ],
  },
  {
    slug: 'soho-sunlit-city-loft',
    title: 'Sunlit Architectural Loft',
    category: 'city',
    location: {
      display: 'New York, NY',
      city: 'New York',
      region: 'NY',
      country: 'United States',
    },
    images: [
      {url: P.cityA, alt: 'Sunlit architectural loft living room in SoHo'},
      {url: P.intE, alt: 'Dedicated remote work table in quiet city apartment'},
    ],
    pricePerNight: 295,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    petFriendly: false,
    amenities: ['fast-wifi', 'city-skyline', 'dedicated-workspace'],
    sleepingArrangements: [{roomName: 'Primary Loft', bedDetails: '1 Queen bed'}],
    rating: 4.8,
    reviewCount: 284,
    tagline: 'Quiet top-floor SoHo loft with 12-foot ceilings, acoustic glass, and work desk.',
    description:
      'Quiet top-floor city apartment with 12-foot ceilings, triple-pane acoustic glass windows, espresso bar, and dedicated remote-work desk. Enjoy calm silence above cobblestone streets with subway lines two blocks away.',
    neighborhoodOverview:
      'Historic cast-iron district in SoHo, surrounded by galleries, bakeries, and quiet morning coffee spots.',
    highlights: [
      'Triple-pane acoustic windows for whisper-quiet sleep',
      'Dedicated studio desk with external monitor dock',
      '12-foot timber beams and skylight exposure',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'marcus-vance',
    policySlugs: [
      'flexible-cancellation-48h',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
      'no-parties-no-smoking',
    ],
  },
  {
    slug: 'aspen-snow-chalet',
    title: 'Timber Ridge Chalet',
    category: 'cabins',
    location: {
      display: 'Aspen, CO',
      city: 'Aspen',
      region: 'CO',
      country: 'United States',
    },
    images: [
      {url: P.cabinD, alt: 'Timber Ridge Chalet nestled in snowy pines'},
      {url: P.intA, alt: 'Warm fireplace lounge with cedar beams'},
    ],
    pricePerNight: 275,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    petFriendly: true,
    amenities: ['hot-tub', 'fireplace', 'free-parking', 'fast-wifi', 'forest-trail'],
    sleepingArrangements: [
      {roomName: 'Aspen Suite', bedDetails: '1 King bed'},
      {roomName: 'Spruce Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 152,
    tagline: 'Warm snow-country cabin with private outdoor hot tub and pet mudroom under $300.',
    description:
      'Warm snow-country cabin with private outdoor hot tub, quiet woodland setting, stone fireplace, and pet-friendly mudroom under $300 a night. Built for snowy mornings, ski gear drying, and soaking under clear alpine stars.',
    neighborhoodOverview:
      'Peaceful grove ten minutes outside downtown Aspen near Nordic cross-country ski loops.',
    highlights: [
      'Heated mudroom with boot dryers and dog towel station',
      'Private hot tub tucked into aspen trees',
      'Heated driveway cleared every winter morning',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'noah-lindqvist',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'driveway-parking-guidelines',
    ],
    staySpecificNotes: [
      {
        title: 'Winter access',
        detail: 'Heated driveway cleared every morning; AWD or snow tires recommended November through April.',
      },
    ],
  },
  {
    slug: 'palm-springs-desert-villa',
    title: 'Mid-Century Courtyard Villa',
    category: 'villas',
    location: {
      display: 'Palm Springs, CA',
      city: 'Palm Springs',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.villaB, alt: 'Mid-century desert villa with illuminated pool courtyard'},
      {url: P.intF, alt: 'Open desert modern living space and patio glass'},
    ],
    pricePerNight: 340,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2.5,
    petFriendly: true,
    amenities: ['pool', 'hot-tub', 'free-parking', 'fast-wifi', 'patio-deck', 'dedicated-workspace'],
    sleepingArrangements: [
      {roomName: 'Casita Primary', bedDetails: '1 King bed'},
      {roomName: 'Citrus Suite', bedDetails: '1 Queen bed'},
      {roomName: 'Mountain View Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.8,
    reviewCount: 207,
    tagline: 'Architectural desert villa with saltwater pool, spa hot tub, and walled pet yard.',
    description:
      'Architectural desert villa featuring saltwater pool, spa hot tub, shaded citrus courtyard, remote-work alcove, and private walled yard for pets. Floor-to-ceiling sliders frame San Jacinto mountain silhouettes.',
    neighborhoodOverview:
      'Quiet Twin Palms mid-century enclave close to desert canyon trails and Design District cafes.',
    highlights: [
      'Fully walled desert courtyard safe for dogs',
      'Heated saltwater pool and raised spillover spa',
      'Citrus trees and shaded outdoor dining pergola',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'claire-dubois',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
      'no-parties-no-smoking',
    ],
    staySpecificNotes: [
      {
        title: 'Outdoor noise ordinance',
        detail: 'City of Palm Springs ordinance prohibits outdoor amplified music at all hours.',
      },
    ],
  },
  {
    slug: 'tahoe-cedar-sanctuary',
    title: 'Cedar Grove Spa Cabin',
    category: 'cabins',
    location: {
      display: 'South Lake Tahoe, CA',
      city: 'South Lake Tahoe',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.cabinE, alt: 'Warm wood cabin exterior among Tahoe pines'},
      {url: P.intG, alt: 'Inviting cedar cabin living room and hearth'},
    ],
    pricePerNight: 260,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    petFriendly: true,
    amenities: ['hot-tub', 'fireplace', 'fast-wifi', 'free-parking', 'dedicated-workspace'],
    sleepingArrangements: [
      {roomName: 'Timber Primary', bedDetails: '1 King bed'},
      {roomName: 'Trail Bunk Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 176,
    tagline: 'Quiet Tahoe cabin under $300 with cedar hot tub, dog bowls, and fast Wi-Fi.',
    description:
      'Peaceful Tahoe retreat tucked beneath sugar pines with a steaming outdoor hot tub, gas hearth, dedicated standing desk, and dog-friendly mudroom under $300 a night. Close to alpine beaches yet worlds away from main road noise.',
    neighborhoodOverview:
      'Quiet Montgomery Estates wooded cul-de-sac five minutes from Fallen Leaf Lake trails.',
    highlights: [
      'Private hot tub tucked under mature pines',
      'Sit-stand remote work desk and gigabit Wi-Fi',
      'No pet fee for up to two dogs',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'maya-chen',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'hood-river-moss-cabin',
    title: 'Moss Creek Timber Cabin',
    category: 'cabins',
    location: {
      display: 'Hood River, OR',
      city: 'Hood River',
      region: 'OR',
      country: 'United States',
    },
    images: [
      {url: P.cabinA, alt: 'Moss Creek cabin nestled beside Pacific Northwest pines'},
      {url: P.intC, alt: 'Bright timber kitchen and dining space'},
    ],
    pricePerNight: 245,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    petFriendly: true,
    amenities: ['hot-tub', 'wood-stove', 'forest-trail', 'free-parking', 'fast-wifi'],
    sleepingArrangements: [
      {roomName: 'Creekside Room', bedDetails: '1 Queen bed'},
      {roomName: 'Upper Loft', bedDetails: '1 Queen bed'},
    ],
    rating: 4.8,
    reviewCount: 141,
    tagline: 'Secluded gorge cabin with soaking hot tub, creek soundtrack, and orchard views.',
    description:
      'Secluded Pacific Northwest cabin listening to Moss Creek below, equipped with an outdoor cedar hot tub, cast-iron wood stove, and fast Wi-Fi under $250 a night. Dogs love the mossy trail loop right outside the porch.',
    neighborhoodOverview:
      'Quiet hillside road in the Columbia River Gorge, ten minutes from Hood River farmstands and trails.',
    highlights: [
      'Creekside cedar hot tub surrounded by ferns',
      'Wood-burning stove with local alder firewood',
      'Off-street gravel parking for two vehicles',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'noah-lindqvist',
    policySlugs: [
      'flexible-cancellation-48h',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'jackson-hole-elk-refuge',
    title: 'Teton Meadow Log Cabin',
    category: 'cabins',
    location: {
      display: 'Wilson, WY',
      city: 'Wilson',
      region: 'WY',
      country: 'United States',
    },
    images: [
      {url: P.cabinB, alt: 'Log cabin framed by Teton mountain meadow'},
      {url: P.intH, alt: 'Vaulted log beam interior with mountain light'},
    ],
    pricePerNight: 410,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    petFriendly: false,
    amenities: ['hot-tub', 'fireplace', 'free-parking', 'chef-kitchen', 'forest-trail'],
    sleepingArrangements: [
      {roomName: 'Teton Suite', bedDetails: '1 King bed'},
      {roomName: 'Meadow Room', bedDetails: '1 Queen bed'},
      {roomName: 'Loft Suite', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 98,
    tagline: 'Handcrafted log cabin facing quiet Teton meadows with soaking tub and stone hearth.',
    description:
      'Handcrafted log cabin overlooking quiet Teton meadows where moose wander at dusk, with a private hot tub, river-rock fireplace, chef kitchen, and unobstructed mountain sky.',
    neighborhoodOverview:
      'Serene rural Wilson lane midway between Teton Village slopes and downtown Jackson.',
    highlights: [
      'Unobstructed Teton Range views from the hot tub',
      'River-rock wood fireplace and timber beams',
      'Private heated 2-car garage',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    hostSlug: 'lucas-bennett',
    policySlugs: [
      'firm-cancellation-14d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'driveway-parking-guidelines',
    ],
  },
  {
    slug: 'sedona-red-rock-cabin',
    title: 'Oak Creek Canyon Cabin',
    category: 'cabins',
    location: {
      display: 'Sedona, AZ',
      city: 'Sedona',
      region: 'AZ',
      country: 'United States',
    },
    images: [
      {url: P.cabinD, alt: 'Secluded canyon cabin surrounded by sycamores and red rock'},
      {url: P.intI, alt: 'Warm canyon cabin bedroom opening to terrace'},
    ],
    pricePerNight: 265,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    petFriendly: true,
    amenities: ['hot-tub', 'firepit', 'free-parking', 'dedicated-workspace', 'fast-wifi', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Canyon Primary', bedDetails: '1 King bed'},
      {roomName: 'Creek Guest Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.8,
    reviewCount: 189,
    tagline: 'Quiet creekside canyon cabin with stargazing hot tub and dog-friendly deck under $300.',
    description:
      'Quiet canyon cabin shaded by sycamore trees along Oak Creek, featuring a private hot tub, dark-sky firepit, fast Wi-Fi workspace, and shaded dog patio under $300 a night.',
    neighborhoodOverview:
      'Tucked in upper Oak Creek Canyon, steps from red-rock swimming holes and West Fork trails.',
    highlights: [
      'Dark-sky certified stargazing deck and firepit',
      'Private hot tub beside sycamore canopy',
      'Dedicated work nook with high-speed Wi-Fi',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'sofia-martinez',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'blue-ridge-ridgeback-cabin',
    title: 'Blue Ridge Mist Cabin',
    category: 'cabins',
    location: {
      display: 'Asheville, NC',
      city: 'Asheville',
      region: 'NC',
      country: 'United States',
    },
    images: [
      {url: P.cabinC, alt: 'Elevated forest cabin overlooking Blue Ridge mountains'},
      {url: P.intD, alt: 'Cozy cabin living area with ridge views'},
    ],
    pricePerNight: 215,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    petFriendly: true,
    amenities: ['hot-tub', 'firepit', 'fast-wifi', 'free-parking', 'patio-deck', 'forest-trail'],
    sleepingArrangements: [
      {roomName: 'Ridge Primary', bedDetails: '1 King bed'},
      {roomName: 'Woodland Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 254,
    tagline: 'Secluded Appalachian cabin with mountain-mist hot tub and fenced dog run under $220.',
    description:
      'Quiet woodland cabin perched above Pisgah ridges with a covered hot tub, stone firepit, fenced dog yard, and crisp mountain mornings under $220 a night.',
    neighborhoodOverview:
      'Quiet ridge road 15 minutes from downtown Asheville breweries and Blue Ridge Parkway overlooks.',
    highlights: [
      'Covered deck hot tub overlooking misty ridges',
      'Fenced lower yard for off-leash dog play',
      'Easy paved driveway access year-round',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'maya-chen',
    policySlugs: [
      'flexible-cancellation-48h',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'no-parties-no-smoking',
    ],
  },
  {
    slug: 'big-sur-redwood-shore-house',
    title: 'Big Sur Bluff Cottage',
    category: 'beach',
    location: {
      display: 'Big Sur, CA',
      city: 'Big Sur',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.beachB, alt: 'Coastal bluff cottage above crashing Pacific waves'},
      {url: P.intA, alt: 'Redwood-lined interior looking toward ocean fog'},
    ],
    pricePerNight: 395,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    petFriendly: false,
    amenities: ['beachfront', 'wood-stove', 'patio-deck', 'free-parking', 'fast-wifi'],
    sleepingArrangements: [
      {roomName: 'Coast Primary', bedDetails: '1 King bed'},
      {roomName: 'Redwood Loft', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 132,
    tagline: 'Redwood coastal bluff cottage with wood stove and panoramic Pacific deck.',
    description:
      'Quiet redwood and glass coastal cottage suspended above Big Sur coves, with a wood-burning stove, Starlink Wi-Fi, and private ocean-view deck for morning coffee above the surf.',
    neighborhoodOverview:
      'Secluded coastal stretch near Garrapata trails and dramatic Big Sur headlands.',
    highlights: [
      'Unobstructed ocean cliff sunset terrace',
      'Redwood-paneled sitting room and wood stove',
      'Private gated parking pad off Highway 1',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'devon-brooks',
    policySlugs: [
      'firm-cancellation-14d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'santa-barbara-mesa-bungalow',
    title: 'Mesa Palms Surf Bungalow',
    category: 'beach',
    location: {
      display: 'Santa Barbara, CA',
      city: 'Santa Barbara',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.beachC, alt: 'Sunlit beach bungalow surrounded by palms'},
      {url: P.intB, alt: 'Breezy coastal bungalow living and dining space'},
    ],
    pricePerNight: 285,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    petFriendly: true,
    amenities: ['beachfront', 'fast-wifi', 'dedicated-workspace', 'free-parking', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Palm Suite', bedDetails: '1 Queen bed'},
      {roomName: 'Surf Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.8,
    reviewCount: 168,
    tagline: 'Dog-friendly coastal bungalow five-minute walk to Leadbetter Beach under $300.',
    description:
      'Sunny coastal bungalow on the Santa Barbara Mesa with surfboard rack, private fenced garden patio for dogs, dedicated desk nook, and ocean breezes under $300 a night.',
    neighborhoodOverview:
      'Walkable Mesa street steps from Hendrys dog beach, Douglas Preserve trails, and taco stands.',
    highlights: [
      'Five-minute stroll to off-leash dog beach',
      'Private hammock garden and outdoor shower',
      'Dedicated workspace and driveway parking',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'devon-brooks',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'driveway-parking-guidelines',
    ],
  },
  {
    slug: 'cannon-beach-cedar-shingle',
    title: 'Haystack Cedar Beach House',
    category: 'beach',
    location: {
      display: 'Cannon Beach, OR',
      city: 'Cannon Beach',
      region: 'OR',
      country: 'United States',
    },
    images: [
      {url: P.beachD, alt: 'Weathered cedar beach house steps from Oregon coast sand'},
      {url: P.intJ, alt: 'Warm coastal kitchen with breakfast bar'},
    ],
    pricePerNight: 290,
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    petFriendly: true,
    amenities: ['beachfront', 'fireplace', 'hot-tub', 'free-parking', 'fast-wifi'],
    sleepingArrangements: [
      {roomName: 'Ocean Primary', bedDetails: '1 King bed'},
      {roomName: 'Bunk & Queen Room', bedDetails: '1 Queen bed, 1 Twin bed'},
    ],
    rating: 4.9,
    reviewCount: 211,
    tagline: 'Cozy Oregon coast cedar cottage with hot tub and direct beach access under $300.',
    description:
      'Warm cedar-shingle beach house steps from Cannon Beach tidepools, offering a sheltered backyard hot tub, gas fireplace, pet rinse station, and cozy coastal reading nook under $300 a night.',
    neighborhoodOverview:
      'Quiet Tolovana residential lane two houses back from wide sandy beaches facing Haystack Rock.',
    highlights: [
      'Sheltered cedar courtyard with hot tub',
      'Warm paw-and-boot rinse station on side porch',
      'Two-minute sandy walk to Haystack Rock shoreline',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'noah-lindqvist',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'kauai-hanalei-lanai-home',
    title: 'Hanalei Hale Beach Cottage',
    category: 'beach',
    location: {
      display: 'Hanalei, HI',
      city: 'Hanalei',
      region: 'HI',
      country: 'United States',
    },
    images: [
      {url: P.beachE, alt: 'Tropical plantation beach cottage framed by palms'},
      {url: P.intC, alt: 'Breezy tropical living room opening onto shaded lanai'},
    ],
    pricePerNight: 430,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    petFriendly: false,
    amenities: ['beachfront', 'patio-deck', 'chef-kitchen', 'free-parking', 'fast-wifi'],
    sleepingArrangements: [
      {roomName: 'Lanai Primary', bedDetails: '1 King bed'},
      {roomName: 'Taro Garden Room', bedDetails: '1 Queen bed'},
      {roomName: 'Surf Bunk Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 147,
    tagline: 'Plantation-style coastal cottage with wrap-around lanai steps from Hanalei Bay.',
    description:
      'Airy plantation-style beach home with louvers catching trade winds, wide wrap-around lanai, outdoor lava-rock shower, and direct path to gentle surf at Hanalei Bay.',
    neighborhoodOverview:
      'Peaceful residential street between emerald mountain waterfalls and crescent white sand.',
    highlights: [
      'Two-minute walk to Hanalei Bay sandy shoreline',
      'Shaded wrap-around lanai with teak dining table',
      'Beach cruiser bikes and reef-safe gear included',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '10:00 AM',
    hostSlug: 'elena-rostova',
    policySlugs: [
      'firm-cancellation-14d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'outer-banks-dune-house',
    title: 'Duck Soundfront Dune House',
    category: 'beach',
    location: {
      display: 'Duck, NC',
      city: 'Duck',
      region: 'NC',
      country: 'United States',
    },
    images: [
      {url: P.beachA, alt: 'Soundfront coastal house with broad timber decks'},
      {url: P.intK, alt: 'Sunlit coastal kitchen overlooking water'},
    ],
    pricePerNight: 270,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2.5,
    petFriendly: true,
    amenities: ['beachfront', 'hot-tub', 'patio-deck', 'free-parking', 'fast-wifi', 'dedicated-workspace'],
    sleepingArrangements: [
      {roomName: 'Sound Primary', bedDetails: '1 King bed'},
      {roomName: 'Dune Guest Room', bedDetails: '1 Queen bed'},
      {roomName: 'Coastal Twin Room', bedDetails: '2 Twin beds'},
    ],
    rating: 4.8,
    reviewCount: 119,
    tagline: 'Quiet soundfront beach cottage with sunset hot tub and fenced yard under $300.',
    description:
      'Relaxed coastal home with private sound sunset deck, bubbling hot tub, remote-work desk, and fenced sandy yard for dogs under $300 a night. Paddleboard at sunrise and walk to ocean dunes in five minutes.',
    neighborhoodOverview:
      'Quiet cul-de-sac in Duck near the wooden soundfront boardwalk and bike paths.',
    highlights: [
      'Sunset hot tub facing Currituck Sound',
      'Fenced coastal yard and dog-friendly decks',
      'Two kayaks and stand-up paddleboard included',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    hostSlug: 'devon-brooks',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'no-parties-no-smoking',
    ],
  },
  {
    slug: 'laguna-cove-glass-retreat',
    title: 'Cove Horizon Beach Suite',
    category: 'beach',
    location: {
      display: 'Laguna Beach, CA',
      city: 'Laguna Beach',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.beachB, alt: 'Cliffside Laguna Beach coastal suite with glass sliders'},
      {url: P.intL, alt: 'Bright minimalist bedroom facing ocean breeze'},
    ],
    pricePerNight: 335,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    petFriendly: false,
    amenities: ['beachfront', 'patio-deck', 'fast-wifi', 'free-parking', 'dedicated-workspace'],
    sleepingArrangements: [{roomName: 'Ocean Glass Bedroom', bedDetails: '1 King bed'}],
    rating: 4.9,
    reviewCount: 104,
    tagline: 'Architectural coastal hideaway perched above Laguna tidepools for quiet couples.',
    description:
      'Intimate architectural beach suite overlooking quiet Laguna tidepools, featuring folding glass walls, private ocean deck, dedicated work desk, and covered carport parking.',
    neighborhoodOverview:
      'Quiet Victoria Beach pocket steps from hidden stone stairs to sandy coves.',
    highlights: [
      'Uninterrupted whitewater cove views from bed',
      'Dedicated coastal workspace with fast fiber',
      'Reserved off-street covered parking spot',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'elena-rostova',
    policySlugs: [
      'moderate-cancellation-7d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'seattle-capitol-hill-townhouse',
    title: 'Capitol Hill Courtyard Studio',
    category: 'city',
    location: {
      display: 'Seattle, WA',
      city: 'Seattle',
      region: 'WA',
      country: 'United States',
    },
    images: [
      {url: P.cityB, alt: 'Warm contemporary urban apartment with courtyard garden'},
      {url: P.intE, alt: 'Quiet reading and workspace corner in Seattle apartment'},
    ],
    pricePerNight: 185,
    maxGuests: 2,
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    petFriendly: true,
    amenities: ['fast-wifi', 'dedicated-workspace', 'free-parking', 'patio-deck'],
    sleepingArrangements: [{roomName: 'Garden Studio', bedDetails: '1 Queen bed'}],
    rating: 4.8,
    reviewCount: 162,
    tagline: 'Quiet tree-lined city studio under $200 with private patio and free parking.',
    description:
      'Peaceful garden-level architectural studio on a quiet tree-lined Seattle street under $200 a night, complete with private cedar patio, dog-friendly courtyard, ergonomic desk, and dedicated driveway parking.',
    neighborhoodOverview:
      'Leafy north Capitol Hill block two blocks from Volunteer Park conservatory and neighborhood cafes.',
    highlights: [
      'Private fenced cedar patio for morning coffee or dogs',
      'Dedicated work desk with 1 Gbps fiber internet',
      'Rare reserved off-street city parking space',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'marcus-vance',
    policySlugs: [
      'flexible-cancellation-48h',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'portland-pearl-timber-loft',
    title: 'Pearl District Timber Loft',
    category: 'city',
    location: {
      display: 'Portland, OR',
      city: 'Portland',
      region: 'OR',
      country: 'United States',
    },
    images: [
      {url: P.cityC, alt: 'Timber and brick loft apartment in Portland Pearl District'},
      {url: P.intJ, alt: 'Modern chef kitchen with stainless appliances'},
    ],
    pricePerNight: 210,
    maxGuests: 4,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1.5,
    petFriendly: true,
    amenities: ['fast-wifi', 'dedicated-workspace', 'free-parking', 'ev-charger', 'city-skyline'],
    sleepingArrangements: [
      {roomName: 'Timber Suite', bedDetails: '1 King bed'},
      {roomName: 'Alcove Lounge', bedDetails: '1 Queen sofa sleeper'},
    ],
    rating: 4.9,
    reviewCount: 148,
    tagline: 'Converted warehouse loft with exposed Douglas fir beams and EV garage spot.',
    description:
      'Warm converted warehouse loft in Portland featuring heavy Douglas fir beams, quiet courtyard exposure, ergonomic dual-screen desk setup, and secure underground garage parking with EV charging under $220 a night.',
    neighborhoodOverview:
      'Walkable Pearl District blocks from Powell Books, Tanner Springs Park, and streetcar lines.',
    highlights: [
      'Heavy-timber warehouse architecture with quiet courtyard',
      'Secure underground parking with EV charger',
      'Walk Score 98 near parks and coffee roasters',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'marcus-vance',
    policySlugs: [
      'flexible-cancellation-48h',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'no-parties-no-smoking',
    ],
  },
  {
    slug: 'austin-south-congress-casita',
    title: 'South Congress Garden Casita',
    category: 'city',
    location: {
      display: 'Austin, TX',
      city: 'Austin',
      region: 'TX',
      country: 'United States',
    },
    images: [
      {url: P.cityD, alt: 'Bright modern Austin casita with oak-shaded deck'},
      {url: P.intF, alt: 'Minimalist living space with clerestory windows'},
    ],
    pricePerNight: 225,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    petFriendly: true,
    amenities: ['fast-wifi', 'dedicated-workspace', 'free-parking', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Casita Bedroom', bedDetails: '1 King bed'},
      {roomName: 'Sun Lounge', bedDetails: '1 Twin daybed'},
    ],
    rating: 4.8,
    reviewCount: 193,
    tagline: 'Quiet live-oak city casita steps from South Congress with fenced dog courtyard.',
    description:
      'Tucked behind heritage live oaks off South Congress, this quiet standalone casita offers zero shared walls, fenced turf yard for dogs, fast fiber workspace, and driveway parking under $250 a night.',
    neighborhoodOverview:
      'Quiet Travis Heights pocket a five-minute stroll from Lady Bird Lake trails and South Congress.',
    highlights: [
      'Standalone casita with zero shared walls',
      'Private shaded courtyard safe for dogs',
      'Fast fiber Wi-Fi and shaded porch seating',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'sofia-martinez',
    policySlugs: [
      'flexible-cancellation-48h',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'san-francisco-mission-terrace',
    title: 'Mission Sun Terrace Flat',
    category: 'city',
    location: {
      display: 'San Francisco, CA',
      city: 'San Francisco',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.cityE, alt: 'Sunlit Edwardian flat living room in San Francisco'},
      {url: P.intD, alt: 'Clean bright workspace and dining area'},
    ],
    pricePerNight: 275,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    petFriendly: false,
    amenities: ['fast-wifi', 'dedicated-workspace', 'city-skyline', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Garden Primary', bedDetails: '1 Queen bed'},
      {roomName: 'Study Bedroom', bedDetails: '1 Queen bed'},
    ],
    rating: 4.7,
    reviewCount: 138,
    tagline: 'Quiet top-floor Dolores Park flat with sunny rooftop deck and dual work desks.',
    description:
      'Top-floor Edwardian flat in the sunny Mission belt with private south-facing deck, panoramic city hills view, two quiet remote-work desks, and sound-insulated bedrooms under $300 a night.',
    neighborhoodOverview:
      'Steps from Dolores Park, Valencia Street bakeries, and BART transit.',
    highlights: [
      'Private sunny deck with Twin Peaks views',
      'Two separate workspaces for remote pairs',
      'Quiet rear bedrooms facing lush garden',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'maya-chen',
    policySlugs: [
      'moderate-cancellation-7d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'chicago-west-loop-residence',
    title: 'West Loop Brick & Glass Loft',
    category: 'city',
    location: {
      display: 'Chicago, IL',
      city: 'Chicago',
      region: 'IL',
      country: 'United States',
    },
    images: [
      {url: P.cityA, alt: 'Industrial brick and glass loft in West Loop Chicago'},
      {url: P.intK, alt: 'Open chef kitchen inside brick loft'},
    ],
    pricePerNight: 240,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    petFriendly: true,
    amenities: ['fast-wifi', 'dedicated-workspace', 'free-parking', 'city-skyline', 'chef-kitchen'],
    sleepingArrangements: [
      {roomName: 'Skyline Primary', bedDetails: '1 King bed'},
      {roomName: 'Brick Guest Suite', bedDetails: '1 Queen bed'},
    ],
    rating: 4.8,
    reviewCount: 175,
    tagline: 'Quiet brick loft with heated garage spot, chef kitchen, and skyline glass under $250.',
    description:
      'Spacious Chicago brick loft featuring acoustic factory windows, chef-grade island kitchen, dedicated office nook, pet-friendly layout, and heated indoor garage parking under $250 a night.',
    neighborhoodOverview:
      'Steps from Randolph Street restaurants, Fulton Market, and Mary Bartelme dog park.',
    highlights: [
      'Heated indoor garage parking spot included',
      'Soundproofed industrial steel-frame windows',
      'Walkable to Mary Bartelme Park dog run',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'marcus-vance',
    policySlugs: [
      'flexible-cancellation-48h',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'no-parties-no-smoking',
    ],
  },
  {
    slug: 'boston-back-bay-brownstone',
    title: 'Back Bay Quiet Brownstone',
    category: 'city',
    location: {
      display: 'Boston, MA',
      city: 'Boston',
      region: 'MA',
      country: 'United States',
    },
    images: [
      {url: P.cityB, alt: 'Classic brownstone parlor living room in Back Bay Boston'},
      {url: P.intL, alt: 'Tranquil tall-window bedroom with crisp linens'},
    ],
    pricePerNight: 295,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    petFriendly: false,
    amenities: ['fast-wifi', 'dedicated-workspace', 'fireplace', 'city-skyline'],
    sleepingArrangements: [
      {roomName: 'Commonwealth Primary', bedDetails: '1 King bed'},
      {roomName: 'Library Suite', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 121,
    tagline: 'Restored Commonwealth Ave brownstone flat with tall windows and quiet library desk.',
    description:
      'Sunlight fills this restored Back Bay brownstone residence overlooking the Commonwealth Avenue Mall, offering high ceilings, decorative marble hearth, silent library workspace, and fast Wi-Fi under $300 a night.',
    neighborhoodOverview:
      'Tree-lined Commonwealth Avenue steps from Newbury Street, Copley Square, and Charles River paths.',
    highlights: [
      'Overlooks shaded Commonwealth Ave promenade',
      'Quiet dedicated study desk with fast Wi-Fi',
      'Keyless elevator access in historic brownstone',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'claire-dubois',
    policySlugs: [
      'moderate-cancellation-7d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
      'no-parties-no-smoking',
    ],
  },
  {
    slug: 'napa-vineyard-stone-villa',
    title: 'St. Helena Vineyard Villa',
    category: 'villas',
    location: {
      display: 'St. Helena, CA',
      city: 'St. Helena',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.villaC, alt: 'Limestone Napa Valley villa beside private pool and vineyards'},
      {url: P.intC, alt: 'Indoor-outdoor limestone dining room and terrace'},
    ],
    pricePerNight: 540,
    maxGuests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3.5,
    petFriendly: false,
    amenities: ['pool', 'hot-tub', 'chef-kitchen', 'free-parking', 'ev-charger', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Vineyard Primary', bedDetails: '1 King bed'},
      {roomName: 'Olive Grove Suite', bedDetails: '1 King bed'},
      {roomName: 'Oak Guest Room', bedDetails: '1 Queen bed'},
      {roomName: 'Cabana Suite', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 112,
    tagline: 'Private limestone wine-country villa with lap pool, hot tub, and olive grove terrace.',
    description:
      'Secluded Napa Valley limestone villa framed by heritage olive trees and vineyard hills, with a heated lap pool, cedar spa hot tub, outdoor wood-fired pizza oven, chef kitchen, and EV charger.',
    neighborhoodOverview:
      'Quiet Silverado Trail country lane minutes from St. Helena bakeries and tasting rooms.',
    highlights: [
      'Heated saltwater pool and cedar soaking spa',
      'Covered pergola with outdoor dining for eight',
      'Dual EV chargers on gated gravel motor court',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'claire-dubois',
    policySlugs: [
      'firm-cancellation-14d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
      'driveway-parking-guidelines',
    ],
  },
  {
    slug: 'scottsdale-canyon-modern-villa',
    title: 'Pinnacle Peak Desert Villa',
    category: 'villas',
    location: {
      display: 'Scottsdale, AZ',
      city: 'Scottsdale',
      region: 'AZ',
      country: 'United States',
    },
    images: [
      {url: P.villaD, alt: 'Modern desert glass villa with glowing pool at twilight'},
      {url: P.intH, alt: 'Vaulted desert modern living space'},
    ],
    pricePerNight: 425,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3.5,
    petFriendly: true,
    amenities: ['infinity-pool', 'hot-tub', 'firepit', 'free-parking', 'chef-kitchen', 'dedicated-workspace'],
    sleepingArrangements: [
      {roomName: 'Saguaro Primary', bedDetails: '1 King bed'},
      {roomName: 'Mesa Suite', bedDetails: '1 King bed'},
      {roomName: 'Canyon Room', bedDetails: '1 Queen bed'},
      {roomName: 'Bunk Casita', bedDetails: '2 Queen beds'},
    ],
    rating: 4.9,
    reviewCount: 158,
    tagline: 'Architectural desert villa with zero-edge pool, sunken firepit, and dog-friendly yard.',
    description:
      'Dramatic desert villa nestled among giant saguaros near Pinnacle Peak, featuring zero-edge infinity pool, hot tub, sunken courtyard firepit, chef kitchen, quiet study, and enclosed desert garden for dogs.',
    neighborhoodOverview:
      'Quiet North Scottsdale desert preserve foothills minutes from McDowell Sonoran trailheads.',
    highlights: [
      'Zero-edge heated pool facing desert boulders',
      'Sunken gas firepit lounge for evening stargazing',
      'Enclosed courtyard patio safe for pets',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'sofia-martinez',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
  {
    slug: 'healdsburg-redwood-courtyard-villa',
    title: 'Dry Creek Oak Villa',
    category: 'villas',
    location: {
      display: 'Healdsburg, CA',
      city: 'Healdsburg',
      region: 'CA',
      country: 'United States',
    },
    images: [
      {url: P.villaE, alt: 'Sonoma modern farmhouse villa with pool and oak trees'},
      {url: P.intK, alt: 'Sunlit country kitchen with marble island'},
    ],
    pricePerNight: 390,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2.5,
    petFriendly: true,
    amenities: ['pool', 'hot-tub', 'chef-kitchen', 'free-parking', 'fast-wifi', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Oak Primary', bedDetails: '1 King bed'},
      {roomName: 'Meadow Suite', bedDetails: '1 Queen bed'},
      {roomName: 'Orchard Room', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 134,
    tagline: 'Sonoma modern oak villa with heated pool, hot tub, and fenced orchard for dogs.',
    description:
      'Quiet Sonoma wine-country villa surrounded by valley oaks and lavender, featuring a heated pool, cedar hot tub, bright chef kitchen, and fenced half-acre meadow where dogs can stretch their legs.',
    neighborhoodOverview:
      'Peaceful Dry Creek Valley bike route seven minutes from Healdsburg Plaza.',
    highlights: [
      'Fenced oak meadow welcome for up to two dogs',
      'Heated pool and cedar soaking tub',
      'Shaded veranda for farm-to-table dinners',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'claire-dubois',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'driveway-parking-guidelines',
    ],
  },
  {
    slug: 'maui-wailea-ocean-villa',
    title: 'Wailea Sunset Pavilion Villa',
    category: 'villas',
    location: {
      display: 'Wailea, HI',
      city: 'Wailea',
      region: 'HI',
      country: 'United States',
    },
    images: [
      {url: P.villaA, alt: 'Tropical open-air oceanfront villa with pool'},
      {url: P.intF, alt: 'Open-air island pavilion living area'},
    ],
    pricePerNight: 640,
    maxGuests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    petFriendly: false,
    amenities: ['infinity-pool', 'hot-tub', 'chef-kitchen', 'beachfront', 'free-parking', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Ocean Pavilion', bedDetails: '1 King bed'},
      {roomName: 'Plumeria Suite', bedDetails: '1 King bed'},
      {roomName: 'Palm Suite', bedDetails: '1 Queen bed'},
      {roomName: 'Garden Ohana', bedDetails: '1 Queen bed'},
    ],
    rating: 5.0,
    reviewCount: 89,
    tagline: 'Open-air Wailea oceanfront pavilion villa with infinity pool and coral cove sunsets.',
    description:
      'Serene open-air island villa with retracting mahogany pocket walls, infinity pool merging into Pacific blues, spa hot tub, gourmet kitchen, and direct path to quiet snorkeling coves.',
    neighborhoodOverview:
      'Gated Wailea coastal enclave along the scenic oceanfront boardwalk.',
    highlights: [
      'Retractable pocket doors for seamless ocean breeze',
      'Infinity pool and raised tropical hot tub',
      'Five-minute walk to sandy snorkeling cove',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'elena-rostova',
    policySlugs: [
      'firm-cancellation-14d',
      'no-pets-permitted',
      'self-checkin-smart-keypad',
      'no-parties-no-smoking',
    ],
  },
  {
    slug: 'santa-fe-adobe-courtyard-villa',
    title: 'Canyon Road Adobe Villa',
    category: 'villas',
    location: {
      display: 'Santa Fe, NM',
      city: 'Santa Fe',
      region: 'NM',
      country: 'United States',
    },
    images: [
      {url: P.villaB, alt: 'Warm adobe villa courtyard illuminated at dusk'},
      {url: P.intG, alt: 'Kiva fireplace living room with viga ceilings'},
    ],
    pricePerNight: 295,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2.5,
    petFriendly: true,
    amenities: ['hot-tub', 'fireplace', 'free-parking', 'fast-wifi', 'dedicated-workspace', 'patio-deck'],
    sleepingArrangements: [
      {roomName: 'Sangre Primary', bedDetails: '1 King bed'},
      {roomName: 'Adobe Courtyard Room', bedDetails: '1 Queen bed'},
      {roomName: 'Piñon Studio', bedDetails: '1 Queen bed'},
    ],
    rating: 4.9,
    reviewCount: 166,
    tagline: 'Restored adobe villa with kiva fireplace, walled courtyard hot tub, and dog garden under $300.',
    description:
      'Quiet historic adobe villa off Canyon Road featuring beamed viga ceilings, wood-burning kiva fireplace, private courtyard hot tub, remote-work study, and enclosed adobe-walled garden for dogs under $300 a night.',
    neighborhoodOverview:
      'Tranquil dirt lane off upper Canyon Road galleries, minutes from Dale Ball hiking trails.',
    highlights: [
      'Hand-plastered kiva fireplace and viga ceilings',
      'Walled courtyard hot tub under high-desert stars',
      'Walkable to Canyon Road galleries and trails',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostSlug: 'sofia-martinez',
    policySlugs: [
      'moderate-cancellation-7d',
      'pets-welcome-up-to-2',
      'self-checkin-smart-keypad',
      'quiet-hours-10pm-7am',
    ],
  },
]
