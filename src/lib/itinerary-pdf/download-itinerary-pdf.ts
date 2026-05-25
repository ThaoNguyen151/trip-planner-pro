import { buildItineraryPdfDocument } from "@/lib/itinerary-pdf/itinerary-pdf-document";
import type { ItineraryPdfPayload } from "@/lib/itinerary-pdf/types";

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "trip";
}

/** Renders itinerary PDF and triggers browser download. */
export async function downloadItineraryPdf(
  payload: ItineraryPdfPayload,
): Promise<void> {
  const doc = await buildItineraryPdfDocument({
    ...payload,
    generatedAt: payload.generatedAt ?? new Date(),
  });
  doc.save(`${slugify(payload.tripTitle)}-itinerary.pdf`);
}
