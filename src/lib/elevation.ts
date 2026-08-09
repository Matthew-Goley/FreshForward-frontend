/** Minimum elevation (meters) to treat a point as land. Ocean/bay is typically 0. */
export const LAND_ELEVATION_THRESHOLD_METERS = 0.5

export function isLandElevation(elevation: number): boolean {
  return Number.isFinite(elevation) && elevation > LAND_ELEVATION_THRESHOLD_METERS
}

export async function fetchElevations(
  points: { lat: number; lng: number }[],
): Promise<number[]> {
  if (points.length === 0) return []

  const latitude = points.map((p) => p.lat).join(',')
  const longitude = points.map((p) => p.lng).join(',')
  const res = await fetch(
    `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`,
  )
  if (!res.ok) throw new Error('Could not check terrain elevation')

  const data = (await res.json()) as { elevation?: number[] }
  if (!Array.isArray(data.elevation) || data.elevation.length !== points.length) {
    throw new Error('Unexpected elevation response')
  }
  return data.elevation
}

/**
 * Move water points toward `center` until they sit on land.
 * Points already on land keep their original position.
 * On API failure, returns the original points unchanged.
 */
export async function snapPointsToLand(
  center: { lat: number; lng: number },
  points: { lat: number; lng: number }[],
  minDistanceMeters = 120,
): Promise<{ lat: number; lng: number }[]> {
  if (points.length === 0) return []

  try {
    const working = points.map((p) => ({ ...p }))
    const resolved = new Array<boolean>(points.length).fill(false)
    const distanceFractions = [1, 0.75, 0.55, 0.4, 0.28, 0.18, 0.1]

    for (const fraction of distanceFractions) {
      const unresolvedIndexes = resolved
        .map((done, index) => (done ? -1 : index))
        .filter((index) => index >= 0)

      if (unresolvedIndexes.length === 0) break

      const batch = unresolvedIndexes.map((index) => {
        if (fraction === 1) return points[index]
        return interpolateTowardCenter(
          center.lat,
          center.lng,
          points[index].lat,
          points[index].lng,
          1 - fraction,
        )
      })

      const elevations = await fetchElevations(batch)
      for (let i = 0; i < unresolvedIndexes.length; i++) {
        const index = unresolvedIndexes[i]
        if (isLandElevation(elevations[i])) {
          working[index] = batch[i]
          resolved[index] = true
        }
      }
    }

    // Last resort: pull remaining water points close to the user
    for (let index = 0; index < working.length; index++) {
      if (resolved[index]) continue
      working[index] = interpolateTowardCenter(
        center.lat,
        center.lng,
        points[index].lat,
        points[index].lng,
        0.85,
        minDistanceMeters,
        center.lat,
        center.lng,
      )
    }

    return working
  } catch {
    // Keep pins visible even if elevation lookup fails / is rate-limited
    return points.map((p) => ({ ...p }))
  }
}

function interpolateTowardCenter(
  centerLat: number,
  centerLng: number,
  pointLat: number,
  pointLng: number,
  towardCenterFraction: number,
  minDistanceMeters?: number,
  minFromLat?: number,
  minFromLng?: number,
): { lat: number; lng: number } {
  const clamped = Math.min(1, Math.max(0, towardCenterFraction))
  let lat = pointLat + (centerLat - pointLat) * clamped
  let lng = pointLng + (centerLng - pointLng) * clamped

  if (minDistanceMeters != null && minFromLat != null && minFromLng != null) {
    const dist = haversineMeters(minFromLat, minFromLng, lat, lng)
    if (dist < minDistanceMeters && dist > 0) {
      const scale = minDistanceMeters / dist
      lat = minFromLat + (lat - minFromLat) * scale
      lng = minFromLng + (lng - minFromLng) * scale
    }
  }

  return { lat, lng }
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const earthRadius = 6_371_000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * earthRadius * Math.asin(Math.sqrt(a))
}
