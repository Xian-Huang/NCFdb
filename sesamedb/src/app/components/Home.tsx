import {
  ArrowRight,
  Bean,
  BookOpen,
  Database,
  FlaskConical,
  Layers,
  LeafyGreen,
  Megaphone,
  Search,
  Sprout,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchSesameScrollingNews, fetchSesameChangelogs } from "../../apis/data_apis";

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return !text || hasCjk(text) ? fallback : text;
};
const plainText = (value: unknown) => String(value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

interface ScrollingNewsItem {
  id: number;
  title: string;
  content: string;
  category: string;
  publish_time: string;
}

interface ChangelogItem {
  id: number;
  version: string;
  title: string;
  content: string;
  changes: string[];
  release_date: string;
  is_published: boolean;
}

const sesameStats = [
  { value: "25", label: "Varieties", desc: "representative germplasm", icon: Bean },
  { value: "35K+", label: "Genes", desc: "genome-scale annotations", icon: LeafyGreen },
  { value: "50", label: "Regions", desc: "collection and trial sources", icon: Database },
  { value: "20+", label: "Partners", desc: "research collaborators", icon: Users },
];

const focusAreas = [
  {
    title: "Lignan profile",
    desc: "Sesamin, sesamolin and antioxidant-related component records.",
    icon: FlaskConical,
  },
  {
    title: "Accession archive",
    desc: "Origin, phenotype, batch and nutrition profile information.",
    icon: Layers,
  },
  {
    title: "Knowledge lookup",
    desc: "Dataset, tool, news and version entries for repeatable use.",
    icon: Search,
  },
];

const sesameMatrix = [
  { trait: "Oil quality", record: "fatty acid profile", status: "curated" },
  { trait: "Functional compounds", record: "sesamin / sesamolin", status: "featured" },
  { trait: "Phenotype", record: "seed color and plant type", status: "indexed" },
  { trait: "Origin", record: "region and trial source", status: "mapped" },
];

export function Home() {
  const { t } = useTranslation();
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);
  const [scrollingNews, setScrollingNews] = useState<ScrollingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    fetchSesameChangelogs()
      .then((data) => {
        setChangelog(data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch changelog:", err);
        setLoading(false);
      });

    fetchSesameScrollingNews()
      .then((data) => {
        setScrollingNews(data);
      })
      .catch((err) => {
        console.error("Failed to fetch scrolling news:", err);
      });
  }, []);

  // Auto rotate news every 3 seconds
  useEffect(() => {
    if (scrollingNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % scrollingNews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollingNews.length]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="bg-[#f7faf6] text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-orange-100/60">
            <ImageWithFallback
              src="/hero-bg.jpg"
              alt="Sesame seeds and plant"
              className="h-full min-h-[460px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/92 p-6 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Sesamum indicum collection</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Germplasm, oil quality and lignan records</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A sesame-focused visual entry for nutrition resources and functional component research.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
              <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                <span className="rounded-full bg-orange-50 px-3 py-1 ring-1 ring-orange-100">SesameDB</span>
                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-orange-100">Nutrition archive</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-slate-950">{t("home.title")}</h1>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {t("home.subtitle")} The database highlights sesame germplasm, functional lignans, oil quality and searchable research records.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/data"
                  className="inline-flex items-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                >
                  {t("home.explore")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center rounded-xl border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-50"
                >
                  {t("home.analysisTools")}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sesameStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <Icon className="h-5 w-5 text-orange-700" />
                      <span className="text-xs font-semibold uppercase text-orange-700">{item.label}</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-950">{item.value}</div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        {focusAreas.map((area) => {
          const Icon = area.icon;
          return (
            <div key={area.title} className="rounded-[1.75rem] border border-orange-100 bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{area.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{area.desc}</p>
            </div>
          );
        })}
      </section>
      {scrollingNews.length > 0 && (() => {
        const activeNews = scrollingNews[currentNewsIndex] || scrollingNews[0];
        return (
          <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] lg:items-stretch">
              <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <Megaphone className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">Database activity</p>
                <h2 className="mt-2 text-2xl font-bold">News and release focus</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  SesameDB groups release notes and project notices beside the research cards so visitors can scan updates without leaving the homepage flow.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{scrollingNews.length}</div>
                    <div className="mt-1 text-xs text-orange-100">active notices</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-orange-100">selected item</div>
                  </div>
                </div>
              </aside>
              <article className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1fr)_180px]">
                  <div className="flex min-h-[260px] flex-col justify-between p-6 sm:p-7">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 font-semibold uppercase tracking-[0.14em] text-orange-700">
                          <Megaphone className="h-3.5 w-3.5" />
                          Latest updates
                        </span>
                        {activeNews.category && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{cleanText(activeNews.category, "Notice")}</span>}
                        <span>{formatDate(activeNews.publish_time)}</span>
                      </div>
                      <h2 className="line-clamp-3 text-2xl font-bold leading-snug text-slate-950">{cleanText(activeNews.title, "Database content update")}</h2>
                      <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{cleanText(plainText(activeNews.content), "Database content and project updates are available for this release.")}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      <Link to={`/news/${activeNews.id}`} className="inline-flex items-center text-sm font-semibold text-orange-700 hover:text-orange-900">
                        Read update <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                      <div className="flex gap-2">
                        {scrollingNews.map((news, index) => (
                          <button
                            key={news.id}
                            type="button"
                            aria-label={`Show notice ${index + 1}`}
                            onClick={() => setCurrentNewsIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentNewsIndex ? "w-7 bg-orange-600" : "w-2 bg-slate-300 hover:bg-orange-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-orange-100 bg-orange-50/70 p-5 lg:border-l lg:border-t-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">Current item</div>
                    <div className="mt-2 text-3xl font-bold text-orange-800">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-slate-500">of {scrollingNews.length} database notices</div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        );
      })()}

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-[1.75rem] border border-orange-100 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Trait register</p>
              <h2 className="text-2xl font-bold text-slate-950">Sesame research records</h2>
            </div>
            <Bean className="h-8 w-8 text-orange-700" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-orange-100">
            {sesameMatrix.map((row, index) => (
              <div key={row.trait} className={`grid gap-3 px-5 py-4 text-sm sm:grid-cols-[1fr_1.3fr_auto] ${index % 2 === 0 ? "bg-orange-50/60" : "bg-white"}`}>
                <span className="font-semibold text-slate-900">{row.trait}</span>
                <span className="text-slate-600">{row.record}</span>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-orange-800 ring-1 ring-orange-100">{row.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-orange-100 bg-white p-7 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Release notes</p>
              <h2 className="text-2xl font-bold text-slate-950">{t("home.newsUpdates")}</h2>
            </div>
            <BookOpen className="h-8 w-8 text-orange-700" />
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">{t("home.loading")}</p>
          ) : (
            <div className="space-y-3">
              {changelog.map((item) => (
                <Link
                  key={item.id}
                  to={`/changelog/${item.id}`}
                  className="block rounded-2xl border border-orange-100 bg-white p-4 transition-colors hover:bg-orange-50"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800">v{item.version}</span>
                    <span className="text-xs text-slate-400">{formatDate(item.release_date)}</span>
                  </div>
                  <h3 className="line-clamp-1 font-semibold text-slate-950">{cleanText(item.title, "Database release note")}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{cleanText(item.content, "Database content and interface updates are available for this release.")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
