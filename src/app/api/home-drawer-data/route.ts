import { NextResponse } from "next/server";
import { EventType } from "@/lib/bal-admin/type";
import { NewsType } from "@/lib/mattermost/type";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { fetchNews } from "@/lib/mattermost";

const CACHE_TIME = 60 * 60 * 1000; // 1 hour

let cachedData: {
  nextTrainings: EventType[];
  news: NewsType[];
  timestamp: number;
} | null = null;

/** Fetch news from an optional demo/override URL. Expects JSON array or { news: NewsType[] }. */
async function fetchNewsFromUrl(url: string): Promise<NewsType[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`News URL returned ${res.status}`);
  const body = await res.json();
  const raw = Array.isArray(body) ? body : body?.news;
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any) => ({
    id: String(item?.id ?? ""),
    message: String(item?.message ?? ""),
    date: item?.date != null ? String(item.date) : "",
  }));
}

/** Fetch events/trainings from an optional demo/override URL. Expects JSON array or { events: EventType[] }. */
async function fetchEventsFromUrl(url: string): Promise<EventType[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Events URL returned ${res.status}`);
  const body = await res.json();
  const raw = Array.isArray(body) ? body : body?.events ?? body?.nextTrainings;
  return Array.isArray(raw) ? raw : [];
}

export async function GET() {
  const now = Date.now();

  if (cachedData && now - cachedData.timestamp < CACHE_TIME) {
    return NextResponse.json(cachedData);
  }

  const newsUrl = process.env.HOME_DRAWER_NEWS_URL;
  const eventsUrl = process.env.HOME_DRAWER_EVENTS_URL;

  let news: NewsType[] = [];
  let nextTrainings: EventType[] = [];

  try {
    if (newsUrl) {
      news = await fetchNewsFromUrl(newsUrl);
    } else {
      news = await fetchNews();
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  try {
    if (eventsUrl) {
      nextTrainings = await fetchEventsFromUrl(eventsUrl);
    } else {
      nextTrainings = await ApiBalAdminService.fetchNextTrainings();
    }
  } catch (error) {
    console.error("Error fetching next trainings:", error);
  }

  cachedData = {
    news,
    nextTrainings,
    timestamp: now,
  };

  return NextResponse.json(cachedData);
}
