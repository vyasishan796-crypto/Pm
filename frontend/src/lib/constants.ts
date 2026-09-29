import { BloodGroup, IPCategory, LanguageOption } from "@/types";

export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const IP_CATEGORIES: { value: IPCategory; label: string; description: string }[] = [
  {
    value: "patent",
    label: "Patent",
    description: "Protect inventions and new processes",
  },
  {
    value: "trademark",
    label: "Trademark",
    description: "Protect brand names, logos, and slogans",
  },
  {
    value: "copyright",
    label: "Copyright",
    description: "Protect original literary and artistic works",
  },
  {
    value: "design",
    label: "Industrial Design",
    description: "Protect the ornamental aspect of articles",
  },
  {
    value: "geographical_indication",
    label: "Geographical Indication",
    description: "Protect products from specific geographic origins",
  },
  {
    value: "traditional_knowledge",
    label: "Traditional Knowledge",
    description: "Protect traditional practices and formulations",
  },
];

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const AVAILABILITY_COLORS: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  limited: "bg-yellow-100 text-yellow-800",
  unavailable: "bg-red-100 text-red-800",
};

export const VERIFICATION_COLORS: Record<string, string> = {
  verified: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};
