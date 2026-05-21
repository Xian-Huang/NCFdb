import { ArrowRight, Database, Users, BookOpen, Beaker, Flower2, Megaphone, Leaf, Sparkles, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchChangelog, fetchPerillaScrollingNews } from "../../apis/data_apis";
import { cropConfig } from "../cropConfig";

const hasCjk = (value: string) => /[\u3400-\u9fff]/.test(value);
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
    fetchChangelog()
      .then((data: ChangelogItem[]) => {
        setChangelog(data.slice(0, 3));
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch changelog:", err);
        setLoading(false);
      });

    fetchPerillaScrollingNews()
      .then((data: ScrollingNewsItem[]) => {
        setScrollingNews(data);
      })
      .catch((err: any) => {
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

  const knowledgeCards = [
    { title: "Volatile Compounds", desc: "Records for aroma-related metabolites and chemical phenotype comparison.", icon: Sparkles },
    { title: "Leaf & Seed Traits", desc: "Phenotypic indicators for edible, medicinal and oil-use perilla resources.", icon: Leaf },
    { title: "Curated References", desc: "Versioned knowledge entries, project news and literature-oriented updates.", icon: ClipboardList },
  ];

  return (
    <div className="bg-gradient-to-b to-white" style={{ backgroundImage: `linear-gradient(to bottom, ${cropConfig.accentSoft}, white)` }}>
      {/* Hero Section - Centered */}
      <section className="relative h-[450px] overflow-hidden rounded-[2rem] shadow-2xl">
        <ImageWithFallback
          src="/perilla-hero.png"
          alt="Perilla leaves"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(to bottom, ${cropConfig.accentDark}cc, ${cropConfig.accent}88, ${cropConfig.accentDark}cc)` }}>
          <div className="text-center max-w-3xl px-4">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-1 text-sm font-medium text-white backdrop-blur">
              <Flower2 className="h-4 w-4" />
              Perilla nutrition and functional traits
            </div>
            <h1 className="text-5xl font-bold text-white mb-5 tracking-wide">
              {t("home.title")}
            </h1>
            <p className="text-xl text-white/85 mb-8 leading-relaxed">
              {t("home.subtitle")}
            </p>
            <Link
              to="/data"
              className="inline-flex items-center px-8 py-4 text-white rounded-full transition-all font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: cropConfig.accent }}
            >
              {t("home.explore")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>


      {/* Stats Section - Botanical Summary Panel */}
      <section className="mb-10 mt-8 px-4 sm:px-6 lg:px-0">
        <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: cropConfig.accent }}>
                Data snapshot
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Perilla resource overview</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Current coverage for edible, medicinal and aromatic perilla records, presented as a quick reference before entering detailed datasets.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { value: "25", label: t("home.stats.varieties"), icon: Flower2 },
              { value: "35K+", label: t("home.stats.genes"), icon: Leaf },
              { value: "50", label: t("home.stats.regions"), icon: Users },
              { value: "20+", label: t("home.stats.partners"), icon: Database },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.value} className="group rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-semibold text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-8 text-4xl font-bold tracking-normal" style={{ color: cropConfig.accentDark }}>
                    {item.value}
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-600">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features - 2x2 Grid with Icons */}
      <section className="mb-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("home.services")}
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            PerillaDB emphasizes perilla germplasm, volatile metabolites, leaf nutrition and functional trait resources for edible and medicinal plant research.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/data" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-slate-300 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-600 transition-colors flex-shrink-0">
                <Database className="h-8 w-8 text-slate-700 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-slate-800">{t("home.genomicData")}</h3>
                <p className="text-gray-500">{t("home.genomicDataDesc")}</p>
              </div>
            </div>
          </Link>

          <Link to="/data" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-slate-300 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-600 transition-colors flex-shrink-0">
                <Flower2 className="h-8 w-8 text-slate-700 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-slate-800">{t("home.varieties")}</h3>
                <p className="text-gray-500">{t("home.varietiesDesc")}</p>
              </div>
            </div>
          </Link>

          <Link to="/tools" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-slate-300 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-600 transition-colors flex-shrink-0">
                <Beaker className="h-8 w-8 text-slate-700 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-slate-800">{t("home.analysisTools")}</h3>
                <p className="text-gray-500">{t("home.analysisToolsDesc")}</p>
              </div>
            </div>
          </Link>

          <Link to="/news" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-slate-300 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-600 transition-colors flex-shrink-0">
                <BookOpen className="h-8 w-8 text-slate-700 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-slate-800">{t("nav.news")}</h3>
                <p className="text-gray-500">{t("home.newsUpdates")}</p>
              </div>
            </div>
          </Link>
        </div>
      </section>
      {scrollingNews.length > 0 && (() => {
        const activeNews = scrollingNews[currentNewsIndex] || scrollingNews[0];
        return (
          <section className="mb-8 pt-2">
            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] lg:items-stretch">
              <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: cropConfig.accent }}>
                  <Megaphone className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: cropConfig.accentSoft }}>Database activity</p>
                <h2 className="mt-2 text-2xl font-bold">News and release focus</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  PerillaDB places current data releases and curation notices beside the resource cards as a larger homepage activity module.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{scrollingNews.length}</div>
                    <div className="mt-1 text-xs text-slate-200">active notices</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-slate-200">selected item</div>
                  </div>
                </div>
              </aside>
              <article className="overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${cropConfig.accent}22` }}>
                <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1fr)_180px]">
                  <div className="flex min-h-[260px] flex-col justify-between p-6 sm:p-7">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold uppercase tracking-[0.14em]" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>
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
                      <Link to={`/news/${activeNews.id}`} className="inline-flex items-center text-sm font-semibold" style={{ color: cropConfig.accentDark }}>
                        Read update <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                      <div className="flex gap-2">
                        {scrollingNews.map((news, index) => (
                          <button
                            key={news.id}
                            type="button"
                            aria-label={`Show notice ${index + 1}`}
                            onClick={() => setCurrentNewsIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentNewsIndex ? "w-7" : "w-2 bg-slate-300"}`}
                            style={index === currentNewsIndex ? { backgroundColor: cropConfig.accent } : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-5 lg:border-l lg:border-t-0" style={{ borderColor: `${cropConfig.accent}22`, backgroundColor: cropConfig.accentSoft }}>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: cropConfig.accentDark }}>Current item</div>
                    <div className="mt-2 text-3xl font-bold" style={{ color: cropConfig.accentDark }}>{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-slate-500">of {scrollingNews.length} database notices</div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        );
      })()}

      <section className="mb-8 grid gap-5 md:grid-cols-3">
        {knowledgeCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{card.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Latest Updates - Large Cards */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t("home.newsUpdates")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500 text-center col-span-3">{t("home.loading")}</p>
          ) : (
            changelog.map((item) => (
              <Link 
                key={item.id} 
                to={`/changelog/${item.id}`}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-full text-sm">
                    v{item.version}
                  </span>
                  <span className="text-sm text-gray-400">{formatDate(item.release_date)}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-slate-800">{cleanText(item.title, "Database release note")}</h3>
                <p className="text-gray-500">{cleanText(item.content, "Database content and interface updates are available for this release.")}</p>
                <div className="mt-4 flex items-center text-slate-700 font-medium">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
