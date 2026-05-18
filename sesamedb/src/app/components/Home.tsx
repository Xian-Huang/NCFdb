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
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-green-100/60">
            <ImageWithFallback
              src="/hero-bg.jpg"
              alt="Sesame seeds and plant"
              className="h-full min-h-[460px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/92 p-6 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">Sesamum indicum collection</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Germplasm, oil quality and lignan records</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A sesame-focused visual entry for nutrition resources and functional component research.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-[2rem] border border-green-100 bg-white p-8 shadow-sm">
              <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
                <span className="rounded-full bg-green-50 px-3 py-1 ring-1 ring-green-100">SesameDB</span>
                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-green-100">Nutrition archive</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-slate-950">{t("home.title")}</h1>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {t("home.subtitle")} The database highlights sesame germplasm, functional lignans, oil quality and searchable research records.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/data"
                  className="inline-flex items-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  {t("home.explore")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center rounded-xl border border-green-200 bg-white px-6 py-3 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50"
                >
                  {t("home.analysisTools")}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sesameStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <Icon className="h-5 w-5 text-green-700" />
                      <span className="text-xs font-semibold uppercase text-green-700">{item.label}</span>
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

      {scrollingNews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm md:grid-cols-[160px_1fr]">
            <div className="flex items-center gap-2 bg-green-600 px-5 py-3 text-sm font-medium text-white">
              <Megaphone className="h-4 w-4 flex-shrink-0" />
              最新通知
            </div>
            <div className="relative h-11 min-w-0 overflow-hidden">
              {scrollingNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`h-11 items-center px-4 text-sm text-slate-700 ${index === currentNewsIndex ? "flex" : "hidden"}`}
                >
                  {news.category && (
                    <span className="mr-3 flex-shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        {focusAreas.map((area) => {
          const Icon = area.icon;
          return (
            <div key={area.title} className="rounded-[1.75rem] border border-green-100 bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{area.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{area.desc}</p>
            </div>
          );
        })}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-[1.75rem] border border-green-100 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">Trait register</p>
              <h2 className="text-2xl font-bold text-slate-950">Sesame research records</h2>
            </div>
            <Bean className="h-8 w-8 text-green-700" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-green-100">
            {sesameMatrix.map((row, index) => (
              <div key={row.trait} className={`grid gap-3 px-5 py-4 text-sm sm:grid-cols-[1fr_1.3fr_auto] ${index % 2 === 0 ? "bg-green-50/60" : "bg-white"}`}>
                <span className="font-semibold text-slate-900">{row.trait}</span>
                <span className="text-slate-600">{row.record}</span>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-green-100">{row.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-green-100 bg-white p-7 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">Release notes</p>
              <h2 className="text-2xl font-bold text-slate-950">{t("home.newsUpdates")}</h2>
            </div>
            <BookOpen className="h-8 w-8 text-green-700" />
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">{t("home.loading")}</p>
          ) : (
            <div className="space-y-3">
              {changelog.map((item) => (
                <Link
                  key={item.id}
                  to={`/changelog/${item.id}`}
                  className="block rounded-2xl border border-green-100 bg-white p-4 transition-colors hover:bg-green-50"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">v{item.version}</span>
                    <span className="text-xs text-slate-400">{formatDate(item.release_date)}</span>
                  </div>
                  <h3 className="line-clamp-1 font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{item.content}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
