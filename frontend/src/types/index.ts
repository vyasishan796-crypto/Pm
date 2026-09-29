export type UserRole = "user" | "blood_bank" | "admin";

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  language: string;
  created_at: string;
}

export interface BloodBank {
  blood_bank_id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  verification_status: "pending" | "verified" | "rejected";
  created_at: string;
}

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface BloodAvailability {
  availability_id: string;
  blood_bank_id: string;
  blood_group: BloodGroup;
  status: AvailabilityStatus;
  units_available: number | null;
  last_updated: string;
}

export interface BloodBankWithAvailability extends BloodBank {
  availability: BloodAvailability[];
  distance?: number;
}

export interface Document {
  document_id: string;
  title: string;
  source: string;
  category: IPCategory;
  language: string;
  file_path: string;
  uploaded_at: string;
  verified_status: "pending" | "verified" | "rejected";
}

export type IPCategory =
  | "patent"
  | "trademark"
  | "copyright"
  | "design"
  | "geographical_indication"
  | "traditional_knowledge";

export interface AIQuery {
  query_id: string;
  user_id?: string;
  question: string;
  language: string;
  response: string;
  sources: Source[];
  created_at: string;
}

export interface Source {
  title: string;
  source: string;
  category: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  confidence?: number;
  relatedQuestions?: string[];
  timestamp: string;
}

export interface SearchParams {
  blood_group: BloodGroup;
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface AIQueryRequest {
  question: string;
  language: string;
}

export interface AIQueryResponse {
  answer: string;
  sources: Source[];
}

export interface AdminStats {
  total_users: number;
  total_blood_banks: number;
  total_queries: number;
  total_documents: number;
  verified_blood_banks: number;
  pending_verifications: number;
}

export type SupportedLanguage = "en" | "hi" | "sa" | "bn" | "ta" | "te" | "mr" | "gu" | "kn" | "ml";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}
