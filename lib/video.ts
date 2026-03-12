const DEFAULT_VIDEO_THUMBNAIL = "/assets/images/services/s1.png";

type VideoProvider = "youtube" | "vimeo" | "dailymotion" | "unknown";

function parseUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function getYouTubeVideoId(url: string) {
  const parsedUrl = parseUrl(url);

  if (!parsedUrl) {
    return null;
  }

  const hostname = parsedUrl.hostname.replace(/^www\./, "");

  if (hostname === "youtu.be") {
    return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (hostname === "youtube.com" || hostname === "m.youtube.com") {
    const watchId = parsedUrl.searchParams.get("v");

    if (watchId) {
      return watchId;
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    const markerIndex = parts.findIndex((part) =>
      ["embed", "shorts", "v", "live"].includes(part)
    );

    if (markerIndex >= 0) {
      return parts[markerIndex + 1] ?? null;
    }
  }

  const regexMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );

  return regexMatch?.[1] ?? null;
}

function getVimeoVideoId(url: string) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

function getDailymotionVideoId(url: string) {
  const match = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

export function detectVideoProvider(url: string): VideoProvider {
  if (getYouTubeVideoId(url)) {
    return "youtube";
  }

  if (getVimeoVideoId(url)) {
    return "vimeo";
  }

  if (getDailymotionVideoId(url)) {
    return "dailymotion";
  }

  return "unknown";
}

export function getVideoThumbnailUrl(
  url: string,
  fallback = DEFAULT_VIDEO_THUMBNAIL
) {
  const provider = detectVideoProvider(url);

  if (provider === "youtube") {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : fallback;
  }

  if (provider === "vimeo") {
    const videoId = getVimeoVideoId(url);
    return videoId ? `https://vumbnail.com/${videoId}.jpg` : fallback;
  }

  if (provider === "dailymotion") {
    const videoId = getDailymotionVideoId(url);
    return videoId
      ? `https://www.dailymotion.com/thumbnail/video/${videoId}`
      : fallback;
  }

  return fallback;
}

export function getVideoEmbedUrl(url: string, autoplay = false) {
  const provider = detectVideoProvider(url);

  if (provider === "youtube") {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`
      : url;
  }

  if (provider === "vimeo") {
    const videoId = getVimeoVideoId(url);
    return videoId
      ? `https://player.vimeo.com/video/${videoId}${autoplay ? "?autoplay=1" : ""}`
      : url;
  }

  if (provider === "dailymotion") {
    const videoId = getDailymotionVideoId(url);
    return videoId
      ? `https://www.dailymotion.com/embed/video/${videoId}${autoplay ? "?autoplay=1" : ""}`
      : url;
  }

  return url;
}

export { DEFAULT_VIDEO_THUMBNAIL };