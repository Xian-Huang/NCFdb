import { ArrowRight, Database, Users, BookOpen, Droplets, Sun, Megaphone, FlaskConical, Activity, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchSafflowerChangelog, fetchSafflowerScrollingNews } from "../../apis/data_apis";

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

  return (
    <div className="bg-rose-50/40">
      {/* Hero Section - Diagonal Split */}
      <section className="relative h-[380px] overflow-hidden mb-8 rounded-[1.75rem] shadow-xl">
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

      {/* Scrolling News Bar */}
      {scrollingNews.length > 0 && (
        <section className="mb-6 bg-red-50 border border-red-200 rounded-xl overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-red-500 text-white">
            <Megaphone className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">最新通知</span>
          </div>
          <div className="relative h-8 overflow-hidden">
            <div className="absolute inset-0 transition-all duration-500 ease-in-out">
              {scrollingNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`h-8 flex items-center px-4 text-sm text-gray-700 hover:bg-red-100 cursor-pointer transition-colors ${index === currentNewsIndex ? 'block' : 'hidden'}`}
                >
                  {news.category && (
                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded mr-2 flex-shrink-0">
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

      {/* Stats Section - Horizontal Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-4 bg-white rounded-2xl shadow-md p-6 md:grid-cols-4 md:divide-x md:divide-red-200 md:gap-0">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
              <Droplets className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">25</div>
            <div className="text-xs text-gray-500">{t("home.stats.varieties")}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
              <Sun className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">35K+</div>
            <div className="text-xs text-gray-500">{t("home.stats.genes")}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">50</div>
            <div className="text-xs text-gray-500">{t("home.stats.regions")}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
              <Database className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">20+</div>
            <div className="text-xs text-gray-500">{t("home.stats.partners")}</div>
          </div>
        </div>
      </section>

      {/* Features - 2 Columns with Large Icons */}
      <section className="mb-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Safflower Research Database</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">{t("home.services")}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            SafflowerDB brings together germplasm, functional compounds, nutrition quality and project updates to support safflower resource evaluation and applied research.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/data" className="group bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border border-red-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-red-700">{t("home.genomicData")}</h3>
                <p className="text-sm text-gray-500">{t("home.genomicDataDesc")}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-red-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/data" className="group bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border border-red-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-red-700">{t("home.varieties")}</h3>
                <p className="text-sm text-gray-500">{t("home.varietiesDesc")}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-red-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/tools" className="group bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border border-red-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-red-700">{t("home.analysisTools")}</h3>
                <p className="text-sm text-gray-500">{t("home.analysisToolsDesc")}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-red-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/news" className="group bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border border-red-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-red-700">{t("nav.news")}</h3>
                <p className="text-sm text-gray-500">{t("home.newsUpdates")}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-red-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-3">
        {resourceHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
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
                  <h3 className="font-semibold text-gray-800 group-hover:text-red-700 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{item.content}</p>
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
