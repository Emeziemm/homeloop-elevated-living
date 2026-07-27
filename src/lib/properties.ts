import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import heroVilla from "@/assets/hero-villa.jpg";
import area1 from "@/assets/area-1.jpg";
import area2 from "@/assets/area-2.jpg";
import area3 from "@/assets/area-3.jpg";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: "For Sale" | "For Rent" | "Open House";
  category: "Luxury" | "Apartment" | "Villa" | "Townhouse" | "Commercial";
  beds: number;
  baths: number;
  area: number; // sqm
  images: string[];
  description: string;
  amenities: string[];
  nearby: { label: string; distance: string }[];
  agent: {
    name: string;
    role: string;
    avatar: string;
    sold: number;
    years: number;
    phone: string;
    email: string;
    responseTime: string;
    languages: string[];
  };
  featured?: boolean;
  yearBuilt: number;
  parking: number;
  energy: string;
  lat: number;
  lng: number;
  span?: "sm" | "md" | "lg" | "wide" | "tall";
  architecturalStyle: string;
  interiorFinish: string;
  lotSize: number;
  livingSpace: number;
  floorPlan?: string;
  virtualTour?: string;
  lifestyle: { title: string; body: string; img: string }[];
};

const agents = [
  { name: "Elena Marchetti", role: "Senior Partner · Coastal", avatar: agent1, sold: 184, years: 12, phone: "+39 02 555 0142", email: "elena@homeloop.studio", responseTime: "under 1 hour", languages: ["Italian", "English", "French"] },
  { name: "Julien Aubert", role: "Director · Alpine & Lakes", avatar: agent2, sold: 137, years: 9, phone: "+33 4 89 55 0198", email: "julien@homeloop.studio", responseTime: "under 2 hours", languages: ["French", "English", "German"] },
  { name: "Amara Okafor", role: "Head of Private Sales", avatar: agent3, sold: 221, years: 14, phone: "+44 20 7946 0912", email: "amara@homeloop.studio", responseTime: "under 30 minutes", languages: ["English", "Spanish", "Portuguese"] },
];

const amenities = [
  "Infinity pool", "Private garden", "Home cinema", "Wine cellar", "Smart home",
  "Sauna & spa", "Sea views", "Chef's kitchen", "Home office", "Underfloor heating",
  "EV charging", "Panic room", "Gym", "Balcony", "Security", "Office",
];

const nearby = [
  { label: "International school", distance: "0.8 km" },
  { label: "Michelin restaurant", distance: "1.2 km" },
  { label: "Private hospital", distance: "2.4 km" },
  { label: "Marina & beach club", distance: "0.6 km" },
  { label: "Central park", distance: "0.4 km" },
  { label: "High-speed rail", distance: "3.1 km" },
];

const architecturalStyles = ["Mediterranean contemporary", "Brutalist restoration", "Minimalist glass pavilion", "Provençal farmhouse", "Renaissance palazzo", "Coastal modernist"];
const interiorFinishes = ["Hand-troweled plaster & brushed oak", "Honed travertine & walnut", "Microcement & blackened steel", "Limewashed stone & ash", "Polished marble & brass", "Raw concrete & cedar"];

const lifestyleSets = [
  [
    { title: "The neighbourhood", body: "Cobbled walking streets, morning light on stone facades, and cafés that have belonged to the same families for generations." },
    { title: "Schools & learning", body: "Three internationally accredited schools within a fifteen-minute drive, plus a beloved public library open seven days a week." },
    { title: "Everyday commute", body: "Twelve minutes to the coastal expressway, twenty-two minutes to the international terminal by high-speed rail." },
  ],
  [
    { title: "Restaurants", body: "A constellation of family-run trattorias and two-star kitchens within walking distance — dinner rarely needs a reservation." },
    { title: "Shopping", body: "Independent bookshops, ateliers and a daily market set the rhythm of the week, with the designer quarter ten minutes away." },
    { title: "Parks & sea", body: "A protected headland trails down to a private cove, and the city's botanical garden sits at the end of the street." },
  ],
  [
    { title: "Walkability", body: "Everything for daily life sits within a fifteen-minute walk — bakery, pharmacy, school, harbour and the evening paseo." },
    { title: "Entertainment", body: "An open-air amphitheatre, two independent cinemas and a year-round calendar of festivals keep the evenings full." },
    { title: "Transport", body: "Tram, regional rail and a dedicated ride-share lane connect the district to the airport in under half an hour." },
  ],
];

