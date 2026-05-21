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

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return !text || hasCjk(text) ? fallback : text;
};
const plainText = (value: unknown) => String(value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

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
      <section className="border-b border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 shadow-sm">
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
                className="inline-flex items-center rounded-xl bg-green-500 px-6 py-3 font-medium text-white shadow-lg shadow-amber-200 transition-colors hover:bg-green-700"
              >
                {t("home.explore")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center rounded-xl border border-green-200 bg-white px-6 py-3 font-medium text-green-900 transition-colors hover:bg-green-50"
              >
                {t("home.analysisTools")}
              </Link>
            </div>
          </div>

          <div className="self-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-green-100">
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
            <div className="-mt-6 mx-4 grid grid-cols-2 gap-3 rounded-2xl border border-green-100 bg-white/95 p-4 shadow-xl backdrop-blur">
              {dataOverview.map((item) => (
                <div key={item.label} className="rounded-xl bg-green-50/80 p-4">
                  <div className="text-2xl font-bold text-slate-950">{item.value}</div>
                  <div className="mt-1 text-sm font-medium text-green-900">{item.label}</div>
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">Research Resources</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Curated sunflower data services</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Data, tools and project updates are organized around the practical needs of sunflower nutrition analysis and database-driven discovery.
            </p>
          </div>
          <Link to="/data" className="inline-flex items-center text-sm font-semibold text-green-800 hover:text-green-900">
            Browse datasets <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link to="/data" className="group rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Database className="mb-5 h-11 w-11 text-green-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-green-800">{t("home.genomicData")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.genomicDataDesc")}</p>
          </Link>
          <Link to="/tools" className="group rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Search className="mb-5 h-11 w-11 text-green-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-green-800">{t("home.analysisTools")}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("home.analysisToolsDesc")}</p>
          </Link>
          <Link to="/events" className="group rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Users className="mb-5 h-11 w-11 text-green-500" />
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-green-800">{t("home.varieties")}</h3>
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
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-slate-950">
                  <Megaphone className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200">Database activity</p>
                <h2 className="mt-2 text-2xl font-bold">News and release focus</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Curated notices summarize sunflower data releases, nutrition updates and project milestones before researchers enter the detailed news archive.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{scrollingNews.length}</div>
                    <div className="mt-1 text-xs text-green-100">active notices</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-3xl font-bold">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-green-100">selected item</div>
                  </div>
                </div>
              </aside>
              <article className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
                <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1fr)_180px]">
                  <div className="flex min-h-[260px] flex-col justify-between p-6 sm:p-7">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 font-semibold uppercase tracking-[0.14em] text-green-700">
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
                      <Link to={`/news/${activeNews.id}`} className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-900">
                        Read update <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                      <div className="flex gap-2">
                        {scrollingNews.map((news, index) => (
                          <button
                            key={news.id}
                            type="button"
                            aria-label={`Show notice ${index + 1}`}
                            onClick={() => setCurrentNewsIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentNewsIndex ? "w-7 bg-green-600" : "w-2 bg-slate-300 hover:bg-green-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-green-100 bg-green-50/70 p-5 lg:border-l lg:border-t-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">Current item</div>
                    <div className="mt-2 text-3xl font-bold text-green-800">{String(currentNewsIndex + 1).padStart(2, "0")}</div>
                    <div className="mt-1 text-xs text-slate-500">of {scrollingNews.length} database notices</div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        );
      })()}

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div className="rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-slate-950">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold">Scientific focus</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The homepage highlights sunflower-specific research objects, including seed nutrition, oil quality, multi-omics evidence and traceable project updates.
          </p>
          <div className="mt-6 grid gap-3">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-slate-950">
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
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-800">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-green-100 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="relative overflow-hidden rounded-[1.75rem]">
            <ImageWithFallback
              src="/hero-bg.jpg"
              alt="Sunflower field"
              className="h-full min-h-[300px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-100">Species context</p>
              <h2 className="mt-2 text-3xl font-bold">Helianthus annuus evidence map</h2>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">Beyond summary metrics</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Research signals organized for sunflower quality discovery</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Instead of repeating headline counts, this section explains how SunflowerDB connects oil composition, stress adaptation and candidate gene evidence across germplasm records, field notes and omics files.
            </p>

            <div className="mt-7 divide-y divide-green-100 border-y border-green-100">
              {[
                ["Oil quality axis", "Fatty acid composition, seed nutrition indicators and functional component records are linked to accession metadata."],
                ["Adaptation axis", "Salt tolerance, broomrape resistance and regional trial notes help users compare germplasm under field-relevant conditions."],
                ["Molecular evidence axis", "Genome annotation, expression evidence and variation records support candidate gene screening and downstream validation."],
              ].map(([title, desc]) => (
                <div key={title} className="grid gap-3 py-4 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-green-900">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["oil composition", "seed nutrition", "salt tolerance", "broomrape resistance", "candidate genes"].map((tag) => (
                <span key={tag} className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800 ring-1 ring-green-100">
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">Release Notes</p>
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
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm text-green-700">{formatDate(item.release_date)}</div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-900">
                    v{item.version}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950 hover:text-green-700">{cleanText(item.title, "Database release note")}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{cleanText(item.content, "Database content and interface updates are available for this release.")}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
