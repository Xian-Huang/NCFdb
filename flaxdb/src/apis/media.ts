export const resolveMediaUrl = (value: unknown, fallback = "") => {
  const source = String(value ?? "").trim();
  const target = source || fallback;
  if (!target) return "";
  if (/^(data:|blob:)/i.test(target)) return target;
  if (target.startsWith("/api/media/")) return target;
  if (/^https?:/i.test(target)) {
    try {
      const url = new URL(target);
      if (url.pathname.startsWith("/api/media/")) {
        return `${url.pathname}${url.search}${url.hash}`;
      }
      if (url.pathname.startsWith("/media/")) {
        return `/api${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      return target;
    }
    return target;
  }
  if (target.startsWith("media/")) {
    return `/api/${target}`;
  }
  if (target.startsWith("/media/")) {
    return `/api${target}`;
  }
  if (/^(news_images|uploads)\//i.test(target)) {
    return `/api/media/${target}`;
  }
  return target;
};
