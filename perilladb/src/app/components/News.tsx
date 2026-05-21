import { ArrowRight, Calendar, Newspaper, Tag, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNews } from "../../apis/data_apis";
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
const plainText = (value: string) => String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return !text || hasCjk(text) ? fallback : text;
};
const imageSrc = (item: NewsItem, index = 0) => {
  const source = item.image_url || item.image || "";
  if (source && !hasCjk(source) && !source.includes("/media/http")) return source;
  return cropConfig.fallbackNewsImages[index % cropConfig.fallbackNewsImages.length] || cropConfig.pageImages.news;
};

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { t } = useTranslation();

  useEffect(() => {
    fetchNews()
      .then((data: NewsItem[]) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch news:", err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(news.map((item) => cleanText(item.category, "")).filter(Boolean)))], [news]);
  const filteredNews = selectedCategory === "All" ? news : news.filter((item) => cleanText(item.category, "") === selectedCategory);
  const featured = filteredNews[0];

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">{t("news.loading")}</div>;
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[1.75rem] p-8 text-white shadow-xl" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.84), rgba(15,23,42,.42)), url(${cropConfig.pageImages.news})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="relative max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Newspaper className="h-4 w-4" />
              {cropConfig.cropName} research updates
            </div>
            <h1 className="text-4xl font-bold mb-4">{t("news.title")}</h1>
            <p className="max-w-3xl text-lg text-white/85">{t("news.subtitle")}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">{cropConfig.databaseIntro}</p>
          </div>
        </section>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className="rounded-full border px-4 py-2 text-sm transition-colors" style={selectedCategory === category ? { backgroundColor: cropConfig.accent, borderColor: cropConfig.accent, color: "white" } : { backgroundColor: "white", borderColor: "#e5e7eb", color: "#334155" }}>
              {category === "All" ? t("news.categories.all") : category}
            </button>
          ))}
        </div>


        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>Editorial scope</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">What appears in database news</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              News records document dataset releases, curation decisions, trait highlights, community events and analysis notes. Each story is treated as a lightweight release note so users can understand what changed and where to find the related database evidence.
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>Reading guide</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Release context", "Linked resource", "Research impact"].map((item) => <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700">{item}</div>)}
            </div>
          </div>
        </section>
        {featured && (
          <Link to={`/news/${featured.id}`} className="group grid overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
            <div className="h-56 overflow-hidden md:h-64">
              <ImageWithFallback src={imageSrc(featured, 0)} alt={cleanText(featured.title, `${cropConfig.cropName} database news`)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-7">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                {featured.category && <span className="rounded-full px-3 py-1 font-medium" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{cleanText(featured.category, "Update")}</span>}
                <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(featured.publish_time)}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950 group-hover:opacity-80">{cleanText(featured.title, `${cropConfig.cropName} database update`)}</h2>
              <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">{cleanText(plainText(featured.content), cropConfig.databaseIntro)}</p>
              <span className="mt-6 inline-flex items-center font-semibold" style={{ color: cropConfig.accent }}>Read full story <ArrowRight className="ml-1 h-4 w-4" /></span>
            </div>
          </Link>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNews.slice(featured ? 1 : 0).map((item, index) => {
            const tags = item.tags ? item.tags.split(",").map((tag) => cleanText(tag.trim(), "")).filter(Boolean).slice(0, 3) : [];
            return (
              <article key={item.id} className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <Link to={`/news/${item.id}`} className="block h-48 overflow-hidden">
                  <ImageWithFallback src={imageSrc(item, index + 1)} alt={cleanText(item.title, `${cropConfig.cropName} database news`)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {item.category && <span className="rounded-full px-2.5 py-1 font-medium" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{cleanText(item.category, "Update")}</span>}
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(item.publish_time)}</span>
                  </div>
                  <h2 className="line-clamp-2 text-xl font-semibold text-slate-950"><Link to={`/news/${item.id}`}>{cleanText(item.title, `${cropConfig.cropName} database update`)}</Link></h2>
                  <div className="mt-3 flex items-center text-sm text-slate-500"><User className="mr-1 h-4 w-4" />{cleanText(item.author, "NCFdb Team")}</div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{cleanText(plainText(item.content), cropConfig.databaseIntro)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => <span key={tag} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"><Tag className="mr-1 h-3 w-3" />{tag}</span>)}
                  </div>
                  <Link to={`/news/${item.id}`} className="mt-auto inline-flex items-center pt-5 text-sm font-semibold" style={{ color: cropConfig.accent }}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredNews.length === 0 && <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">{t("news.noNews")}</p>}
      </div>
    </div>
  );
}

