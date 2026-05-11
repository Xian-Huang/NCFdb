import { ArrowRight, Database, Users, BookOpen, FlaskConical, Leaf, Dna, Megaphone, Workflow } from "lucide-react";
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

  const pipelines = [
    "Germplasm registration and sample metadata normalization",
    "Trait, nutrition and molecular dataset curation",
    "Search, comparison and downstream analysis tool integration",
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero Section - Split Screen */}
      <section className="relative h-[420px] overflow-hidden mb-8 rounded-[1.75rem] shadow-2xl">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/hero-bg.jpg"
            alt="Flax field with blue flowers"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex">
          <div className="w-full md:w-1/2 bg-gradient-to-r from-blue-950/95 to-blue-800/80 flex items-center">
            <div className="px-10 py-12">
              <div className="flex items-center gap-3 mb-4">
                <Dna className="h-8 w-8 text-blue-300" />
                <span className="text-blue-300 font-medium">FlaxNCFdb</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                {t("home.title")}
              </h1>
              <p className="text-blue-100 mb-6 leading-relaxed">
                {t("home.subtitle")}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/data"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  {t("home.explore")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium backdrop-blur-sm border border-white/20"
                >
                  {t("home.analysisTools")}
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-1/2"></div>
        </div>
      </section>

      {/* Scrolling News Bar */}
      {scrollingNews.length > 0 && (
        <section className="mb-6 bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-blue-500 text-white">
            <Megaphone className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">最新通知</span>
          </div>
          <div className="relative h-8 overflow-hidden">
            <div className="absolute inset-0 transition-all duration-500 ease-in-out">
              {scrollingNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`h-8 flex items-center px-4 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors ${index === currentNewsIndex ? 'block' : 'hidden'}`}
                >
                  {news.category && (
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded mr-2 flex-shrink-0">
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

      {/* Stats Section - Bento Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[200px]">
          <div className="col-span-1 row-span-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 flex flex-col justify-between">
            <div className="text-blue-100 text-sm">{t("home.stats.varieties")}</div>
            <div>
              <div className="text-4xl font-bold text-white">25</div>
              <div className="text-blue-200 text-xs">Varieties</div>
            </div>
          </div>
          <div className="col-span-2 row-span-1 bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
            <div>
              <div className="text-gray-500 text-xs">{t("home.stats.genes")}</div>
              <div className="text-2xl font-bold text-gray-800">35K+</div>
            </div>
            <Dna className="h-10 w-10 text-blue-500 opacity-50" />
          </div>
          <div className="col-span-1 row-span-2 bg-white rounded-xl p-5 flex flex-col justify-center items-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-800 mb-1">50</div>
            <div className="text-xs text-gray-500">{t("home.stats.regions")}</div>
          </div>
          <div className="col-span-1 row-span-1 bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
            <div>
              <div className="text-gray-500 text-xs">{t("home.stats.partners")}</div>
              <div className="text-xl font-bold text-gray-800">20+</div>
            </div>
            <Users className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-4 flex items-end justify-between">
            <div>
              <div className="text-indigo-200 text-xs">Total</div>
              <div className="text-xl font-bold text-white">100+</div>
            </div>
            <Database className="h-6 w-6 text-white opacity-70" />
          </div>
        </div>
      </section>

      {/* Features - Zigzag Cards */}
      <section className="mb-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Flax Research Portal</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">{t("home.services")}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            FlaxNCFdb focuses on flax germplasm, oil and fiber-related traits, genome resources and analysis services for molecular breeding and nutrition evaluation.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/data" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0">
                  <Database className="h-7 w-7 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700">{t("home.genomicData")}</h3>
                  <p className="text-sm text-gray-500">{t("home.genomicDataDesc")}</p>
                </div>
              </div>
            </Link>
            
            <Link to="/data" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0">
                  <Leaf className="h-7 w-7 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700">{t("home.varieties")}</h3>
                  <p className="text-sm text-gray-500">{t("home.varietiesDesc")}</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/tools" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0">
                  <FlaskConical className="h-7 w-7 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700">{t("home.analysisTools")}</h3>
                  <p className="text-sm text-gray-500">{t("home.analysisToolsDesc")}</p>
                </div>
              </div>
            </Link>
            
            <Link to="/news" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0">
                  <BookOpen className="h-7 w-7 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700">{t("nav.news")}</h3>
                  <p className="text-sm text-gray-500">{t("home.newsUpdates")}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
          <Workflow className="mb-4 h-9 w-9 text-blue-100" />
          <h3 className="text-xl font-bold">Data Curation Workflow</h3>
          <p className="mt-2 text-sm leading-6 text-blue-100">
            A lightweight workflow view helps researchers understand how raw records become searchable flax database resources.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {pipelines.map((item, index) => (
              <div key={item} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item}</p>
                  <p className="mt-1 text-sm text-gray-500">Supports traceable records and comparative analysis across experiments.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates - Magazine Style */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("home.newsUpdates")}</h2>
        {loading ? (
          <p className="text-gray-500">{t("home.loading")}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {changelog.map((item, index) => (
              <Link 
                key={item.id} 
                to={`/changelog/${item.id}`}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden ${index === 0 ? 'md:row-span-2' : ''}`}
              >
                <div className={`bg-gradient-to-r ${index === 0 ? 'from-blue-500 to-indigo-600' : 'from-blue-100 to-indigo-100'} p-4`}>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${index === 0 ? 'bg-white/20 text-white' : 'bg-white text-blue-700'}`}>
                    v{item.version}
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-400 mb-2">{formatDate(item.release_date)}</div>
                  <h3 className={`font-bold text-gray-800 mb-2 group-hover:text-blue-700 ${index === 0 ? 'text-xl' : ''}`}>{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3">{item.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
