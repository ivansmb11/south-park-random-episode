import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SOUTH_PARK_SERIES_ID = 2190;
const TMDB_BASE = "https://api.themoviedb.org/3";

interface TMDBSeason {
  season_number: number;
  episode_count: number;
}

interface TMDBEpisode {
  id: number;
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  still_path: string | null;
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const tmdbApiKey = Deno.env.get("TMDB_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const today = todayUTC();

    // 1. Check if today's episode already exists
    const { data: existing, error: selectError } = await supabase
      .from("daily_episodes")
      .select("*")
      .eq("date", today)
      .maybeSingle();

    if (selectError) {
      throw new Error(`DB select error: ${selectError.message}`);
    }

    if (existing) {
      return new Response(
        JSON.stringify({ data: existing, source: "db" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch series details to get season list
    const seriesRes = await fetch(
      `${TMDB_BASE}/tv/${SOUTH_PARK_SERIES_ID}?api_key=${tmdbApiKey}`
    );
    if (!seriesRes.ok) {
      throw new Error(`TMDB series fetch failed: ${seriesRes.status}`);
    }
    const series = await seriesRes.json();

    // Filter out specials (season 0) and get real seasons
    const seasons: TMDBSeason[] = (series.seasons || []).filter(
      (s: TMDBSeason) => s.season_number > 0
    );

    if (seasons.length === 0) {
      throw new Error("No seasons found");
    }

    // 3. Get recently used episode IDs (last 30 days)
    const { data: recentRows } = await supabase
      .from("daily_episodes")
      .select("tmdb_id")
      .gte("date", new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10))
      .order("date", { ascending: false });

    const recentIds = new Set((recentRows || []).map((r: { tmdb_id: number }) => r.tmdb_id));

    // 4. Shuffle seasons and find an eligible episode
    let picked: TMDBEpisode | null = null;

    for (const season of shuffle(seasons)) {
      const seasonRes = await fetch(
        `${TMDB_BASE}/tv/${SOUTH_PARK_SERIES_ID}/season/${season.season_number}?api_key=${tmdbApiKey}`
      );
      if (!seasonRes.ok) continue;

      const seasonData = await seasonRes.json();
      const episodes: TMDBEpisode[] = seasonData.episodes || [];

      // Find episodes not recently used
      const eligible = shuffle(episodes).filter((ep) => !recentIds.has(ep.id));

      if (eligible.length > 0) {
        picked = eligible[0];
        break;
      }
    }

    // 5. Fallback: if all episodes were recently used, pick any random one
    if (!picked) {
      const fallbackSeason = seasons[Math.floor(Math.random() * seasons.length)];
      const seasonRes = await fetch(
        `${TMDB_BASE}/tv/${SOUTH_PARK_SERIES_ID}/season/${fallbackSeason.season_number}?api_key=${tmdbApiKey}`
      );
      if (seasonRes.ok) {
        const seasonData = await seasonRes.json();
        const episodes: TMDBEpisode[] = seasonData.episodes || [];
        if (episodes.length > 0) {
          picked = episodes[Math.floor(Math.random() * episodes.length)];
        }
      }
    }

    if (!picked) {
      throw new Error("Could not pick an episode");
    }

    // 6. Upsert into daily_episodes
    const row = {
      date: today,
      tmdb_id: picked.id,
      season_number: picked.season_number,
      episode_number: picked.episode_number,
      name: picked.name,
      overview: picked.overview || "",
      air_date: picked.air_date,
      vote_average: picked.vote_average,
      vote_count: picked.vote_count,
      runtime: picked.runtime,
      still_path: picked.still_path,
      poster_path: null,
    };

    const { data: inserted, error: upsertError } = await supabase
      .from("daily_episodes")
      .upsert(row, { onConflict: "date" })
      .select()
      .single();

    if (upsertError) {
      throw new Error(`DB upsert error: ${upsertError.message}`);
    }

    return new Response(
      JSON.stringify({ data: inserted, source: "edge-function" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("daily-episode error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
