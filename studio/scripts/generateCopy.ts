import {getCliClient} from 'sanity/cli'

const SCHEMA_ID = '_.schemas.default'

interface StayFactRecord {
  _id: string
  title: string
  slug: string
  category: string
  location: {
    display: string
    city: string
    region: string
    country: string
  }
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  petFriendly: boolean
  amenities: string[]
  sleepingArrangements: {roomName: string; bedDetails: string}[]
  checkInTime: string
  checkOutTime: string
  imageDescriptions: string[]
  staySpecificNotes: {title: string; detail: string}[]
}

interface GeneratedCopy {
  tagline?: string
  description?: string
  neighborhoodOverview?: string
  highlights?: string[]
}

const AMENITY_LABELS: Record<string, string> = {
  'hot-tub': 'Hot Tub',
  'dedicated-workspace': 'Dedicated Workspace',
  'free-parking': 'Free Parking',
  'fast-wifi': 'Fast Wi-Fi',
  fireplace: 'Fireplace',
  firepit: 'Firepit',
  'wood-stove': 'Wood Stove',
  pool: 'Pool',
  'infinity-pool': 'Infinity Pool',
  beachfront: 'Beachfront',
  'chef-kitchen': 'Chef Kitchen',
  'forest-trail': 'Forest Trail',
  'city-skyline': 'City Skyline',
  'ev-charger': 'EV Charger',
  'patio-deck': 'Patio or Deck',
}

