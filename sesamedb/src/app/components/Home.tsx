import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Database,
  FlaskConical,
  Megaphone,
  Microscope,
  Search,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchChangelog, fetchScrollingNews } from "../../apis/data_apis";
import { cropConfig } from "../cropConfig";

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

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return text && hasCjk(text) ? text : fallback;
};
const plainText = (value: unknown) => String(value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export function Home() {
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);
  const [scrollingNews, setScrollingNews] = useState<ScrollingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    fetchChangelog()
      .then((data: ChangelogItem[]) => {
        setChangelog(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch changelog:", err);
        setLoading(false);
      });

    fetchScrollingNews()
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
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  };

  const dataOverview = [
    { value: "15", label: t("home.dataOverview.metabolome.label"), note: t("home.dataOverview.metabolome.note") },
    { value: "52", label: t("home.dataOverview.resequencing.label"), note: t("home.dataOverview.resequencing.note") },
    { value: "17", label: t("home.dataOverview.proteome.label"), note: t("home.dataOverview.proteome.note") },
    { value: "50+", label: t("home.dataOverview.publications.label"), note: t("home.dataOverview.publications.note") },
  ];

  const researchModules = [
    { title: t("home.modules.nutritionTitle"), desc: t("home.modules.nutritionDesc"), icon: FlaskConical },
    { title: t("home.modules.omicsTitle"), desc: t("home.modules.omicsDesc"), icon: Microscope },
    { title: t("home.modules.germplasmTitle"), desc: t("home.modules.germplasmDesc"), icon: Sprout },
  ];

  const workflowSteps = [
    t("home.scientific.workflow1"),
    t("home.scientific.workflow2"),
    t("home.scientific.workflow3"),
  ];

  const researchAxes = [
    [t("home.context.axes.oilTitle"), t("home.context.axes.oilDesc")],
    [t("home.context.axes.adaptationTitle"), t("home.context.axes.adaptationDesc")],
    [t("home.context.axes.molecularTitle"), t("home.context.axes.molecularDesc")],
  ];

  const contextTags = [
    t("home.context.tags.oil"),
    t("home.context.tags.nutrition"),
    t("home.context.tags.salt"),
    t("home.context.tags.broomrape"),
    t("home.context.tags.genes"),
  ];

  return (
    <div className="bg-[#f8faf5]">
      <section className="border-b border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-900 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              {t("home.heroBadge")}
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {t("home.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {t("home.subtitle")}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              {t("home.heroDescription")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/data"
                className="inline-flex items-center rounded-xl bg-orange-500 px-6 py-3 font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-700"
              >
                {t("home.explore")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center rounded-xl border border-orange-200 bg-white px-6 py-3 font-medium text-orange-900 transition-colors hover:bg-orange-50"
              >
                {t("home.analysisTools")}
              </Link>
            </div>
          </div>

          <div className="self-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-orange-100">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <ImageWithFallback
                  src="/hero-bg.jpg"
                  alt={t("home.context.imageAlt")}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
                  <div className="text-sm font-semibold text-slate-900">{t("home.atlasTitle")}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-600">
                    {t("home.atlasDesc")}
                  </div>
                </div>
              </div>
            </div>
            <div className="-mt-6 mx-4 grid grid-cols-2 gap-3 rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-xl backdrop-blur">
              {dataOverview.map((item) => (
                <div key={item.label} className="rounded-xl bg-orange-50/80 p-4">
                  <div className="text-2xl font-bold text-slate-950">{item.value}</div>
                  <div className="mt-1 text-sm font-medium text-orange-900">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">{t("home.resourcesEyebrow")}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{t("home.resourcesTitle")}</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              {t("home.resourcesDesc")}
            </p>
          </div>
          <Link to="/data" className="inline-flex items-center text-sm font-semibold text-orange-800 hover:text-orange-900">
            {t("home.browseDatasets")} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link to="/data" className="group rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Database className="mb-5 h-11 w-11 text-orange-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-orange-800">{t("home.genomicData")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.genomicDataDesc")}</p>
          </Link>
          <Link to="/tools" className="group rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Search className="mb-5 h-11 w-11 text-orange-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-orange-800">{t("home.analysisTools")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.analysisToolsDesc")}</p>
          </Link>
          <Link to="/events" className="group rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Users className="mb-5 h-11 w-11 text-orange-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-orange-800">{t("home.varieties")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.varietiesDesc")}</p>
          </Link>
        </div>
      </section>
      {scrollingNews.length > 0 && (() => {
        const activeNews = scrollingNews[currentNewsIndex] || scrollingNews[0];
        return (
          <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] lg:items-stretch">
              <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-slate-950">
                  <Megaphone className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">{t("home.scrolling.eyebrow")}</p>
                <h2 className="mt-2 text-2xl font-bold">{t("home.scrolling.title")}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {t("home.scrolling.desc")}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{scrollingNews.length}</div>
                    <div className="mt-1 text-xs text-orange-100">{t("home.scrolling.activeNotices")}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-orange-100">{t("home.scrolling.selectedItem")}</div>
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
                          {t("home.scrolling.latestUpdates")}
                        </span>
                        {activeNews.category && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{cleanText(activeNews.category, t("common.notice"))}</span>}
                        <span>{formatDate(activeNews.publish_time)}</span>
                      </div>
                      <h2 className="line-clamp-3 text-2xl font-bold leading-snug text-slate-950">{cleanText(activeNews.title, t("home.scrolling.fallbackTitle"))}</h2>
                      <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{cleanText(plainText(activeNews.content), t("home.scrolling.fallbackContent"))}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      <Link to={`/news/${activeNews.id}`} className="inline-flex items-center text-sm font-semibold text-orange-700 hover:text-orange-900">
                        {t("home.scrolling.readUpdate")} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                      <div className="flex gap-2">
                        {scrollingNews.map((news, index) => (
                          <button
                            key={news.id}
                            type="button"
                            aria-label={t("home.scrolling.showNotice", { index: index + 1 })}
                            onClick={() => setCurrentNewsIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentNewsIndex ? "w-7 bg-orange-600" : "w-2 bg-slate-300 hover:bg-orange-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-orange-100 bg-orange-50/70 p-5 lg:border-l lg:border-t-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">{t("home.scrolling.currentItem")}</div>
                    <div className="mt-2 text-3xl font-bold text-orange-800">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-slate-500">{t("home.scrolling.ofNotices", { count: scrollingNews.length })}</div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        );
      })()}

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div className="rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-slate-950">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold">{t("home.scientific.title")}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {t("home.scientific.desc")}
          </p>
          <div className="mt-6 grid gap-3">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-slate-950">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-100">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {researchModules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-800">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-orange-100 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="relative overflow-hidden rounded-[1.75rem]">
            <ImageWithFallback
              src="/hero-bg.jpg"
              alt={t("home.context.fieldAlt")}
              className="h-full min-h-[300px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">{t("home.context.eyebrow")}</p>
              <h2 className="mt-2 text-3xl font-bold">{t("home.context.title")}</h2>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">{t("home.context.signalEyebrow")}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{t("home.context.signalTitle")}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              {t("home.context.signalDesc")}
            </p>

            <div className="mt-7 divide-y divide-orange-100 border-y border-orange-100">
              {researchAxes.map(([title, desc]) => (
                <div key={title} className="grid gap-3 py-4 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-orange-900">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {contextTags.map((tag) => (
                <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800 ring-1 ring-orange-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">{t("home.releaseNotes")}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{t("home.newsUpdates")}</h2>
          </div>
          <BookOpen className="hidden h-10 w-10 sm:block" style={{ color: cropConfig.accent }} />
        </div>
        {loading ? (
          <p className="text-gray-500">{t("home.loading")}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {changelog.map((item) => (
              <Link
                key={item.id}
                to={`/changelog/${item.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm text-orange-700">{formatDate(item.release_date)}</div>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-900">
                    v{item.version}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950 hover:text-orange-700">{cleanText(item.title, t("home.releaseFallbackTitle"))}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{cleanText(item.content, t("home.releaseFallbackContent"))}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
