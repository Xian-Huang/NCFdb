import { ArrowLeft, Calendar, Eye, Tag, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNewsDetail } from "../../apis/data_apis";
import { resolveMediaUrl } from "../../apis/media";
import { cropConfig } from "../cropConfig";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  image?: string;
  image_url?: string;
  category: string;
  tags: string;
  views: number;
  is_published: boolean;
  create_time: string;
  update_time: string;
  publish_time: string;
}

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return text && hasCjk(text) ? text : fallback;
};
const normalizeParagraphs = (value: string) => String(value || "").replace(/<\/p>/g, "\n").replace(/<[^>]*>/g, "").split("\n").map((item) => item.trim()).filter((item) => item && hasCjk(item));
const isNewsImage = (value: string) => {
  const source = String(value || "").trim();
  return Boolean(source) && !source.includes("/media/http");
};
const newsMediaFallback = "/hero-bg.jpg";
const imageSrc = (item: NewsItem) => {
  const source = item.image_url || item.image || "";
  if (isNewsImage(source)) return resolveMediaUrl(source, newsMediaFallback);
  return resolveMediaUrl(newsMediaFallback);
};

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchNewsDetail(parseInt(id))
      .then((data: NewsItem) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch news:", err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">{t("common.loading")}</div>;

  if (!news) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8"><h1 className="text-2xl font-bold text-slate-900">{t("detail.newsNotFound")}</h1><Link to="/news" className="mt-4 inline-block" style={{ color: cropConfig.accent }}>{t("common.backNews")}</Link></div>;
  }

  const tagList = news.tags ? news.tags.split(",").map((t) => cleanText(t.trim(), "")).filter(Boolean) : [];
  const paragraphs = normalizeParagraphs(news.content);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/news" className="mb-6 inline-flex items-center text-slate-600 transition-colors hover:opacity-80"><ArrowLeft className="mr-2 h-4 w-4" />{t("common.backNews")}</Link>

      <article className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-xl">
        <div className="relative min-h-[360px] overflow-hidden">
          <ImageWithFallback src={imageSrc(news)} alt={cleanText(news.title, t("news.fallbackAlt"))} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
          <div className="relative flex min-h-[360px] flex-col justify-end p-7 text-white md:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/85">
              {news.category && <span className="rounded-full bg-white/15 px-3 py-1 font-medium backdrop-blur">{cleanText(news.category, t("common.update"))}</span>}
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(news.publish_time)}</span>
              <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{cleanText(news.author, t("common.team"))}</span>
              <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" />{news.views} {t("common.views")}</span>
            </div>
            <h1 className="max-w-4xl text-3xl font-bold leading-tight md:text-5xl">{cleanText(news.title, t("news.fallbackTitle"))}</h1>
          </div>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[1fr_240px] md:p-10">
          <div>
            {tagList.length > 0 && <div className="mb-8 flex flex-wrap gap-2">{tagList.map((tag) => <span key={tag} className="inline-flex items-center rounded-full px-3 py-1 text-sm" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}><Tag className="mr-1 h-3 w-3" />{tag}</span>)}</div>}
            <div className="max-w-none text-slate-700">
              {(paragraphs.length ? paragraphs : [t("common.databaseDescription")]).map((paragraph, index) => <p key={index} className="mb-5 text-base leading-8">{paragraph}</p>)}
            </div>
            <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">{t("detail.publishedUpdated", { published: formatDateTime(news.publish_time), updated: formatDateTime(news.update_time) })}</div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 p-5" style={{ backgroundColor: cropConfig.accentSoft }}>
            <h2 className="text-lg font-semibold text-slate-950">{t("detail.aboutDb", { name: cropConfig.dbName })}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("common.databaseDescription")}</p>
            <Link to="/data" className="mt-5 inline-flex items-center text-sm font-semibold" style={{ color: cropConfig.accent }}>{t("common.browseDatasets")}</Link>
          </aside>
        </div>
      </article>
    </div>
  );
}



