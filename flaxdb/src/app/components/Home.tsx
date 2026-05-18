import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Database,
  Dna,
  FlaskConical,
  Leaf,
  Megaphone,
  Network,
  ScanSearch,
  Users,
  Workflow,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchChangelog, fetchFlaxScrollingNews } from "../../apis/data_apis";

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

const flaxStats = [
  { value: "25", label: "Varieties", desc: "curated accessions", icon: Leaf },
  { value: "35K+", label: "Genes", desc: "annotation records", icon: Dna },
  { value: "50", label: "Regions", desc: "trial sources", icon: Network },
  { value: "20+", label: "Partners", desc: "research teams", icon: Users },
];

const omicsPanels = [
  {
    title: "Genome Resources",
    desc: "Reference gene records, resequencing indexes and variation-ready resource entries for flax molecular research.",
    icon: Dna,
    to: "/data",
  },
  {
    title: "Oil & Fiber Traits",
    desc: "Trait-oriented records for seed oil quality, fiber-use characters and nutrition evaluation.",
    icon: BarChart3,
    to: "/data",
  },
  {
    title: "Analysis Utilities",
    desc: "Search and analysis tools for comparing germplasm, datasets and curated research outputs.",
    icon: ScanSearch,
    to: "/tools",
  },
];

const pipelineRows = [
  { step: "01", title: "Sample Layer", desc: "accession identity, origin and batch metadata" },
  { step: "02", title: "Omics Layer", desc: "gene annotation, molecular markers and variation records" },
  { step: "03", title: "Trait Layer", desc: "oil quality, fiber traits and nutrition indicators" },
  { step: "04", title: "Service Layer", desc: "search, comparison, tools and release notes" },
];

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

    fetchFlaxScrollingNews()
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

  return (
    <div className="bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-blue-100">
          <div className="grid gap-3 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.55rem]">
              <ImageWithFallback
                src="/hero-bg.jpg"
                alt="Flax field with blue flowers"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-800 backdrop-blur">
                FlaxNCFdb
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                  <Dna className="h-4 w-4" />
                  Linum usitatissimum research viewer
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  A focused resource for flax genome records, oil quality, fiber traits and nutrition-oriented evaluation.
                </p>
              </div>
            </div>

            <div className="rounded-[1.55rem] bg-white p-7 sm:p-8 lg:p-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800">
                <FlaskConical className="h-4 w-4" />
                Omics analysis workspace
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                {t("home.title")}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                {t("home.subtitle")}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
                FlaxNCFdb presents germplasm, genome annotation, oil and fiber trait records as an analysis-ready database for molecular breeding and crop nutrition research.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/data"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition-colors hover:bg-blue-700"
                >
                  {t("home.explore")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-800 transition-colors hover:bg-blue-50"
                >
                  {t("home.analysisTools")}
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {flaxStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <Icon className="mb-3 h-5 w-5 text-blue-600" />
                      <div className="text-2xl font-bold text-slate-950">{item.value}</div>
                      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {scrollingNews.length > 0 && (
        <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm md:grid-cols-[180px_1fr]">
            <div className="flex items-center gap-2 bg-blue-600 px-5 py-3 text-sm font-medium text-white">
              <Megaphone className="h-4 w-4 flex-shrink-0" />
              最新通知
            </div>
            <div className="relative h-11 overflow-hidden">
              {scrollingNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`h-11 items-center px-4 text-sm text-slate-700 ${index === currentNewsIndex ? "flex" : "hidden"}`}
                >
                  {news.category && (
                    <span className="mr-3 flex-shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {news.category}
                    </span>
                  )}
                  <span className="truncate">{news.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Resource Console</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">{t("home.services")}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            The flax portal is organized as an analysis console: core resources, trait panels and tools are shown as operational modules instead of generic content cards.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {omicsPanels.map((panel) => {
            const Icon = panel.icon;
            return (
              <Link
                key={panel.title}
                to={panel.to}
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{panel.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{panel.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Workflow className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Data Pipeline</p>
                <h2 className="text-xl font-bold text-slate-950">Layered flax data model</h2>
              </div>
            </div>
            <div className="space-y-3">
              {pipelineRows.map((row) => (
                <div key={row.step} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[64px_1fr]">
                  <div className="text-2xl font-bold text-blue-600">{row.step}</div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{row.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Snapshot</p>
            <h2 className="mt-2 text-2xl font-bold">Flax research indicators</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {flaxStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                    <Icon className="mb-3 h-5 w-5 text-blue-200" />
                    <div className="text-3xl font-bold">{item.value}</div>
                    <div className="mt-1 text-xs font-medium text-blue-100">{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Release Notes</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{t("home.newsUpdates")}</h2>
          </div>
          <BookOpen className="hidden h-9 w-9 text-blue-600 sm:block" />
        </div>
        {loading ? (
          <p className="text-gray-500">{t("home.loading")}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {changelog.map((item) => (
              <Link
                key={item.id}
                to={`/changelog/${item.id}`}
                className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    v{item.version}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(item.release_date)}</span>
                </div>
                <h3 className="font-semibold text-slate-950 hover:text-blue-700">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.content}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