const AMENITY_CLAIM_PATTERNS: {slug: string; altSlugs?: string[]; pattern: RegExp; label: string}[] =
  [
    {slug: 'hot-tub', pattern: /\b(hot tub|soaking tub|jacuzzi|spa tub)\b/i, label: 'hot tub'},
    {slug: 'infinity-pool', pattern: /\b(infinity pool|zero-edge pool)\b/i, label: 'infinity pool'},
    {
      slug: 'pool',
      altSlugs: ['infinity-pool'],
      pattern: /(?<!tide)\b(swimming pool|saltwater pool|lap pool|heated pool|pool)\b/i,
      label: 'pool',
    },
    {slug: 'fireplace', pattern: /\b(fireplace|kiva hearth)\b/i, label: 'fireplace'},
    {slug: 'firepit', pattern: /\b(fire ?pit)\b/i, label: 'firepit'},
    {slug: 'wood-stove', pattern: /\b(wood[- ]stove|cast-iron stove)\b/i, label: 'wood stove'},
    {
      slug: 'ev-charger',
      pattern: /\b(ev charger|electric vehicle charger|ev charging)\b/i,
      label: 'EV charger',
    },
    {
      slug: 'dedicated-workspace',
      pattern: /\b(dedicated workspace|workspace|work desk|standing desk|office nook)\b/i,
      label: 'dedicated workspace',
    },
    {
      slug: 'free-parking',
      pattern: /\b(free parking|driveway parking|garage parking|covered carport|parking space)\b/i,
      label: 'free parking',
    },
    {slug: 'beachfront', pattern: /\b(beachfront|oceanfront|soundfront)\b/i, label: 'beachfront'},
    {slug: 'chef-kitchen', pattern: /\b(chef'?s? kitchen|gourmet kitchen)\b/i, label: 'chef kitchen'},
    {slug: 'forest-trail', pattern: /\b(forest trail|trailhead)\b/i, label: 'forest trail'},
    {slug: 'city-skyline', pattern: /\b(city skyline|skyline view)\b/i, label: 'city skyline'},
    {slug: 'fast-wifi', pattern: /\b(wi-?fi|fiber internet)\b/i, label: 'fast Wi-Fi'},
  ]

function auditGeneratedCopy(stay: StayFactRecord, copy: GeneratedCopy): string[] {
  const issues: string[] = []
  const tagline = typeof copy.tagline === 'string' ? copy.tagline.trim() : ''
  const description = typeof copy.description === 'string' ? copy.description.trim() : ''
  const neighborhoodOverview =
    typeof copy.neighborhoodOverview === 'string' ? copy.neighborhoodOverview.trim() : ''
  const highlights = Array.isArray(copy.highlights)
    ? copy.highlights.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []

  if (!tagline) issues.push('Missing tagline')
  if (tagline.length > 160) issues.push(`Tagline exceeds 160 chars (${tagline.length})`)
  if (description.length < 60) issues.push('Description too short')
  if (neighborhoodOverview.length < 25) issues.push('Neighborhood overview too short')
  if (highlights.length < 2 || highlights.length > 4) {
    issues.push(`Expected 2 to 4 highlights, got ${highlights.length}`)
  }

  const combined = [tagline, description, neighborhoodOverview, ...highlights].join(' ')

  if (combined.includes('\u2014')) {
    issues.push('Contains forbidden em dash')
  }

  if (!combined.toLowerCase().includes(stay.location.city.toLowerCase())) {
    issues.push(`Missing verified city name "${stay.location.city}"`)
  }

  // Pet policy check
  if (!stay.petFriendly) {
    const petPositivePattern =
      /\b(pet[- ]friendly|pets welcome|dogs welcome|dogs allowed|fenced.*dog|dog yard|dog run|pet mudroom|bring your dog)\b/i
    if (petPositivePattern.test(combined)) {
      issues.push('Claims pet-friendly features when petFriendly is false')
    }
    const petWordMatches = [...combined.matchAll(/\b(pet|pets|dog|dogs)\b/gi)]
    for (const match of petWordMatches) {
      const idx = match.index ?? 0
      const prefix = combined.slice(Math.max(0, idx - 24), idx).toLowerCase()
      if (!/\b(no|not|without|pet-free)\s+$/.test(prefix)) {
        issues.push(`Mentions "${match[0]}" affirmatively when petFriendly is false`)
      }
    }
  }

  // Unlisted amenity check
  const amenitySet = new Set(stay.amenities)
  for (const rule of AMENITY_CLAIM_PATTERNS) {
    const hasAmenity =
      amenitySet.has(rule.slug) || (rule.altSlugs?.some((alt) => amenitySet.has(alt)) ?? false)
    if (!hasAmenity && rule.pattern.test(combined)) {
      issues.push(`Claims "${rule.label}" (${rule.slug}) which is not in amenities`)
    }
  }

  // Numeric checks: bedrooms, beds, bathrooms, maxGuests, dollar figures
  for (const m of combined.matchAll(/\b(\d+)\s+bedrooms?\b/gi)) {
    if (Number(m[1]) !== stay.bedrooms) {
      issues.push(`Mentions ${m[1]} bedrooms but stay has ${stay.bedrooms}`)
    }
  }
  for (const m of combined.matchAll(/\b(\d+)\s+beds?\b/gi)) {
    if (Number(m[1]) !== stay.beds) {
      issues.push(`Mentions ${m[1]} beds but stay has ${stay.beds}`)
    }
  }
  for (const m of combined.matchAll(/\b(\d+(?:\.\d+)?)\s+bathrooms?\b/gi)) {
    if (Number(m[1]) !== stay.bathrooms) {
      issues.push(`Mentions ${m[1]} bathrooms but stay has ${stay.bathrooms}`)
    }
  }
  for (const m of combined.matchAll(/\b(?:up to\s+)?(\d+)\s+guests?\b/gi)) {
    if (Number(m[1]) !== stay.maxGuests) {
      issues.push(`Mentions ${m[1]} guests but stay allows ${stay.maxGuests}`)
    }
  }
  for (const m of combined.matchAll(/(under|below)?\s*\$(\d+(?:,\d{3})*)/gi)) {
    const qualifier = (m[1] || '').toLowerCase()
    const amount = Number(m[2].replace(/,/g, ''))
    if (qualifier === 'under' || qualifier === 'below') {
      if (stay.pricePerNight >= amount) {
        issues.push(`Claims under $${amount} when pricePerNight is $${stay.pricePerNight}`)
      }
    } else if (amount !== stay.pricePerNight) {
      issues.push(`Mentions $${amount} when pricePerNight is $${stay.pricePerNight}`)
    }
  }

  return issues
}

function buildInstruction(feedback: string[]): string {
  const retryNote =
    feedback.length > 0
      ? `\nFix these issues from the prior attempt: ${feedback.join('; ')}.`
      : ''

  return `Write grounded property copy for this Roam rental stay using ONLY the verified facts in $facts.

Fields to write:
1. tagline: One concise sentence under 140 characters summarizing the stay type, city, and standout verified features.
2. description: Two to three grounded sentences describing the layout, bedrooms/guests, verified amenities, and pet rule.
3. neighborhoodOverview: One to two sentences naming the exact city and region from $facts without inventing unverified street names, transit lines, distances, or landmarks.
4. highlights: Exactly 3 concise bullet strings summarizing only verified facts from $facts.

Strict rules:
- Use ONLY facts explicitly present in $facts. Do NOT invent amenities, distances, driving minutes, street names, views, appliances, Wi-Fi speeds, or landmarks not in $facts.
- If petFriendly is false, do NOT mention dogs or pets positively (either omit pets or state clearly that no pets are permitted).
- Only mention amenities listed in verifiedAmenities. Do NOT claim pool, hot tub, fireplace, firepit, wood stove, EV charger, workspace, parking, beachfront, or chef kitchen unless present in verifiedAmenities.
- Mention the exact city name from location.
- Never use em dashes (Unicode U+2014). Use commas or periods instead.${retryNote}

Verified facts:
$facts`
}

async function main() {
  const client = getCliClient({apiVersion: 'vX', useCdn: false})

  const stays = await client.fetch<StayFactRecord[]>(
    `*[_type == "stay" && !(_id in path("drafts.**"))] | order(slug.current asc){
      _id,
      title,
      "slug": slug.current,
      category,
      location,
      pricePerNight,
      maxGuests,
      bedrooms,
      beds,
      bathrooms,
      petFriendly,
      amenities,
      sleepingArrangements[]{ roomName, bedDetails },
      checkInTime,
      checkOutTime,
      "imageDescriptions": images[].alt,
      staySpecificNotes[]{ title, detail }
    }`,
  )

  console.log(`Generating and auditing copy for ${stays.length} stays via Sanity Agent Actions...`)

  let passed = 0
  const failures: {slug: string; issues: string[]}[] = []

  for (const stay of stays) {
    const facts = {
      title: stay.title,
      category: stay.category,
      location: stay.location,
      pricePerNight: stay.pricePerNight,
      maxGuests: stay.maxGuests,
      bedrooms: stay.bedrooms,
      beds: stay.beds,
      bathrooms: stay.bathrooms,
      petFriendly: stay.petFriendly,
      verifiedAmenities: stay.amenities.map((slug) => ({
        slug,
        label: AMENITY_LABELS[slug] ?? slug,
      })),
      sleepingArrangements: stay.sleepingArrangements,
      checkInTime: stay.checkInTime,
      checkOutTime: stay.checkOutTime,
      staySpecificNotes: stay.staySpecificNotes ?? [],
    }

    let feedback: string[] = []
    let accepted: GeneratedCopy | null = null

    for (let attempt = 1; attempt <= 3; attempt++) {
      const result = (await client.agent.action.generate({
        schemaId: SCHEMA_ID,
        documentId: stay._id,
        instruction: buildInstruction(feedback),
        instructionParams: {
          facts: JSON.stringify(facts, null, 2),
        },
        target: {
          include: ['tagline', 'description', 'neighborhoodOverview', 'highlights'],
          operation: 'set',
        },
        temperature: 0.1,
        noWrite: true,
      })) as GeneratedCopy

      const issues = auditGeneratedCopy(stay, result)
      if (issues.length === 0) {
        accepted = {
          tagline: result.tagline?.trim(),
          description: result.description?.trim(),
          neighborhoodOverview: result.neighborhoodOverview?.trim(),
          highlights: result.highlights?.map((item) => item.trim()),
        }
        break
      }

      console.warn(`  [retry ${attempt}/3] ${stay.slug}: ${issues.join('; ')}`)
      feedback = issues
    }

    if (!accepted) {
      failures.push({slug: stay.slug, issues: feedback})
      console.error(`  FAIL ${stay.slug}: ${feedback.join('; ')}`)
      continue
    }

    await client.patch(stay._id).set(accepted).commit()
    passed += 1
    console.log(`  OK [${passed}/${stays.length}] ${stay.slug}`)
  }

  console.log(`\nAgent Actions copy complete: ${passed}/${stays.length} passed fact-audit.`)
  if (failures.length > 0) {
    console.error('Failures:', JSON.stringify(failures, null, 2))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
