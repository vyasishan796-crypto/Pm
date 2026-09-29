const BASE_URL = "https://api.semanticscholar.org/graph/v1";

export interface PaperAuthor {
  authorId?: string;
  name: string;
  affiliation?: string;
}

export interface Paper {
  paperId: string;
  title: string;
  year: number | null;
  authors: PaperAuthor[];
  abstract: string | null;
  citationCount: number | null;
  venue: string | null;
  url: string;
  openAccessPdf: { url: string; status: string } | null;
  externalIds?: Record<string, string>;
}

interface SearchResponse {
  total: number;
  offset: number;
  next?: number;
  data: Paper[];
}

let lastRequestTime = 0;
const MIN_INTERVAL = 5000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getCacheKey(query: string, offset: number): string {
  return `ss_${query.toLowerCase().trim()}_${offset}`;
}

function getCached(key: string): SearchResponse | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.ts > 30 * 60 * 1000) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data.res;
  } catch {
    return null;
  }
}

function setCache(key: string, res: SearchResponse) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ res, ts: Date.now() }));
  } catch {}
}

export async function searchPapersLive(query: string, options: { limit?: number; offset?: number } = {}): Promise<SearchResponse> {
  const limit = options.limit || 10;
  const offset = options.offset || 0;
  const cacheKey = getCacheKey(query, offset);

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_INTERVAL) {
    await sleep(MIN_INTERVAL - timeSinceLast);
  }

  const FIELDS = "paperId,title,year,authors,abstract,citationCount,venue,url,openAccessPdf,externalIds";
  const params = new URLSearchParams({
    query,
    fields: FIELDS,
    limit: String(limit),
    offset: String(offset),
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    lastRequestTime = Date.now();

    const res = await fetch(`${BASE_URL}/paper/search?${params.toString()}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data: SearchResponse = await res.json();
      setCache(cacheKey, data);
      return data;
    }
  } catch {}

  return { total: 0, offset: 0, data: [] };
}

export function getGoogleScholarUrl(title: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
}

export function formatCitation(count: number): string {
  if (count === 1) return "1 citation";
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k citations`;
  return `${count} citations`;
}

export function formatAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) return "Unknown author";
  if (authors.length <= 3) return authors.join(", ");
  return `${authors.slice(0, 3).join(", ")} et al.`;
}

export function generateCiteText(title: string, authors: string[], year: number, venue: string): string {
  const authorStr = formatAuthors(authors);
  const v = venue ? `, ${venue}` : "";
  return `${authorStr} (${year}). ${title}${v}.`;
}

export const POPULAR_TOPICS = [
  { label: "Patent Law", query: "patent law India" },
  { label: "Traditional Knowledge", query: "traditional knowledge protection" },
  { label: "Ayurveda", query: "Ayurveda research" },
  { label: "IP Classification AI", query: "IP classification artificial intelligence" },
  { label: "Copyright", query: "copyright law India" },
  { label: "Geographical Indication", query: "geographical indication" },
  { label: "AI in IP", query: "artificial intelligence intellectual property" },
  { label: "Biopiracy", query: "biopiracy traditional knowledge" },
];

export const QUICK_LINKS = [
  { label: "Google Scholar", url: "https://scholar.google.com", description: "Search academic papers" },
  { label: "Indian Patent Office", url: "https://ipindiaonline.gov.in", description: "IP India official portal" },
  { label: "WIPO", url: "https://www.wipo.int", description: "World Intellectual Property Organization" },
  { label: "TKDL", url: "https://www.tkdl.res.in", description: "Traditional Knowledge Digital Library" },
  { label: "DOAJ", url: "https://doaj.org", description: "Directory of Open Access Journals" },
  { label: "Semantic Scholar", url: "https://www.semanticscholar.org", description: "AI-powered research tool" },
];
