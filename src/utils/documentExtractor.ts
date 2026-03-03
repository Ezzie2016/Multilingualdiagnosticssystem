/**
 * documentExtractor.ts
 * Extracts plain text from uploaded documents for symptom analysis.
 *
 * Supported types:
 *   .txt  — read directly via FileReader
 *   .pdf  — parsed via pdfjs-dist (loaded from CDN, no install needed)
 *   .docx — parsed via mammoth (loaded from CDN, no install needed)
 *   .jpg / .png / .jpeg / .webp — converted to base64 and sent to the
 *           backend /api/analyze-image endpoint where the LLM reads it
 *
 * All functions return { text, method } where:
 *   text   = extracted symptom narrative string
 *   method = "text" | "ocr" | "image-llm" (for audit/display)
 */

export interface ExtractionResult {
  text:   string;
  method: "text" | "ocr" | "image-llm";
  fileName: string;
}

export class DocumentExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentExtractionError";
  }
}

// ─── Accepted file types ──────────────────────────────────────────────────────
export const ACCEPTED_TYPES = {
  "application/pdf":                          ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "text/plain":                               ".txt",
  "image/jpeg":                               ".jpg",
  "image/png":                                ".png",
  "image/webp":                               ".webp",
};

export const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt", ".jpg", ".jpeg", ".png", ".webp"];
export const MAX_FILE_SIZE_MB = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new DocumentExtractionError("Failed to read file."));
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new DocumentExtractionError("Failed to read text file."));
    reader.readAsText(file);
  });
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => {
      const result = reader.result as string;
      // Strip the data URL prefix: "data:image/png;base64,..."
      resolve(result.split(",")[1]);
    };
    reader.onerror = () => reject(new DocumentExtractionError("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

// ─── Load pdfjs from CDN dynamically ─────────────────────────────────────────
async function loadPdfJs(): Promise<any> {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(lib);
    };
    script.onerror = () => reject(new DocumentExtractionError("Failed to load PDF library."));
    document.head.appendChild(script);
  });
}

// ─── Load mammoth from CDN dynamically ───────────────────────────────────────
async function loadMammoth(): Promise<any> {
  if ((window as any).mammoth) return (window as any).mammoth;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    script.onload  = () => resolve((window as any).mammoth);
    script.onerror = () => reject(new DocumentExtractionError("Failed to load DOCX library."));
    document.head.appendChild(script);
  });
}

// ─── Extractors ───────────────────────────────────────────────────────────────

async function extractFromTxt(file: File): Promise<ExtractionResult> {
  const text = await readFileAsText(file);
  if (!text.trim()) throw new DocumentExtractionError("The text file appears to be empty.");
  return { text: text.trim(), method: "text", fileName: file.name };
}

async function extractFromPdf(file: File): Promise<ExtractionResult> {
  const pdfjsLib = await loadPdfJs();
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ")
      .trim();
    if (pageText) pages.push(pageText);
  }

  const text = pages.join("\n\n").trim();
  if (!text) throw new DocumentExtractionError(
    "Could not extract text from this PDF. It may be a scanned image — try uploading as a JPG or PNG instead."
  );

  return { text, method: "text", fileName: file.name };
}

async function extractFromDocx(file: File): Promise<ExtractionResult> {
  const mammoth     = await loadMammoth();
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result      = await mammoth.extractRawText({ arrayBuffer });

  const text = result.value?.trim();
  if (!text) throw new DocumentExtractionError("Could not extract text from this Word document.");

  return { text, method: "text", fileName: file.name };
}