const base = [
  { title: "Villa Serenne", location: "Cap Ferrat, France", price: 8_450_000, category: "Villa", beds: 5, baths: 6, area: 620, img: heroVilla, span: "lg", status: "For Sale" },
  { title: "Maison Miroir", location: "Costa Smeralda, Italy", price: 5_200_000, category: "Villa", beds: 4, baths: 4, area: 410, img: property1, span: "md", status: "Open House" },
  { title: "Studio Alba", location: "Milano Brera, Italy", price: 1_890_000, category: "Apartment", beds: 2, baths: 2, area: 155, img: property2, span: "sm", status: "For Sale" },
  { title: "The Rooftop N.7", location: "Lisbon, Portugal", price: 3_400_000, category: "Apartment", beds: 3, baths: 3, area: 240, img: property3, span: "wide", status: "For Sale" },
  { title: "Casa Oliva", location: "Provence, France", price: 2_750_000, category: "Townhouse", beds: 4, baths: 3, area: 320, img: area1, span: "md", status: "For Rent" },
  { title: "Palazzo Volta", location: "Como, Italy", price: 12_800_000, category: "Luxury", beds: 7, baths: 8, area: 920, img: area2, span: "tall", status: "For Sale" },
  { title: "Sunset Loft", location: "Barcelona, Spain", price: 1_495_000, category: "Apartment", beds: 2, baths: 2, area: 128, img: area3, span: "sm", status: "For Rent" },
  { title: "The Atelier", location: "Paris 6e, France", price: 4_100_000, category: "Apartment", beds: 3, baths: 2, area: 210, img: property1, span: "md", status: "For Sale" },
  { title: "Villa Diamante", location: "Marbella, Spain", price: 6_900_000, category: "Villa", beds: 5, baths: 5, area: 560, img: property3, span: "wide", status: "Open House" },
] as const;

export const properties: Property[] = base.map((p, i) => {
  const lifestyleImgs = [p.img, [property1, property2, property3, heroVilla, area1, area2, area3][(i + 1) % 7], [property2, property3, area1, area2, area3, property1, heroVilla][(i + 2) % 7]];
  const lifestyle = lifestyleSets.map((set, s) =>
    set.map((c, cIdx) => ({ ...c, img: lifestyleImgs[(s + cIdx) % lifestyleImgs.length] })),
  ).flat();
  return {
    id: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: p.title,
    location: p.location,
    price: p.price,
    status: p.status as Property["status"],
    category: p.category as Property["category"],
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    images: [p.img, [property1, property2, property3, heroVilla, area1, area2, area3][(i + 1) % 7], [property2, property3, area1, area2, area3, property1, heroVilla][(i + 2) % 7]],
    description: `An exceptional ${p.category.toLowerCase()} set within one of ${p.location.split(",")[0]}'s most sought-after enclaves. Reimagined by an award-winning studio, ${p.title} balances quiet architectural restraint with a warm, tactile material palette — hand-troweled plaster, brushed oak, honed travertine — and floor-to-ceiling glass that dissolves the boundary between interior volumes and the landscape beyond.`,
    amenities: amenities.slice(0, 8 + (i % 8)),
    nearby,
    agent: agents[i % agents.length],
    featured: i < 3,
    yearBuilt: 2020 + (i % 6),
    parking: 2 + (i % 3),
    energy: ["A+", "A", "A+", "A", "B", "A+"][i % 6],
    lat: 43.6961 + i * 0.02,
    lng: 7.2619 + i * 0.03,
    span: p.span as Property["span"],
    architecturalStyle: architecturalStyles[i % architecturalStyles.length],
    interiorFinish: interiorFinishes[i % interiorFinishes.length],
    lotSize: Math.round(p.area * 1.6),
    livingSpace: p.area,
    floorPlan: i % 3 === 0 ? undefined : undefined, // floor plan graphic rendered in-page; section shown for all
    virtualTour: i % 4 === 0 ? undefined : `https://example.com/tour/${p.title.toLowerCase().replace(/\s+/g, "-")}`,
    lifestyle,
  };
});

export function findProperty(id: string) {
  return properties.find((p) => p.id === id);
}

export function formatPrice(n: number) {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`;
  return `€${n.toLocaleString()}`;
}

export const filterChips = [
  "For Sale", "For Rent", "Luxury", "Apartment", "Villa", "Townhouse",
  "Commercial", "Recently Added", "Open House", "Price Low → High", "Newest",
] as const;
