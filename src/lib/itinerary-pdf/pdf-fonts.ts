import { jsPDF } from "jspdf";

export const PDF_FONT_FAMILY = "NotoSans";

const FONT_FILES = {
  regular: {
    vfsName: "NotoSans-Regular.ttf",
    url: "/fonts/NotoSans-Regular.ttf",
  },
  bold: {
    vfsName: "NotoSans-Bold.ttf",
    url: "/fonts/NotoSans-Bold.ttf",
  },
} as const;

type FontCache = {
  regular: string;
  bold: string;
};

let fontCache: FontCache | null = null;
let fontCachePromise: Promise<FontCache> | null = null;

async function loadFontCache(): Promise<FontCache> {
  if (fontCache) return fontCache;
  if (!fontCachePromise) {
    fontCachePromise = (async () => {
      const [regular, bold] = await Promise.all([
        fetchFontBase64(FONT_FILES.regular.url),
        fetchFontBase64(FONT_FILES.bold.url),
      ]);
      fontCache = { regular, bold };
      return fontCache;
    })();
  }
  return fontCachePromise;
}

async function fetchFontBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load PDF font: ${url}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string") {
        reject(new Error("Invalid font data"));
        return;
      }
      const base64 = dataUrl.split(",")[1];
      if (!base64) {
        reject(new Error("Invalid font encoding"));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Font read failed"));
    reader.readAsDataURL(blob);
  });
}

/** Registers Noto Sans on this PDF instance (required per document in jsPDF 4). */
export async function registerPdfUnicodeFonts(doc: jsPDF): Promise<void> {
  const fonts = await loadFontCache();

  doc.addFileToVFS(FONT_FILES.regular.vfsName, fonts.regular);
  doc.addFont(FONT_FILES.regular.vfsName, PDF_FONT_FAMILY, "normal");

  doc.addFileToVFS(FONT_FILES.bold.vfsName, fonts.bold);
  doc.addFont(FONT_FILES.bold.vfsName, PDF_FONT_FAMILY, "bold");

  doc.setFont(PDF_FONT_FAMILY, "normal");
}
