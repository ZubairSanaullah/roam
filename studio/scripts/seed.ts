import {getCliClient} from 'sanity/cli'
import {HOSTS_SEED, POLICIES_SEED, STAYS_SEED} from './seedData'

const API_VERSION = '2026-02-01'

function filenameForUrl(url: string): string {
  const match = url.match(/\/(photo-[^?]+)/)
  const stem = match ? match[1] : Buffer.from(url).toString('base64url').slice(0, 24)
  return `roam-${stem}.jpg`
}

async function main() {
  const client = getCliClient({apiVersion: API_VERSION})

  console.log('Checking existing Sanity image assets...')
  const existingAssets = await client.fetch<{_id: string; originalFilename?: string}[]>(
    `*[_type == "sanity.imageAsset" && defined(originalFilename)]{ _id, originalFilename }`,
  )
  const assetIdByFilename = new Map<string, string>()
  const inflightByFilename = new Map<string, Promise<string>>()
  for (const asset of existingAssets) {
    if (asset.originalFilename && !assetIdByFilename.has(asset.originalFilename)) {
      assetIdByFilename.set(asset.originalFilename, asset._id)
    }
  }

  async function ensureImageAsset(url: string): Promise<string> {
    const filename = filenameForUrl(url)
    const cached = assetIdByFilename.get(filename)
    if (cached) return cached

    const existingPromise = inflightByFilename.get(filename)
    if (existingPromise) return existingPromise

    const uploadPromise = (async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch seed image ${url}: HTTP ${response.status}`)
      }
      const contentType = response.headers.get('content-type') || 'image/jpeg'
      const buffer = Buffer.from(await response.arrayBuffer())
      const uploaded = await client.assets.upload('image', buffer, {
        filename,
        contentType,
      })
      assetIdByFilename.set(filename, uploaded._id)
      return uploaded._id
    })()

    inflightByFilename.set(filename, uploadPromise)
    try {
      return await uploadPromise
    } finally {
      inflightByFilename.delete(filename)
    }
  }

  const counts = {
    hostsCreated: 0,
    hostsUpdated: 0,
    policiesCreated: 0,
    policiesUpdated: 0,
    staysCreated: 0,
    staysUpdated: 0,
  }

  // 1. Upsert shared hosts (Sanity generates _id on create; lookups use slug.current)
  const hostIdBySlug = new Map<string, string>()
  for (const host of HOSTS_SEED) {
    const avatarAssetId = await ensureImageAsset(host.avatarUrl)
    const payload = {
      name: host.name,
      slug: {_type: 'slug' as const, current: host.slug},
      avatar: {
        _type: 'image' as const,
        alt: host.avatarAlt,
        asset: {_type: 'reference' as const, _ref: avatarAssetId},
      },
      bio: host.bio,
      isSuperhost: host.isSuperhost,
      responseTime: host.responseTime,
      languages: host.languages,
      memberSince: host.memberSince,
    }

    const existing = await client.fetch<{_id: string} | null>(
      `*[_type == "host" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ _id }`,
      {slug: host.slug},
    )

    if (existing?._id) {
      await client.patch(existing._id).set(payload).commit()
      hostIdBySlug.set(host.slug, existing._id)
      counts.hostsUpdated += 1
    } else {
      const created = await client.create({_type: 'host', ...payload})
      hostIdBySlug.set(host.slug, created._id)
      counts.hostsCreated += 1
    }
  }

  // 2. Upsert shared policies
  const policyIdBySlug = new Map<string, string>()
  for (const policy of POLICIES_SEED) {
    const payload = {
      title: policy.title,
      slug: {_type: 'slug' as const, current: policy.slug},
      category: policy.category,
      summary: policy.summary,
      exactText: policy.exactText,
    }

    const existing = await client.fetch<{_id: string} | null>(
      `*[_type == "policy" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ _id }`,
      {slug: policy.slug},
    )

    if (existing?._id) {
      await client.patch(existing._id).set(payload).commit()
      policyIdBySlug.set(policy.slug, existing._id)
      counts.policiesUpdated += 1
    } else {
      const created = await client.create({_type: 'policy', ...payload})
      policyIdBySlug.set(policy.slug, created._id)
      counts.policiesCreated += 1
    }
  }

  // 3. Upsert 30 stays linking to host and policies via _ref
  for (const stay of STAYS_SEED) {
    const hostId = hostIdBySlug.get(stay.hostSlug)
    if (!hostId) {
      throw new Error(`Missing host for slug "${stay.hostSlug}" on stay "${stay.slug}"`)
    }

    const policyRefs = stay.policySlugs.map((policySlug, index) => {
      const policyId = policyIdBySlug.get(policySlug)
      if (!policyId) {
        throw new Error(`Missing policy for slug "${policySlug}" on stay "${stay.slug}"`)
      }
      return {
        _key: `policy-${index}`,
        _type: 'reference' as const,
        _ref: policyId,
      }
    })

    const imageFields = await Promise.all(
      stay.images.map(async (img, index) => {
        const assetId = await ensureImageAsset(img.url)
        return {
          _key: `image-${index}`,
          _type: 'image' as const,
          alt: img.alt,
          asset: {_type: 'reference' as const, _ref: assetId},
        }
      }),
    )

    const payload = {
      title: stay.title,
      slug: {_type: 'slug' as const, current: stay.slug},
      category: stay.category,
      location: {
        _type: 'object' as const,
        display: stay.location.display,
        city: stay.location.city,
        region: stay.location.region,
        country: stay.location.country,
      },
      images: imageFields,
      pricePerNight: stay.pricePerNight,
      maxGuests: stay.maxGuests,
      bedrooms: stay.bedrooms,
      beds: stay.beds,
      bathrooms: stay.bathrooms,
      petFriendly: stay.petFriendly,
      amenities: stay.amenities,
      sleepingArrangements: stay.sleepingArrangements.map((room, index) => ({
        _key: `room-${index}`,
        _type: 'sleepingRoom' as const,
        roomName: room.roomName,
        bedDetails: room.bedDetails,
      })),
      rating: stay.rating,
      reviewCount: stay.reviewCount,
      tagline: stay.tagline,
      description: stay.description,
      neighborhoodOverview: stay.neighborhoodOverview,
      highlights: stay.highlights,
      checkInTime: stay.checkInTime,
      checkOutTime: stay.checkOutTime,
      host: {_type: 'reference' as const, _ref: hostId},
      policies: policyRefs,
      staySpecificNotes: (stay.staySpecificNotes ?? []).map((note, index) => ({
        _key: `note-${index}`,
        _type: 'stayNote' as const,
        title: note.title,
        detail: note.detail,
      })),
    }

    const existing = await client.fetch<{_id: string} | null>(
      `*[_type == "stay" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ _id }`,
      {slug: stay.slug},
    )

    if (existing?._id) {
      await client.patch(existing._id).set(payload).commit()
      counts.staysUpdated += 1
    } else {
      await client.create({_type: 'stay', ...payload})
      counts.staysCreated += 1
    }
  }

  const totals = await client.fetch<{
    stays: number
    hosts: number
    policies: number
    assets: number
  }>(`{
    "stays": count(*[_type == "stay" && !(_id in path("drafts.**"))]),
    "hosts": count(*[_type == "host" && !(_id in path("drafts.**"))]),
    "policies": count(*[_type == "policy" && !(_id in path("drafts.**"))]),
    "assets": count(*[_type == "sanity.imageAsset"])
  }`)

  console.log('Seed summary:', counts)
  console.log('Published dataset totals:', totals)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
