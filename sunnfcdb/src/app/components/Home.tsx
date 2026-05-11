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

const dataOverview = [
  { value: "15", label: "Metabolome", note: "seed nutrition profiles" },
  { value: "52", label: "Resequencing", note: "genetic variation records" },
  { value: "17", label: "Proteome", note: "protein expression datasets" },
  { value: "50+", label: "Publications", note: "curated references" },
];

const researchModules = [
  {
    title: "Nutrition Quality",
    desc: "Oil composition, seed quality and nutrition-related indicators for sunflower germplasm evaluation.",
    icon: FlaskConical,
  },
  {
    title: "Multi-omics Resources",
    desc: "Metabolome, proteome and resequencing datasets organized for trait discovery and comparative analysis.",
    icon: Microscope,
  },
  {
    title: "Germplasm Comparison",
    desc: "Variety information, regional adaptation notes and trait summaries for breeding-oriented screening.",
    icon: Sprout,
  },
];

const workflowSteps = [
  "Sample registration and metadata standardization",
  "Nutrition trait, omics and literature curation",
  "Search, visualization and analysis service integration",
];

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
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="bg-[#f8faf5]">
      <section className="border-b border-amber-100 bg-gradient-to-br from-amber-50 via-white to-lime-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-800 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Sunflower Nutrition & Functional Database
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {t("home.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {t("home.subtitle")}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              The platform integrates sunflower germplasm, nutrition traits, multi-omics datasets and literature updates to support quality evaluation, functional component discovery and molecular breeding research.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/data"
                className="inline-flex items-center rounded-xl bg-amber-500 px-6 py-3 font-medium text-white shadow-lg shadow-amber-200 transition-colors hover:bg-amber-600"
              >
                {t("home.explore")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center rounded-xl border border-amber-200 bg-white px-6 py-3 font-medium text-amber-800 transition-colors hover:bg-amber-50"
              >
                {t("home.analysisTools")}
              </Link>
            </div>
          </div>

          <div className="self-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-amber-100">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <ImageWithFallback
                  src="/hero-bg.jpg"
                  alt="Sunflower"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
                  <div className="text-sm font-semibold text-slate-900">Helianthus annuus research atlas</div>
                  <div className="mt-1 text-xs leading-5 text-slate-600">
                    Nutrition traits, omics evidence and curated database services in one searchable portal.
                  </div>
                </div>
              </div>
            </div>
            <div className="-mt-6 mx-4 grid grid-cols-2 gap-3 rounded-2xl border border-amber-100 bg-white/95 p-4 shadow-xl backdrop-blur">
              {dataOverview.map((item) => (
                <div key={item.label} className="rounded-xl bg-amber-50/80 p-4">
                  <div className="text-2xl font-bold text-slate-950">{item.value}</div>
                  <div className="mt-1 text-sm font-medium text-amber-800">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {scrollingNews.length > 0 && (
        <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-amber-100 bg-amber-500 px-4 py-3 text-white">
              <Megaphone className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">最新通知</span>
            </div>
            <div className="relative h-10 overflow-hidden">
              {scrollingNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`h-10 items-center px-4 text-sm text-slate-700 transition-colors hover:bg-amber-50 ${index === currentNewsIndex ? "flex" : "hidden"}`}
                >
                  {news.category && (
                    <span className="mr-3 flex-shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">Research Resources</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Curated sunflower data services</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Data, tools and project updates are organized around the practical needs of sunflower nutrition analysis and database-driven discovery.
            </p>
          </div>
          <Link to="/data" className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800">
            Browse datasets <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link to="/data" className="group rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Database className="mb-5 h-11 w-11 text-amber-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-amber-700">{t("home.genomicData")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.genomicDataDesc")}</p>
          </Link>
          <Link to="/tools" className="group rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Search className="mb-5 h-11 w-11 text-amber-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-amber-700">{t("home.analysisTools")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.analysisToolsDesc")}</p>
          </Link>
          <Link to="/events" className="group rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Users className="mb-5 h-11 w-11 text-amber-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-amber-700">{t("home.varieties")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.varietiesDesc")}</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div className="rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold">Scientific focus</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The homepage highlights sunflower-specific research objects, including seed nutrition, oil quality, multi-omics evidence and traceable project updates.
          </p>
          <div className="mt-6 grid gap-3">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-950">
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
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-r from-amber-500 to-yellow-500 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {dataOverview.map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/12 p-5 backdrop-blur">
                <div className="text-4xl font-bold">{item.value}</div>
                <div className="mt-2 text-sm font-medium text-amber-50">{item.label}</div>
                <div className="mt-1 text-xs text-amber-100">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">Release Notes</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{t("home.newsUpdates")}</h2>
          </div>
          <BookOpen className="hidden h-10 w-10 text-amber-400 sm:block" />
        </div>
        {loading ? (
          <p className="text-gray-500">{t("home.loading")}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {changelog.map((item) => (
              <Link
                key={item.id}
                to={`/changelog/${item.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm text-amber-600">{formatDate(item.release_date)}</div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    v{item.version}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950 hover:text-amber-600">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.content}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
