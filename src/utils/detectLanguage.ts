/**
 * detectLanguage.ts
 *
 * Identifies the language being typed using two strategies:
 *
 *  1. Unicode script detection — instant, zero-ambiguity for non-Latin scripts
 *     (Arabic, Chinese, Devanagari, etc.)
 *
 *  2. Stopword frequency scoring — for Latin-script languages, counts how many
 *     known high-frequency words appear in the text and picks the best match.
 *
 * Returns a language code string (matching LanguageSelector codes), or null
 * when confidence is too low (e.g. the user has only typed a few characters).
 *
 * No network calls. No dependencies. Runs on every keystroke via a debounce.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetectionResult {
  code: string;       // e.g. "fr"
  label: string;      // e.g. "Français"
  confidence: number; // 0–1, for UI affordance (show toast only above threshold)
}

// ─── Script-based detection ───────────────────────────────────────────────────
// These Unicode ranges are mutually exclusive from Latin, so a single character
// match is already a confident signal.

const SCRIPT_RANGES: Array<{ pattern: RegExp; code: string; label: string }> = [
  { pattern: /[\u0600-\u06FF\u0750-\u077F]/,   code: 'ar', label: 'العربية'   }, // Arabic
  { pattern: /[\u4E00-\u9FFF\u3400-\u4DBF]/,   code: 'zh', label: '中文'      }, // CJK
  { pattern: /[\u3040-\u30FF]/,                 code: 'zh', label: '中文'      }, // Hiragana/Katakana → zh as closest supported
  { pattern: /[\u0900-\u097F]/,                 code: 'hi', label: 'हिन्दी'   }, // Devanagari / Hindi
  { pattern: /[\uAC00-\uD7AF\u1100-\u11FF]/,   code: 'zh', label: '中文'      }, // Hangul → zh as closest supported
];

// ─── Stopword banks ───────────────────────────────────────────────────────────
// Each array contains the 25–35 most distinctive high-frequency words for that
// language that are unlikely to appear in neighbouring languages.

const STOPWORDS: Array<{ code: string; label: string; words: Set<string> }> = [
  {
    code: 'es', label: 'Español',
    words: new Set([
      'tengo', 'me', 'siento', 'tiene', 'desde', 'hace', 'días', 'horas',
      'dolor', 'fiebre', 'cabeza', 'estómago', 'cuerpo', 'mucho', 'poco',
      'muy', 'también', 'pero', 'que', 'con', 'por', 'para', 'una', 'uno',
      'del', 'los', 'las', 'mis', 'sin', 'esta', 'hay', 'más', 'ya',
      'cuando', 'como', 'qué', 'no', 'sí', 'él', 'ella', 'nosotros',
    ]),
  },
  {
    code: 'fr', label: 'Français',
    words: new Set([
      "j'ai", 'mal', 'depuis', 'jours', 'heures', 'fièvre', 'tête',
      'douleur', 'nausée', 'vomissement', 'estomac', 'corps', 'suis',
      'avec', 'les', 'des', 'dans', 'sur', 'pour', 'mon', 'ma', 'mes',
      'pas', 'très', 'aussi', 'plus', 'je', 'tu', 'il', 'elle', 'nous',
      'vous', 'ils', 'qui', 'que', 'quoi', 'est', 'sont', 'ont', 'avez',
    ]),
  },
  {
    code: 'de', label: 'Deutsch',
    words: new Set([
      'ich', 'habe', 'seit', 'tagen', 'stunden', 'schmerzen', 'kopf',
      'bauch', 'fieber', 'übelkeit', 'körper', 'sehr', 'auch', 'nicht',
      'oder', 'und', 'die', 'der', 'das', 'den', 'dem', 'ein', 'eine',
      'einen', 'mein', 'meine', 'mir', 'mich', 'sich', 'bin', 'ist',
      'sind', 'hat', 'haben', 'bei', 'von', 'mit', 'für', 'auf', 'zu',
    ]),
  },
  {
    code: 'pt', label: 'Português',
    words: new Set([
      'tenho', 'sinto', 'desde', 'dias', 'horas', 'dor', 'febre',
      'cabeça', 'estômago', 'corpo', 'muito', 'também', 'mas', 'com',
      'por', 'para', 'uma', 'um', 'nos', 'nas', 'meu', 'minha', 'sem',
      'está', 'estou', 'são', 'tem', 'têm', 'não', 'sim', 'ele', 'ela',
    ]),
  },
  {
    code: 'sw', label: 'Swahili',
    words: new Set([
      'nina', 'maumivu', 'homa', 'kichwa', 'tumbo', 'mwili', 'tangu',
      'siku', 'masaa', 'pia', 'lakini', 'na', 'ya', 'kwa', 'wa', 'ni',
      'si', 'au', 'ndiyo', 'hapana', 'mimi', 'wewe', 'yeye', 'sisi',
      'anahisi', 'inaumiza', 'dawa', 'hospitali',
    ]),
  },
  {
    code: 'ha', label: 'Hausa',
    words: new Set([
      'ina', 'ciwon', 'kai', 'ciki', 'zazzabi', 'jiki', 'tun', 'kwana',
      "sa'a", 'kuma', 'amma', 'ko', 'sai', 'da', 'ba', 'ne', 'ce',
      'shi', 'ita', 'mu', 'su', 'yau', 'jiya', 'yanzu', 'yana', 'tana',
    ]),
  },
  {
    code: 'yo', label: 'Yorùbá',
    words: new Set([
      'ara', 'mi', 'dun', 'jẹ', 'ọjọ', 'wakati', 'ìbà', 'orí', 'ikùn',
      'ìrora', 'ati', 'naa', 'fun', 'si', 'ti', 'ni', 'ko', 'mo', 'wa',
      'wọn', 'pẹlú', 'bẹẹ', 'àárọ', 'òru', 'ó', 'àì', 'láti',
    ]),
  },
  {
    code: 'ig', label: 'Igbo',
    words: new Set([
      'nwere', 'ọrịa', 'isi', 'afọ', 'ahụ', 'oge', 'ụbọchị', 'oge',
      'mgbu', 'oyi', 'na', 'ya', 'ka', 'nke', 'ha', 'ọ', 'm', 'gị',
      'anyị', 'ha', 'maka', 'site', "n'ime",
    ]),
  },
];

// ─── Tokeniser ────────────────────────────────────────────────────────────────

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    // keep extended Latin, Arabic, CJK, Devanagari, apostrophes
    .replace(/[^\w\sÀ-ÿ\u0600-\u06FF\u4E00-\u9FFF\u0900-\u097F'\u1E00-\u1EFF]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * @param text   Raw textarea value
 * @param minLen Minimum character length before attempting detection (default 15)
 * @returns      DetectionResult or null if confidence is too low
 */
export function detectLanguage(
  text: string,
  minLen = 15,
): DetectionResult | null {
  const trimmed = text.trim();
  if (trimmed.length < minLen) return null;

  // ── 1. Script detection (fast path) ────────────────────────────────────────
  for (const { pattern, code, label } of SCRIPT_RANGES) {
    if (pattern.test(trimmed)) {
      return { code, label, confidence: 0.95 };
    }
  }

  // ── 2. Stopword scoring ────────────────────────────────────────────────────
  const tokens = tokenise(trimmed);
  if (tokens.length < 2) return null;

  let bestCode    = 'en';
  let bestLabel   = 'English';
  let bestScore   = 0;
  let totalTokens = tokens.length;

  for (const { code, label, words } of STOPWORDS) {
    let hits = 0;
    for (const token of tokens) {
      if (words.has(token)) hits++;
    }
    if (hits > bestScore) {
      bestScore = hits;
      bestCode  = code;
      bestLabel = label;
    }
  }

  // Confidence = proportion of tokens matched; require ≥2 hits to avoid noise
  const confidence = bestScore / Math.max(totalTokens, 1);
  if (bestScore < 2) return null;

  return { code: bestCode, label: bestLabel, confidence };
}