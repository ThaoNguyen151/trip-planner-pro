type Coordinates = { latitude: number; longitude: number };

function geolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location permission denied. Allow access in browser settings.";
    case 2:
      return "Could not determine your position. Try again outdoors or check GPS.";
    case 3:
      return "Location request timed out. Please try again.";
    default:
      return "Unable to get current location.";
  }
}

export function getCurrentCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported on this device."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => reject(new Error(geolocationErrorMessage(err.code))),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    );
  });
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "TripPlannerPro/1.0",
      "Accept-Language":
        typeof navigator !== "undefined"
          ? navigator.language
          : "en",
    },
  });

  if (!res.ok) {
    throw new Error("Could not resolve address from coordinates.");
  }

  const data = (await res.json()) as { display_name?: string };
  const name = data.display_name?.trim();
  if (!name) {
    throw new Error("No address found for this position.");
  }
  return name;
}

function formatCoordinates(lat: number, lon: number): string {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

/** Current GPS position as a human-readable address (falls back to coordinates). */
export async function getCurrentLocationLabel(): Promise<string> {
  const { latitude, longitude } = await getCurrentCoordinates();
  try {
    return await reverseGeocode(latitude, longitude);
  } catch {
    return formatCoordinates(latitude, longitude);
  }
}