async function extractFromImage(file: File, language: string): Promise<ExtractionResult> {
  const base64 = await readFileAsBase64(file);
  const mimeType = file.type || "image/jpeg";

  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "";
  const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, mimeType, language }),
  });

  if (!response.ok) {
    throw new DocumentExtractionError(
      "Image analysis failed. Make sure the backend is running and supports image input."
    );
  }

  const data = await response.json();

  // The image endpoint returns a full DiagnosticResult directly
  // We attach it as JSON so DiagnosticInterface can detect and use it
  return {
    text: data.extractedText || JSON.stringify(data),
    method: "image-llm",
    fileName: file.name,
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────────
export async function extractFromDocument(
  file: File,
  language: string,
): Promise<ExtractionResult> {
  // Size check
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new DocumentExtractionError(
      `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  
  let result: ExtractionResult;

  if (file.type === "text/plain" || ext === "txt") {
    result = await extractFromTxt(file);
  } else if (file.type === "application/pdf" || ext === "pdf") {
    result = await extractFromPdf(file);
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  ) {
    result = await extractFromDocx(file);
  } else if (["jpg", "jpeg", "png", "webp"].includes(ext ?? "") ||
      file.type.startsWith("image/")) {
    return extractFromImage(file, language);
  } else {
    throw new DocumentExtractionError(
      `Unsupported file type. Please upload a PDF, Word document, text file, or image.`
    );
  }

  // Translate the extracted text
  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "";
  try {
    const response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: result.text, language }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.translatedText) {
        result.text = data.translatedText;
      }
    }
  } catch (error) {
    console.error("Failed to translate document text:", error);
  }

  return result;
}

// ─── Error messages per language ─────────────────────────────────────────────
export const UPLOAD_LABELS: Record<string, Record<string, string>> = {
  en: {
    title:        "Upload Document",
    subtitle:     "Drop a file here or click to browse",
    accepted:     "PDF, DOCX, TXT, JPG, PNG — max 10MB",
    processing:   "Reading document…",
    ready:        "Document ready",
    readySubtext: "Text extracted successfully. Click Run Analysis to continue.",
    remove:       "Remove",
    errorSize:    "File too large. Maximum 10MB.",
    errorType:    "Unsupported file type.",
    errorRead:    "Could not read this file. Please try another.",
    preview:      "Extracted text preview",
  },
  yo: {
    title:        "Gbe Iwe Soke",
    subtitle:     "Fi faili silẹ nibi tabi tẹ lati wa",
    accepted:     "PDF, DOCX, TXT, JPG, PNG — o pọju 10MB",
    processing:   "N ka iwe…",
    ready:        "Iwe ti ṣetan",
    readySubtext: "A fa ọrọ jade daradara. Tẹ Ṣe Itupalẹ lati tẹsiwaju.",
    remove:       "Yọ kuro",
    errorSize:    "Faili tobi ju. O pọju 10MB.",
    errorType:    "Iru faili ko ṣe atilẹyin.",
    errorRead:    "Ko le ka faili yii. Jọwọ gbiyanju omiran.",
    preview:      "Wo ọrọ ti a fa jade",
  },
  ig: {
    title:        "Bulite Akwụkwọ",
    subtitle:     "Dobe faịlụ ebe a ma ọ bụ pịa iji chọọ",
    accepted:     "PDF, DOCX, TXT, JPG, PNG — kachasị 10MB",
    processing:   "Na-agụ akwụkwọ…",
    ready:        "Akwụkwọ dị njikere",
    readySubtext: "Ewepụtara ọrọ nke ọma. Pịa Mee Nyocha iji gaa n'ihu.",
    remove:       "Wepu",
    errorSize:    "Faịlụ dị nnọọ. Kachasị 10MB.",
    errorType:    "Ụdị faịlụ a anaghị akwado.",
    errorRead:    "Enweghị ike ịgụ faịlụ a. Biko nwaa nke ọzọ.",
    preview:      "Nlele ọrọ ewepụtara",
  },
  ha: {
    title:        "Loda Takarda",
    subtitle:     "Jefa fayil anan ko danna don nema",
    accepted:     "PDF, DOCX, TXT, JPG, PNG — mafi 10MB",
    processing:   "Ana karanta takarda…",
    ready:        "Takarda na shirye",
    readySubtext: "An fitar da rubutu cikin nasara. Danna Gudanar da Nazari don ci gaba.",
    remove:       "Cire",
    errorSize:    "Fayil ya yi girma. Mafi 10MB.",
    errorType:    "Nau'in fayil ba a goyan baya.",
    errorRead:    "Ba za a iya karanta wannan fayil ba. Gwada wani.",
    preview:      "Dubawa rubutun da aka fitar",
  },
  pcm: {
    title:        "Upload Document",
    subtitle:     "Drop file here or click to find am",
    accepted:     "PDF, DOCX, TXT, JPG, PNG — max 10MB",
    processing:   "E dey read document…",
    ready:        "Document ready",
    readySubtext: "We don extract the text. Click Run Analysis to continue.",
    remove:       "Remove am",
    errorSize:    "File too big. Max na 10MB.",
    errorType:    "This file type no dey work.",
    errorRead:    "We no fit read this file. Try another one.",
    preview:      "Preview of extracted text",
  },
};