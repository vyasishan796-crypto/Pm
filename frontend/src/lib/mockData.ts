export const mockDocuments = [
  { id: "doc-1", title: "Patent Guidelines for Ayurveda Products", category: "patent", country: "India", language: "English", source: "Indian Patent Office", verified: true, date: "2025-01-15", snippet: "Ayurveda formulations may be patentable if they meet novelty, inventive step, and industrial applicability requirements..." },
  { id: "doc-2", title: "Trademark Registration for AYUSH Products", category: "trademark", country: "India", language: "English", source: "Controller General of Patents", verified: true, date: "2025-02-10", snippet: "Brand names for Ayurveda products must be registered under the Trade Marks Act, 1999..." },
  { id: "doc-3", title: "Traditional Knowledge Digital Library (TKDL)", category: "traditional_knowledge", country: "India", language: "Hindi", source: "CSIR-NISCPR", verified: true, date: "2024-11-20", snippet: "TKDL provides a defensive publication system to prevent misappropriation of traditional knowledge..." },
  { id: "doc-4", title: "GI Act and Ayurveda Products", category: "geographical_indication", country: "India", language: "English", source: "GI Registry", verified: true, date: "2025-03-05", snippet: "Geographical Indication registration protects products originating from a specific region..." },
  { id: "doc-5", title: "International Patent Cooperation Treaty (PCT)", category: "patent", country: "International", language: "English", source: "WIPO", verified: true, date: "2024-09-12", snippet: "The PCT system allows filing a single international patent application..." },
  { id: "doc-6", title: "AYUSH Ministry Regulatory Framework", category: "regulatory", country: "India", language: "Hindi", source: "Ministry of AYUSH", verified: true, date: "2025-01-28", snippet: "The Ministry of AYUSH oversees the regulation of Ayurveda, Yoga, Unani, Siddha, and Homeopathy..." },
  { id: "doc-7", title: "Copyright Protection for Ayurveda Literature", category: "copyright", country: "India", language: "English", source: "Copyright Office", verified: true, date: "2024-12-01", snippet: "Original literary works related to Ayurveda formulations and research are protected..." },
  { id: "doc-8", title: "EU Regulations for Ayurveda Exports", category: "international", country: "EU", language: "English", source: "European Commission", verified: true, date: "2025-02-20", snippet: "Exporting Ayurveda products to the EU requires compliance with novel food regulations..." },
];

export const mockBloodBanks = [
  { id: "bb-1", name: "Indian Red Cross Society - Delhi", address: "Red Cross Building, Civil Lines, New Delhi", city: "New Delhi", lat: 28.6328, lng: 77.2197, phone: "+91-11-23356789", type: "Blood Bank", verified: true },
  { id: "bb-2", name: "AIIMS Blood Bank", address: "Ansari Nagar, New Delhi", city: "New Delhi", lat: 28.5672, lng: 77.2100, phone: "+91-11-26588500", type: "Hospital", verified: true },
  { id: "bb-3", name: "Rotary Blood Bank", address: "Tughlakabad Institutional Area, New Delhi", city: "New Delhi", lat: 28.5100, lng: 77.2450, phone: "+91-11-29996691", type: "Blood Bank", verified: true },
  { id: "bb-4", name: "Bombay Blood Bank", address: "Parel, Mumbai, Maharashtra", city: "Mumbai", lat: 19.0020, lng: 72.8420, phone: "+91-22-24921919", type: "Blood Bank", verified: true },
  { id: "bb-5", name: "Jehangir Hospital Blood Bank", address: "32 Sassoon Road, Pune, Maharashtra", city: "Pune", lat: 18.5280, lng: 73.8790, phone: "+91-20-66812000", type: "Hospital", verified: true },
  { id: "bb-6", name: "Fortis Hospital Blood Bank", address: "Sector 62, Noida, Uttar Pradesh", city: "Noida", lat: 28.6230, lng: 77.3690, phone: "+91-120-4306666", type: "Hospital", verified: true },
];

export const mockAvailability = [
  { bankId: "bb-1", group: "A+", status: "available", units: 12, updated: "10 min ago" },
  { bankId: "bb-1", group: "A-", status: "limited", units: 3, updated: "10 min ago" },
  { bankId: "bb-1", group: "B+", status: "available", units: 8, updated: "10 min ago" },
  { bankId: "bb-1", group: "B-", status: "unavailable", units: 0, updated: "10 min ago" },
  { bankId: "bb-1", group: "AB+", status: "available", units: 5, updated: "10 min ago" },
  { bankId: "bb-1", group: "AB-", status: "limited", units: 2, updated: "10 min ago" },
  { bankId: "bb-1", group: "O+", status: "available", units: 15, updated: "10 min ago" },
  { bankId: "bb-1", group: "O-", status: "limited", units: 4, updated: "10 min ago" },
  { bankId: "bb-2", group: "A+", status: "available", units: 20, updated: "5 min ago" },
  { bankId: "bb-2", group: "B+", status: "available", units: 14, updated: "5 min ago" },
  { bankId: "bb-2", group: "O+", status: "available", units: 22, updated: "5 min ago" },
  { bankId: "bb-2", group: "AB+", status: "limited", units: 3, updated: "5 min ago" },
  { bankId: "bb-3", group: "A+", status: "available", units: 9, updated: "1 hour ago" },
  { bankId: "bb-3", group: "B-", status: "available", units: 6, updated: "1 hour ago" },
  { bankId: "bb-3", group: "O-", status: "unavailable", units: 0, updated: "1 hour ago" },
];

