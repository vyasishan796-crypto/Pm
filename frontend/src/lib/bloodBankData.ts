export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface BloodBankData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  phone: string;
  type: "Blood Bank" | "Hospital" | "Red Cross" | "Government";
  verified: boolean;
  availability: Record<BloodGroup, { status: AvailabilityStatus; units: number; updated: string }>;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAvail(seed: number) {
  const groups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const avail: Record<BloodGroup, { status: AvailabilityStatus; units: number; updated: string }> = {} as any;
  const times = ["5 min ago", "12 min ago", "30 min ago", "1 hour ago", "2 hours ago"];
  groups.forEach((g, i) => {
    const u = ((seed * (i + 1) * 7) % 25);
    const status: AvailabilityStatus = u === 0 ? "unavailable" : u <= 3 ? "limited" : "available";
    avail[g] = { status, units: u, updated: times[(seed + i) % times.length] };
  });
  return avail;
}

export const bloodBanksData: BloodBankData[] = [
  // DELHI NCR
  { id: "bb-001", name: "Indian Red Cross Society - Delhi", address: "Red Cross Building, Civil Lines", city: "New Delhi", state: "Delhi", lat: 28.6328, lng: 77.2197, phone: "+91-11-23356789", type: "Red Cross", verified: true, availability: makeAvail(1) },
  { id: "bb-002", name: "AIIMS Blood Bank", address: "Ansari Nagar, South Delhi", city: "New Delhi", state: "Delhi", lat: 28.5672, lng: 77.2100, phone: "+91-11-26588500", type: "Hospital", verified: true, availability: makeAvail(2) },
  { id: "bb-003", name: "Safdarjung Hospital Blood Bank", address: "Safdarjung Hospital, Vasant Kunj", city: "New Delhi", state: "Delhi", lat: 28.5723, lng: 77.2090, phone: "+91-11-26165060", type: "Government", verified: true, availability: makeAvail(3) },
  { id: "bb-004", name: "Lok Nayak Blood Bank", address: "Jawaharlal Nehru Marg, Delhi", city: "New Delhi", state: "Delhi", lat: 28.6386, lng: 77.2382, phone: "+91-11-23234567", type: "Government", verified: true, availability: makeAvail(4) },
  { id: "bb-005", name: "Rotary Blood Bank", address: "Tughlakabad Institutional Area", city: "New Delhi", state: "Delhi", lat: 28.5100, lng: 77.2450, phone: "+91-11-29996691", type: "Blood Bank", verified: true, availability: makeAvail(5) },

  // MAHARASHTRA
  { id: "bb-006", name: "Bombay Blood Bank", address: "Parel, Central Mumbai", city: "Mumbai", state: "Maharashtra", lat: 19.0020, lng: 72.8420, phone: "+91-22-24921919", type: "Blood Bank", verified: true, availability: makeAvail(6) },
  { id: "bb-007", name: "Jehangir Hospital Blood Bank", address: "32 Sassoon Road, Pune", city: "Pune", state: "Maharashtra", lat: 18.5280, lng: 73.8790, phone: "+91-20-66812000", type: "Hospital", verified: true, availability: makeAvail(7) },
  { id: "bb-008", name: "Nanavati Hospital Blood Bank", address: "Vile Parle West, Mumbai", city: "Mumbai", state: "Maharashtra", lat: 19.1076, lng: 72.8380, phone: "+91-22-26267500", type: "Hospital", verified: true, availability: makeAvail(8) },
  { id: "bb-009", name: "Deccan Blood Bank", address: "Deccan Gymkhana, Pune", city: "Pune", state: "Maharashtra", lat: 18.5118, lng: 73.8398, phone: "+91-20-25530147", type: "Blood Bank", verified: true, availability: makeAvail(9) },
  { id: "bb-010", name: "Nagpur Red Cross Blood Bank", address: "Sitabuldi, Nagpur", city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, phone: "+91-712-2534567", type: "Red Cross", verified: true, availability: makeAvail(10) },

  // KARNATAKA
  { id: "bb-011", name: "Narayana Health Blood Bank", address: "258/A Bommasandra Industrial Area, Bangalore", city: "Bangalore", state: "Karnataka", lat: 12.9010, lng: 77.6770, phone: "+91-80-71222222", type: "Hospital", verified: true, availability: makeAvail(11) },
  { id: "bb-012", name: "Manipal Hospital Blood Bank", address: "HAL Airport Road, Bangalore", city: "Bangalore", state: "Karnataka", lat: 12.9609, lng: 77.6483, phone: "+91-80-25024444", type: "Hospital", verified: true, availability: makeAvail(12) },
  { id: "bb-013", name: "Victoria Hospital Blood Bank", address: "Fort Road, Bangalore", city: "Bangalore", state: "Karnataka", lat: 12.9570, lng: 77.5750, phone: "+91-80-22210039", type: "Government", verified: true, availability: makeAvail(13) },

  // TAMIL NADU
  { id: "bb-014", name: "Apollo Hospitals Blood Bank", address: "Greams Road, Chennai", city: "Chennai", state: "Tamil Nadu", lat: 13.0604, lng: 80.2496, phone: "+91-44-28298282", type: "Hospital", verified: true, availability: makeAvail(14) },
  { id: "bb-015", name: "Madras Medical Mission Blood Bank", address: "4A Jawahar Nagar, Chennai", city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, phone: "+91-44-26286868", type: "Hospital", verified: true, availability: makeAvail(15) },
  { id: "bb-016", name: "Coimbatore Medical Centre", address: "Avinashi Road, Coimbatore", city: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558, phone: "+91-422-2301393", type: "Hospital", verified: true, availability: makeAvail(16) },

  // WEST BENGAL
  { id: "bb-017", name: "SSKM Hospital Blood Bank", address: "244 AJC Bose Road, Kolkata", city: "Kolkata", state: "West Bengal", lat: 22.5290, lng: 88.3494, phone: "+91-33-22239555", type: "Government", verified: true, availability: makeAvail(17) },
  { id: "bb-018", name: "Apollo Gleneagles Blood Bank", address: "58 Canal Circular Road, Kolkata", city: "Kolkata", state: "West Bengal", lat: 22.5180, lng: 88.3930, phone: "+91-33-23203040", type: "Hospital", verified: true, availability: makeAvail(18) },

  // UTTAR PRADESH
  { id: "bb-019", name: "Sanjay Gandhi PGIMS Blood Bank", address: "Raebareli Road, Lucknow", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, phone: "+91-522-2668700", type: "Government", verified: true, availability: makeAvail(19) },
  { id: "bb-020", name: "King George Medical University", address: "Shah Mina Road, Lucknow", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8684, lng: 80.9126, phone: "+91-522-2257310", type: "Government", verified: true, availability: makeAvail(20) },
  { id: "bb-021", name: "Fortis Hospital Noida", address: "Sector 62, Noida", city: "Noida", state: "Uttar Pradesh", lat: 28.6230, lng: 77.3690, phone: "+91-120-4306666", type: "Hospital", verified: true, availability: makeAvail(21) },
  { id: "bb-022", name: "Sahara Hospital Blood Bank", address: "Viraj Khand, Gomti Nagar, Lucknow", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8560, lng: 81.0020, phone: "+91-522-6789000", type: "Hospital", verified: true, availability: makeAvail(22) },

  // RAJASTHAN
  { id: "bb-023", name: "Sawai Man Singh Hospital", address: "SMS Hospital Road, Jaipur", city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, phone: "+91-141-2566251", type: "Government", verified: true, availability: makeAvail(23) },
  { id: "bb-024", name: "Fortis Escorts Hospital", address: "Malviya Nagar, Jaipur", city: "Jaipur", state: "Rajasthan", lat: 26.8840, lng: 75.8120, phone: "+91-141-2544000", type: "Hospital", verified: true, availability: makeAvail(24) },

  // GUJARAT
  { id: "bb-025", name: "Civil Hospital Ahmedabad", address: "Asarwa, Ahmedabad", city: "Ahmedabad", state: "Gujarat", lat: 23.0366, lng: 72.5956, phone: "+91-79-22682600", type: "Government", verified: true, availability: makeAvail(25) },
  { id: "bb-026", name: "Sterling Hospital Blood Bank", address: "Off Gurukul Road, Ahmedabad", city: "Ahmedabad", state: "Gujarat", lat: 23.0380, lng: 72.5240, phone: "+91-79-40465555", type: "Hospital", verified: true, availability: makeAvail(26) },

  // MADHYA PRADESH
  { id: "bb-027", name: "AIIMS Bhopal Blood Bank", address: "Saket Nagar, Bhopal", city: "Bhopal", state: "Madhya Pradesh", lat: 23.2078, lng: 77.4030, phone: "+91-755-2695000", type: "Government", verified: true, availability: makeAvail(27) },
  { id: "bb-028", name: "CHL Hospital Blood Bank", address: "AB Road, Indore", city: "Indore", state: "Madhya Pradesh", lat: 22.7185, lng: 75.8590, phone: "+91-731-4244000", type: "Hospital", verified: true, availability: makeAvail(28) },

  // BIHAR
  { id: "bb-029", name: "PMCH Blood Bank", address: "Ashok Rajpath, Patna", city: "Patna", state: "Bihar", lat: 25.6093, lng: 85.1376, phone: "+91-612-2297184", type: "Government", verified: true, availability: makeAvail(29) },
  { id: "bb-030", name: "Indira Gandhi Institute of Medical Sciences", address: "Sheikhpura, Patna", city: "Patna", state: "Bihar", lat: 25.5780, lng: 85.1480, phone: "+91-612-2635622", type: "Government", verified: true, availability: makeAvail(30) },

  // ANDHRA PRADESH
  { id: "bb-031", name: "NIMS Blood Bank", address: "Panjagutta, Hyderabad", city: "Hyderabad", state: "Telangana", lat: 17.4239, lng: 78.4488, phone: "+91-40-23489000", type: "Government", verified: true, availability: makeAvail(31) },
  { id: "bb-032", name: "Apollo Hospitals Hyderabad", address: "Jubilee Hills, Hyderabad", city: "Hyderabad", state: "Telangana", lat: 17.4156, lng: 78.4347, phone: "+91-40-23607777", type: "Hospital", verified: true, availability: makeAvail(32) },
  { id: "bb-033", name: "Gandhi Hospital Blood Bank", address: "Secunderabad, Hyderabad", city: "Hyderabad", state: "Telangana", lat: 17.4399, lng: 78.4983, phone: "+91-40-27701148", type: "Government", verified: true, availability: makeAvail(33) },

  // KERALA
  { id: "bb-034", name: "Amrita Institute of Medical Sciences", address: "Edappally, Kochi", city: "Kochi", state: "Kerala", lat: 10.0285, lng: 76.3110, phone: "+91-484-2851234", type: "Hospital", verified: true, availability: makeAvail(34) },
  { id: "bb-035", name: "Government Medical College Blood Bank", address: "Edappally, Ernakulam", city: "Kochi", state: "Kerala", lat: 10.0350, lng: 76.3040, phone: "+91-484-2345678", type: "Government", verified: true, availability: makeAvail(35) },
  { id: "bb-036", name: "MIMS Kozhikode Blood Bank", address: "Vellayil, Kozhikode", city: "Kozhikode", state: "Kerala", lat: 11.2588, lng: 75.7804, phone: "+91-495-2356789", type: "Hospital", verified: true, availability: makeAvail(36) },

  // PUNJAB
  { id: "bb-037", name: "PGI Chandigarh Blood Bank", address: "Sector 12, Chandigarh", city: "Chandigarh", state: "Punjab", lat: 30.7600, lng: 76.8080, phone: "+91-172-2747585", type: "Government", verified: true, availability: makeAvail(37) },
  { id: "bb-038", name: "Fortis Hospital Mohali", address: "Phase 8, Mohali", city: "Mohali", state: "Punjab", lat: 30.7046, lng: 76.7179, phone: "+91-172-5095095", type: "Hospital", verified: true, availability: makeAvail(38) },

  // HARYANA
  { id: "bb-039", name: "PGIMS Rohtak Blood Bank", address: "Rohtak", city: "Rohtak", state: "Haryana", lat: 28.8950, lng: 76.5930, phone: "+91-1262-211300", type: "Government", verified: true, availability: makeAvail(39) },

  // JHARKHAND
  { id: "bb-040", name: "RIMS Ranchi Blood Bank", address: "Bariatu Road, Ranchi", city: "Ranchi", state: "Jharkhand", lat: 23.3560, lng: 85.3180, phone: "+91-651-2200250", type: "Government", verified: true, availability: makeAvail(40) },

  // ODISHA
  { id: "bb-041", name: "SCB Medical College Blood Bank", address: "Cuttack", city: "Cuttack", state: "Odisha", lat: 20.4680, lng: 85.8790, phone: "+91-671-2301234", type: "Government", verified: true, availability: makeAvail(41) },
  { id: "bb-042", name: "Apollo Hospitals Bhubaneswar", address: "Plot 251, Sainik School Road", city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245, phone: "+91-674-6661111", type: "Hospital", verified: true, availability: makeAvail(42) },

  // ASSAM
  { id: "bb-043", name: "GMCH Guwahati Blood Bank", address: "Bhangagarh, Guwahati", city: "Guwahati", state: "Assam", lat: 26.1700, lng: 91.7500, phone: "+91-361-2521034", type: "Government", verified: true, availability: makeAvail(43) },

  // CHHATTISGARH
  { id: "bb-044", name: "AIIMS Raipur Blood Bank", address: "Kota, Raipur", city: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296, phone: "+91-771-2570015", type: "Government", verified: true, availability: makeAvail(44) },

  // GOA
  { id: "bb-045", name: "Goa Medical College Blood Bank", address: "Bambolim, Goa", city: "Panaji", state: "Goa", lat: 15.4989, lng: 73.8278, phone: "+91-832-2458700", type: "Government", verified: true, availability: makeAvail(45) },

  // JAMMU & KASHMIR
  { id: "bb-046", name: "SKIMS Soura Blood Bank", address: "Srinagar", city: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973, phone: "+91-194-2401013", type: "Government", verified: true, availability: makeAvail(46) },

  // UTTARAKHAND
  { id: "bb-047", name: "AIIMS Rishikesh Blood Bank", address: "AIIMS Road, Rishikesh", city: "Rishikesh", state: "Uttarakhand", lat: 30.0870, lng: 78.2680, phone: "+91-135-2461155", type: "Government", verified: true, availability: makeAvail(47) },

  // CHENNAI
  { id: "bb-048", name: "Stanley Medical College Blood Bank", address: "Chennai Port Road", city: "Chennai", state: "Tamil Nadu", lat: 13.0790, lng: 80.2880, phone: "+91-44-25281421", type: "Government", verified: true, availability: makeAvail(48) },

  // VISAKHAPATNAM
  { id: "bb-049", name: "King George Hospital Blood Bank", address: "Maharanipeta, Visakhapatnam", city: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.7163, lng: 83.3028, phone: "+91-891-2561048", type: "Government", verified: true, availability: makeAvail(49) },

  // THIRUVANANTHAPURAM
  { id: "bb-050", name: "SAT Hospital Blood Bank", address: "Medical College, Thiruvananthapuram", city: "Thiruvananthapuram", state: "Kerala", lat: 8.5050, lng: 76.9560, phone: "+91-471-2442244", type: "Government", verified: true, availability: makeAvail(50) },

  // NAGPUR
  { id: "bb-051", name: "IGGMC Nagpur Blood Bank", address: "Medical Square, Nagpur", city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, phone: "+91-712-2730423", type: "Government", verified: true, availability: makeAvail(51) },

  // INDORE
  { id: "bb-052", name: "MY Hospital Blood Bank", address: "AB Road, Indore", city: "Indore", state: "Madhya Pradesh", lat: 22.7248, lng: 75.8780, phone: "+91-731-2530456", type: "Government", verified: true, availability: makeAvail(52) },

  // SURAT
  { id: "bb-053", name: "SMIMER Hospital Blood Bank", address: "Nanpura, Surat", city: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311, phone: "+91-261-2471000", type: "Government", verified: true, availability: makeAvail(53) },

  // VADODARA
  { id: "bb-054", name: "SSG Hospital Blood Bank", address: "Fatehgunj, Vadodara", city: "Vadodara", state: "Gujarat", lat: 22.3174, lng: 73.1730, phone: "+91-265-2393000", type: "Government", verified: true, availability: makeAvail(54) },

  // AMRITSAR
  { id: "bb-055", name: "GOI Hospital Blood Bank", address: "Castle Road, Amritsar", city: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723, phone: "+91-183-2226181", type: "Government", verified: true, availability: makeAvail(55) },

  // JODHPUR
  { id: "bb-056", name: "AIIMS Jodhpur Blood Bank", address: "Basni, Jodhpur", city: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243, phone: "+91-291-2740700", type: "Government", verified: true, availability: makeAvail(56) },

  // VARANASI
  { id: "bb-057", name: "BHU Hospital Blood Bank", address: "Lanka, Varanasi", city: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9875, phone: "+91-542-2307354", type: "Government", verified: true, availability: makeAvail(57) },

  // MYSURU
  { id: "bb-058", name: "JSS Hospital Blood Bank", address: "Mysuru", city: "Mysuru", state: "Karnataka", lat: 12.3052, lng: 76.6552, phone: "+91-821-2548400", type: "Hospital", verified: true, availability: makeAvail(58) },

  // LUDHIANA
  { id: "bb-059", name: "DMC Ludhiana Blood Bank", address: "Tagore Nagar, Ludhiana", city: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573, phone: "+91-161-4680700", type: "Hospital", verified: true, availability: makeAvail(59) },

  // AGR A
  { id: "bb-060", name: "SN Medical College Blood Bank", address: "Agra", city: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, phone: "+91-562-2421244", type: "Government", verified: true, availability: makeAvail(60) },
];

export const allCities = [...new Set(bloodBanksData.map((b) => b.city))].sort();
export const allStates = [...new Set(bloodBanksData.map((b) => b.state))].sort();
export const allBloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
