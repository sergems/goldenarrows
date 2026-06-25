import gaLogo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

const CDN = (id: number) => `https://media.api-sports.io/football/teams/${id}.png`;

// PSL / South African football teams mapped to API-Football CDN logo URLs
const TEAM_LOGOS: Record<string, string> = {
  // Golden Arrows (us — use our own hosted logo)
  "lamontville golden arrows": gaLogo,
  "golden arrows": gaLogo,
  "golden arrows fc": gaLogo,

  // Other PSL clubs
  "mamelodi sundowns": CDN(674),
  "kaizer chiefs": CDN(670),
  "orlando pirates": CDN(671),
  "supersport united": CDN(672),
  "super sport united": CDN(672),
  "stellenbosch": CDN(6672),
  "stellenbosch fc": CDN(6672),
  "cape town city": CDN(1756),
  "chippa united": CDN(6396),
  "ts galaxy": CDN(10001),
  "swallows fc": CDN(5018),
  "moroka swallows": CDN(5018),
  "amazulu": CDN(3763),
  "amazulu fc": CDN(3763),
  "sekhukhune united": CDN(15414),
  "richards bay": CDN(18453),
  "richards bay fc": CDN(18453),
  "cape town spurs": CDN(15453),
  "polokwane city": CDN(6320),
  "baroka fc": CDN(6394),
  "baroka": CDN(6394),
  "black leopards": CDN(6397),
  "bidvest wits": CDN(673),
  "maritzburg united": CDN(6315),
  "bloemfontein celtic": CDN(6318),
};

/**
 * Returns the logo URL for a team name.
 * Tries exact match, then fuzzy match by checking if the team name includes
 * any known key. Falls back to null so callers can render initials.
 */
export function getTeamLogo(teamName: string): string | null {
  const lower = teamName.toLowerCase().trim();

  // Exact match
  if (TEAM_LOGOS[lower]) return TEAM_LOGOS[lower];

  // Fuzzy: any key contained in the team name or vice versa
  for (const [key, url] of Object.entries(TEAM_LOGOS)) {
    if (lower.includes(key) || key.includes(lower)) return url;
  }

  return null;
}

/** Stable initials fallback (max 2 chars) */
export function teamInitials(name: string): string {
  return name
    .split(" ")
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
