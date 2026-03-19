export type Game = {
  date: string;
  opponent: string;
  gf: number;
  ga: number;
  result: "W" | "L" | "T";
};

export const games: Game[] = [
  { date: "2025-10-04", opponent: "SJHA Totems", gf: 4, ga: 3, result: "W" },
  { date: "2025-10-11", opponent: "SJHA Eagles", gf: 2, ga: 3, result: "L" },
  { date: "2025-10-18", opponent: "SJHA Americans", gf: 3, ga: 2, result: "W" },
  { date: "2025-10-25", opponent: "Kent", gf: 4, ga: 1, result: "W" },
  { date: "2025-10-26", opponent: "Sno-King Rotoli", gf: 4, ga: 3, result: "W" },
  { date: "2025-11-01", opponent: "Kraken White", gf: 9, ga: 0, result: "W" },
  { date: "2025-11-02", opponent: "Tacoma", gf: 6, ga: 5, result: "W" },
  { date: "2025-11-15", opponent: "Kraken Blue", gf: 4, ga: 3, result: "W" },
  { date: "2025-11-16", opponent: "Sno-King Szabo", gf: 5, ga: 4, result: "W" },
  { date: "2025-11-22", opponent: "Sno-King Longfellow", gf: 10, ga: 1, result: "W" },
  { date: "2025-11-29", opponent: "Everett (Tournament)", gf: 2, ga: 2, result: "T" },
  { date: "2025-11-29", opponent: "Sno-King Szabo (Tournament)", gf: 7, ga: 1, result: "W" },
  { date: "2025-11-30", opponent: "Surrey (Tournament)", gf: 2, ga: 5, result: "L" },
  { date: "2025-11-30", opponent: "Surrey (Tournament)", gf: 5, ga: 3, result: "W" },
  { date: "2025-12-06", opponent: "West Sound", gf: 8, ga: 4, result: "W" },
  { date: "2025-12-07", opponent: "Everett", gf: 3, ga: 1, result: "W" },
  { date: "2025-12-12", opponent: "TriCities", gf: 6, ga: 0, result: "W" },
  { date: "2025-12-13", opponent: "Wenatchee", gf: 3, ga: 7, result: "L" },
  { date: "2025-12-13", opponent: "Moses Lake", gf: 7, ga: 3, result: "W" },
  { date: "2025-12-14", opponent: "Eugene Gold", gf: 6, ga: 3, result: "W" },
  { date: "2025-12-20", opponent: "Sno-King Millwater", gf: 6, ga: 2, result: "W" },
  { date: "2026-01-23", opponent: "Spokane Jr Chiefs", gf: 7, ga: 1, result: "W" },
  { date: "2026-01-24", opponent: "Yakima Hawks", gf: 5, ga: 0, result: "W" },
  { date: "2026-01-24", opponent: "Palouse Bears", gf: 1, ga: 5, result: "L" },
  { date: "2026-01-25", opponent: "Klamath Ice Hawks", gf: 4, ga: 1, result: "W" },
  { date: "2026-01-25", opponent: "Palouse Bears", gf: 2, ga: 6, result: "L" },
  { date: "2026-01-31", opponent: "Sno-King Rotoli", gf: 5, ga: 1, result: "W" },
  { date: "2026-02-07", opponent: "SJHA Totems", gf: 1, ga: 4, result: "L" },
  { date: "2026-02-21", opponent: "Sno-King Scofield", gf: 8, ga: 2, result: "W" },
  { date: "2026-02-27", opponent: "Sno-King Rotoli", gf: 4, ga: 3, result: "W" },
  { date: "2026-03-02", opponent: "Sno-King Millwater (SKAHA)", gf: 8, ga: 2, result: "W" },
  { date: "2026-03-05", opponent: "Sno-King Longfellow (SKAHA) Championship", gf: 3, ga: 2, result: "W" },
  { date: "2026-03-07", opponent: "West Sound", gf: 10, ga: 4, result: "W" },
  { date: "2026-03-08", opponent: "SJHA Eagles (MHL Championship)", gf: 5, ga: 3, result: "W" },
  { date: "2026-03-13", opponent: "Sno-King Millwater", gf: 3, ga: 0, result: "W" },
  { date: "2026-03-14", opponent: "Kraken", gf: 1, ga: 2, result: "L" },
  { date: "2026-03-14", opponent: "Spokane", gf: 4, ga: 4, result: "T" },
  { date: "2026-03-15", opponent: "Everett", gf: 9, ga: 0, result: "W" }
];