export const mockQueryHistory = [
  { id: "q-1", question: "How can I protect a traditional Ayurveda formulation?", language: "en", category: "Traditional Knowledge", date: "Today, 11:42 AM", sources: 3 },
  { id: "q-2", question: "What are the patent eligibility criteria for herbal products?", language: "en", category: "Patent", date: "Today, 10:15 AM", sources: 5 },
  { id: "q-3", question: "ट्रेडमार्क पंजीकरण की प्रक्रिया क्या है?", language: "hi", category: "Trademark", date: "Yesterday, 3:30 PM", sources: 2 },
  { id: "q-4", question: "International regulations for Ayurveda exports to EU", language: "en", category: "International", date: "Yesterday, 11:00 AM", sources: 4 },
  { id: "q-5", question: "Copyright protection for Ayurveda research papers", language: "en", category: "Copyright", date: "Sep 14, 2026", sources: 2 },
  { id: "q-6", question: "GI registration process for regional Ayurveda products", language: "en", category: "Geographical Indication", date: "Sep 13, 2026", sources: 3 },
];

export const mockAdminStats = {
  totalUsers: 1247,
  totalBloodBanks: 86,
  totalQueries: 3420,
  totalDocuments: 156,
  verifiedFacilities: 72,
  reportedIssues: 5,
  queryCount: 3420,
  failedQueries: 23,
  knowledgeBaseUpdates: 12,
  sourceCitationRate: 94,
  registeredFacilities: 86,
  availabilityRecords: 688,
  recentUpdates: 145,
  incorrectReports: 3,
};

export const mockUsers = [
  { id: "u-1", name: "Dr. Priya Sharma", email: "priya@example.com", role: "Researcher", joined: "Jan 2026", queries: 45 },
  { id: "u-2", name: "Rajesh Kumar", email: "rajesh@example.com", role: "General User", joined: "Feb 2026", queries: 12 },
  { id: "u-3", name: "Ananya Patel", email: "ananya@example.com", role: "Ayurveda Practitioner", joined: "Mar 2026", queries: 89 },
  { id: "u-4", name: "Vikram Singh", email: "vikram@example.com", role: "Startup", joined: "Apr 2026", queries: 23 },
  { id: "u-5", name: "Meera Reddy", email: "meera@example.com", role: "Blood Bank Staff", joined: "May 2026", queries: 5 },
];

export const exampleQueries = [
  "How to register an Ayurveda product in India?",
  "What are the patent eligibility criteria for Ayurveda formulations?",
  "Trademark vs Patent — key differences?",
  "International regulations for Ayurveda exports?",
];

export const ipCategories = [
  { id: "patent", name: "Patent", icon: "ShieldCheck", description: "Protect inventions, formulations, and processes", whyApply: "If your innovation is novel, involves an inventive step, and is industrially applicable." },
  { id: "trademark", name: "Trademark", icon: "FileText", description: "Protect brand names, logos, and slogans", whyApply: "If you want to distinguish your Ayurveda products from competitors in the marketplace." },
  { id: "copyright", name: "Copyright", icon: "BookOpen", description: "Protect original literary and creative works", whyApply: "If you've created original Ayurveda literature, research papers, or educational content." },
  { id: "design", name: "Design", icon: "Layers", description: "Protect the visual appearance of products", whyApply: "If your product packaging or design has a unique aesthetic appeal." },
  { id: "gi", name: "Geographical Indication", icon: "MapPin", description: "Protect products linked to a specific origin", whyApply: "If your Ayurveda product is known for its regional origin and reputation." },
  { id: "tk", name: "Traditional Knowledge", icon: "Leaf", description: "Protect and document traditional formulations", whyApply: "If you want to preserve traditional Ayurveda knowledge from misappropriation." },
];

export const resourceCategories = [
  "Patents", "Trademarks", "Copyright", "Design", "Geographical Indication", "Traditional Knowledge", "Ayurveda Regulations", "International Regulations"
];

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const searchRadii = [
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
];

export const roles = [
  { value: "citizen", label: "General User" },
  { value: "researcher", label: "Researcher" },
  { value: "practitioner", label: "Ayurveda Practitioner" },
  { value: "startup", label: "Startup" },
  { value: "blood_bank_staff", label: "Blood Bank / Hospital" },
];
