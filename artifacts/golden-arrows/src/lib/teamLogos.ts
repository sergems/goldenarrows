import gaLogo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const crest = (file: string) => `${BASE}/crests/${file}`;

const TEAM_LOGOS: Record<string, string> = {
  "lamontville golden arrows": gaLogo,
  "lamontville golden arrows fc": gaLogo,
  "golden arrows": crest("golden-arrows.png"),
  "golden arrows fc": crest("golden-arrows.png"),

  "mamelodi sundowns": crest("mamelodi-sundowns.png"),
  "kaizer chiefs": crest("kaizer-chiefs.png"),
  "orlando pirates": crest("orlando-pirates.png"),
  "stellenbosch": crest("stellenbosch.png"),
  "stellenbosch fc": crest("stellenbosch.png"),
  "sekhukhune united": crest("sekhukhune-united.png"),
  "ts galaxy": crest("ts-galaxy.png"),
  "ts galaxy fc": crest("ts-galaxy.png"),
  "amazulu": crest("amazulu.png"),
  "amazulu fc": crest("amazulu.png"),
  "polokwane city": crest("polokwane-city.png"),
  "polokwane city fc": crest("polokwane-city.png"),
  "richards bay": crest("richards-bay.png"),
  "richards bay fc": crest("richards-bay.png"),
  "marumo gallants": crest("marumo-gallants.png"),
  "marumo gallants fc": crest("marumo-gallants.png"),
  "chippa united": crest("chippa-united.png"),
  "chippa united fc": crest("chippa-united.png"),
  "magesi": crest("magesi.png"),
  "magesi fc": crest("magesi.png"),
  "siwelele": crest("siwelele.png"),
  "siwelele fc": crest("siwelele.png"),
  "durban city": crest("durban-city.png"),
  "durban city fc": crest("durban-city.png"),
  "orbit college": crest("orbit-college.png"),
};

export function getTeamLogo(teamName: string, dbLogoUrl?: string | null): string | null {
  if (dbLogoUrl) return dbLogoUrl;
  const lower = teamName.toLowerCase().trim();
  if (TEAM_LOGOS[lower]) return TEAM_LOGOS[lower];
  for (const [key, url] of Object.entries(TEAM_LOGOS)) {
    if (lower.includes(key) || key.includes(lower)) return url;
  }
  return null;
}

export function teamInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
