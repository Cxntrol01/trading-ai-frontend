import { Candle } from "@/lib/structure";

const BASE_URL = "https://api.massive.com/polygon";

export async function fetchMassiveCandles(
  symbol: string,
  timespan: "minute" | "hour" | "day" = "minute",
  limit = 300
): Promise<Candle[]> {
  const apiKey = process.env.NEXT_PUBLIC_MASSIVE_API_KEY;
  if (!apiKey) throw new Error("Missing NEXT_PUBLIC_MASSIVE_API_KEY");

  const now = new Date();
  const from = new Date(now.getTime() - 1000 * 60 * limit);

  const url = `${BASE_URL}/v2/aggs/ticker/${symbol.toUpperCase()}/range/1/${timespan}/${from.toISOString()}/${now.toISOString()}?adjusted=true&sort=asc&limit=${limit}&apiKey=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Massive data");

  const json = await res.json();
  if (!json.results) return [];

  return json.results.map((r: any) => ({
    time: Math.floor(r.t / 1000),
    open: r.o,
    high: r.h,
    low: r.l,
    close: r.c,
    volume: r.v,
  }));
}
