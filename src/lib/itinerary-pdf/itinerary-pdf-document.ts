import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { PDF_FONT_FAMILY, registerPdfUnicodeFonts } from "@/lib/itinerary-pdf/pdf-fonts";
import { formatStartToEndTime } from "@/lib/utils";
import type { ActivityStatus } from "@/types/itinerary";

import type { ItineraryPdfPayload } from "./types";

const PAGE = {
  marginX: 14,
  marginTop: 16,
  marginBottom: 18,
  width: 210,
  height: 297,
} as const;

/** Matches `:root` light theme in `src/index.css`. */
const COLORS = {
  primary: [158, 112, 199] as [number, number, number], // #9e70c7
  primaryLight: [237, 224, 237] as [number, number, number], // #ede0ed muted
  primaryPale: [247, 238, 247] as [number, number, number], // #f7eef7 background
  text: [75, 34, 93] as [number, number, number], // #4b225d foreground
  muted: [122, 93, 138] as [number, number, number], // #7a5d8a
  border: [220, 200, 224] as [number, number, number], // #dcc8e0
  white: [255, 255, 255] as [number, number, number],
};

const STATUS_ROW: Record<
  ActivityStatus,
  { fill: [number, number, number]; text: [number, number, number] }
> = {
  Planned: { fill: [237, 224, 237], text: [122, 93, 138] },
  Confirmed: { fill: [220, 252, 231], text: [21, 128, 61] },
  Completed: { fill: [247, 238, 247], text: [158, 112, 199] },
};

const TABLE_FONT = { font: PDF_FONT_FAMILY };

function contentWidth(): number {
  return PAGE.width - PAGE.marginX * 2;
}

function drawPageFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const y = PAGE.height - 10;
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text("Trip Planner Pro · Itinerary export", PAGE.marginX, y);
  doc.text(
    `Page ${pageNumber} of ${totalPages}`,
    PAGE.width - PAGE.marginX,
    y,
    { align: "right" },
  );
}

function drawCoverHeader(doc: jsPDF, payload: ItineraryPdfPayload): number {
  let y = 40;

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE.width, 28, "F");

  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.white);
  doc.text("Trip Planner Pro", PAGE.marginX, 12);

  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(8);
  doc.text("Itinerary", PAGE.width - PAGE.marginX, 12, { align: "right" });

  doc.setTextColor(...COLORS.text);
  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(20);
  doc.text(payload.tripTitle, PAGE.marginX, y);

  y += 9;
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.muted);
  if (payload.dateRange) {
    doc.text(payload.dateRange, PAGE.marginX, y);
    y += 6;
  }

  const generated = (payload.generatedAt ?? new Date()).toLocaleString(
    "vi-VN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
  doc.setFontSize(9);
  doc.text(`Generated ${generated}`, PAGE.marginX, y);

  return y + 10;
}

function drawDayBanner(doc: jsPDF, y: number, dayLabel: string): number {
  const h = 9;
  doc.setFillColor(...COLORS.primaryLight);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(PAGE.marginX, y, contentWidth(), h, 1.5, 1.5, "FD");

  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.text(dayLabel, PAGE.marginX + 4, y + 6);

  return y + h + 4;
}

/** Builds a multi-page itinerary PDF (layout only — no download). */
export async function buildItineraryPdfDocument(
  payload: ItineraryPdfPayload,
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  await registerPdfUnicodeFonts(doc);

  let cursorY = drawCoverHeader(doc, payload);

  const totalActivities = payload.days.reduce(
    (sum, d) => sum + d.activities.length,
    0,
  );

  if (totalActivities === 0) {
    doc.setFont(PDF_FONT_FAMILY, "normal");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.text("No scheduled activities for this trip.", PAGE.marginX, cursorY);
    drawPageFooter(doc, 1, 1);
    return doc;
  }

  for (const day of payload.days) {
    if (day.activities.length === 0) continue;

    const dayLabel = `Day ${day.day % 100} — ${day.date}`;

    if (cursorY > PAGE.height - 55) {
      doc.addPage();
      cursorY = PAGE.marginTop;
    }

    cursorY = drawDayBanner(doc, cursorY, dayLabel);

    const body = day.activities.map((activity) => [
      formatStartToEndTime(activity.startTime, activity.endTime),
      activity.title,
      activity.location,
      activity.category,
      activity.priority,
      activity.status + (activity.overdue ? " · Overdue" : ""),
    ]);

    autoTable(doc, {
      startY: cursorY,
      margin: { left: PAGE.marginX, right: PAGE.marginX },
      head: [["Time", "Activity", "Location", "Category", "Priority", "Status"]],
      body,
      theme: "grid",
      styles: {
        ...TABLE_FONT,
        fontSize: 8,
        cellPadding: 2.5,
        textColor: COLORS.text,
        fillColor: COLORS.white,
        lineColor: COLORS.border,
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        ...TABLE_FONT,
        fillColor: COLORS.primaryPale,
      },
      headStyles: {
        ...TABLE_FONT,
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 42 },
        2: { cellWidth: 38 },
        3: { cellWidth: 24 },
        4: { cellWidth: 20 },
        5: { cellWidth: 22 },
      },
      didParseCell(data) {
        data.cell.styles.font = PDF_FONT_FAMILY;

        if (data.section !== "body" || data.column.index !== 5) return;
        const status = day.activities[data.row.index]?.status;
        if (!status) return;
        const palette = STATUS_ROW[status];
        data.cell.styles.fillColor = palette.fill;
        data.cell.styles.textColor = palette.text;
        data.cell.styles.fontStyle = "bold";
      },
    });

    const tableEnd = (
      doc as jsPDF & { lastAutoTable?: { finalY: number } }
    ).lastAutoTable?.finalY;
    cursorY = (tableEnd ?? cursorY) + 8;
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i += 1) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages);
  }

  return doc;
}
