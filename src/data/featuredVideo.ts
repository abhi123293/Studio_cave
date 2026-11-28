export interface FeaturedVideoConfig {
  /** Replace this single URL with any standard YouTube share, watch, shorts, or embed URL. */
  youtubeUrl: string;
  eyebrow: string;
  title: string;
  filmLabel: string;
  /** Optional local or remote preview poster override if you want a custom still instead of YouTube's thumbnail. */
  customPosterSrc?: string;
  fallbackPosterSrc: string;
}

export const FEATURED_VIDEO: FeaturedVideoConfig = {
  youtubeUrl: "https://youtu.be/yjK9a7LtwfI?si=n5dY-7ge9oKgdG2A",
  eyebrow: "FEATURED FILM",
  title: "Architecture Experienced In Motion.",
  filmLabel: "STUDIO CAVE WALKTHROUGH",
  fallbackPosterSrc: "/images/services/architecture.webp",
};

/**
 * Extracts an 11-character YouTube video ID from share links (`youtu.be/...`),
 * watch links (`youtube.com/watch?v=...`), `/embed/`, `/shorts/`, `/live/`,
 * or raw IDs so changing `FEATURED_VIDEO.youtubeUrl` is always one line.
 */
export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const candidate = parsed.pathname.split("/").filter(Boolean)[0];
      return candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate)
        ? candidate
        : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const watchId = parsed.searchParams.get("v");
      if (watchId && /^[a-zA-Z0-9_-]{11}$/.test(watchId)) {
        return watchId;
      }

      const segments = parsed.pathname.split("/").filter(Boolean);
      const markerIdx = segments.findIndex((seg) =>
        ["embed", "shorts", "live", "v"].includes(seg)
      );
      if (markerIdx !== -1 && segments[markerIdx + 1]) {
        const pathId = segments[markerIdx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(pathId) ? pathId : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubePosterCandidates(
  videoId: string | null,
  customPosterSrc?: string,
  fallbackPosterSrc = "/images/services/architecture.webp"
): string[] {
  const candidates: string[] = [];
  if (customPosterSrc) candidates.push(customPosterSrc);
  if (videoId) {
    candidates.push(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
    candidates.push(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
  }
  candidates.push(fallbackPosterSrc);
  return candidates;
}
