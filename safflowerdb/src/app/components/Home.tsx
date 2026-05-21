import { ArrowRight, Database, Users, BookOpen, Droplets, Sun, Megaphone, FlaskConical, Activity, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchSafflowerChangelog, fetchSafflowerScrollingNews } from "../../apis/data_apis";

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

export function Home() {
  const { t } = useTranslation();
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);
  const [scrollingNews, setScrollingNews] = useState<ScrollingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    fetchSafflowerChangelog()
      .then((data) => {
        setChangelog(data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch changelog:", err);
        setLoading(false);
      });

    fetchSafflowerScrollingNews()
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

  const resourceHighlights = [
    { title: "Pigment Components", desc: "Curated references for safflower yellow, flavonoids and related quality indicators.", icon: FlaskConical },
    { title: "Functional Evaluation", desc: "Trait-oriented records for oil-use, medicinal-use and stress-adaptive germplasm screening.", icon: Activity },
    { title: "Traceable Updates", desc: "Changelog and news entries help users follow dataset releases and project progress.", icon: FileSearch },
  ];

  const serviceStats = [
    { value: "25", label: t("home.stats.varieties"), icon: Droplets },
    { value: "35K+", label: t("home.stats.genes"), icon: Sun },
    { value: "50", label: t("home.stats.regions"), icon: Users },
    { value: "20+", label: t("home.stats.partners"), icon: Database },
  ];

  const serviceCards = [
    {
      to: "/data",
      title: t("home.genomicData"),
      desc: t("home.genomicDataDesc"),
      detail: "Genome assemblies, gene annotations, expression references and downloadable research datasets.",
      tags: ["Genome", "Expression", "Download"],
      icon: Database,
    },
    {
      to: "/data",
      title: t("home.varieties"),
      desc: t("home.varietiesDesc"),
      detail: "Curated safflower accessions with origin, trait notes, quality indicators and evaluation context.",
      tags: ["Germplasm", "Traits", "Quality"],
      icon: Droplets,
    },
    {
      to: "/tools",
      title: t("home.analysisTools"),
      desc: t("home.analysisToolsDesc"),
      detail: "Search, browse and compare records across functional compounds, gene resources and phenotypic traits.",
      tags: ["Search", "Browse", "Compare"],
      icon: Users,
    },
    {
      to: "/news",
      title: t("nav.news"),
      desc: t("home.newsUpdates"),
      detail: "Release notes, curation logs and project updates for tracking changes in the database resource.",
      tags: ["News", "Release", "Curation"],
      icon: BookOpen,
    },
  ];

  return (
    <div className="bg-rose-50/40">
      {/* Hero Section - Diagonal Split */}
      <section className="relative h-[380px] overflow-hidden rounded-[1.75rem] shadow-xl">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/safflower-hero.png"
            alt="Safflower red flowers"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-800/60 to-transparent flex items-center">
          <div className="container mx-auto px-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-red-500/80 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                  Database
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                {t("home.title")}
              </h1>
              <p className="text-lg text-red-100 mb-5">
                {t("home.subtitle")}
              </p>
              <Link
                to="/data"
                className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg"
              >
                {t("home.explore")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Database Services - Metrics + Service Cards */}
      <section className="mb-10 mt-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="h-full rounded-2xl border border-red-100 bg-white p-5 shadow-lg shadow-red-100/60">
            <div className="rounded-xl bg-gradient-to-br from-red-700 to-rose-600 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-100">Resource scale</p>
              <h2 className="mt-3 text-2xl font-bold">Safflower core metrics</h2>
              <p className="mt-3 text-sm leading-6 text-red-50">
                A vertical snapshot of the germplasm, gene and collaboration scope behind this resource.
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {serviceStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.value} className="flex items-center gap-4 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-4">
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xl font-bold leading-none text-slate-950">{item.value}</span>
                      <span className="mt-1 block text-sm font-medium text-slate-600">{item.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="flex h-full flex-col rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Safflower Research Database</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">{t("home.services")}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                SafflowerDB brings together germplasm, functional compounds, nutrition quality and project updates to support safflower resource evaluation and applied research.
              </p>
            </div>
            <div className="grid flex-1 gap-5 md:grid-cols-2">
              {serviceCards.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={`${item.to}-${item.title}`} to={item.to} className="group flex h-full flex-col rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 transition-all hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg transition-transform group-hover:scale-105">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-700">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-red-300 transition-all group-hover:translate-x-1 group-hover:text-red-500" />
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-red-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 grid gap-3 border-t border-red-100 pt-5 md:grid-cols-3">
              {[
                { label: "Curate", text: "Standardize source records, sample metadata and trait descriptions." },
                { label: "Integrate", text: "Connect germplasm, compound, gene and expression evidence." },
                { label: "Release", text: "Publish versioned datasets with news and changelog tracking." },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-red-700">{item.label}</div>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {scrollingNews.length > 0 && (() => {
        const activeNews = scrollingNews[currentNewsIndex] || scrollingNews[0];
        return (
          <section className="mb-8 pt-2">
            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] lg:items-stretch">
              <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white">
                  <Megaphone className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-200">Database activity</p>
                <h2 className="mt-2 text-2xl font-bold">News and release focus</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  SafflowerDB presents recent curation notes, compound data releases and collaboration updates as a prominent side module.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{scrollingNews.length}</div>
                    <div className="mt-1 text-xs text-red-100">active notices</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-red-100">selected item</div>
                  </div>
                </div>
              </aside>
              <article className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
                <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1fr)_180px]">
                  <div className="flex min-h-[260px] flex-col justify-between p-6 sm:p-7">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-semibold uppercase tracking-[0.14em] text-red-700">
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
                      <Link to={`/news/${activeNews.id}`} className="inline-flex items-center text-sm font-semibold text-red-700 hover:text-red-900">
                        Read update <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                      <div className="flex gap-2">
                        {scrollingNews.map((news, index) => (
                          <button
                            key={news.id}
                            type="button"
                            aria-label={`Show notice ${index + 1}`}
                            onClick={() => setCurrentNewsIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentNewsIndex ? "w-7 bg-red-600" : "w-2 bg-slate-300 hover:bg-red-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-red-100 bg-red-50/70 p-5 lg:border-l lg:border-t-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Current item</div>
                    <div className="mt-2 text-3xl font-bold text-red-800">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-slate-500">of {scrollingNews.length} database notices</div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        );
      })()}

      <section className="mb-8 grid gap-5 md:grid-cols-3">
        {resourceHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={cleanText(item.title, "Database release note")} className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{cleanText(item.title, "Database release note")}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Latest Updates - Horizontal List */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("home.newsUpdates")}</h2>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500">{t("home.loading")}</p>
          ) : (
            changelog.map((item) => (
              <Link 
                key={item.id} 
                to={`/changelog/${item.id}`}
                className="flex items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group"
              >
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-red-600 font-bold">v{item.version}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-red-700 truncate">{cleanText(item.title, "Database release note")}</h3>
                  <p className="text-sm text-gray-500 truncate">{cleanText(item.content, "Database content and interface updates are available for this release.")}</p>
                </div>
                <div className="ml-4 flex items-center text-gray-400 group-hover:text-red-500">
                  <span className="text-sm mr-2">{formatDate(item.release_date)}</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
