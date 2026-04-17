import { ArrowRight, Database, Users, BookOpen, Beaker, Flower2, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchChangelog, fetchPerillaScrollingNews } from "../../apis/data_apis";

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

  return (
    <div>
      {/* Hero Section - Centered */}
      <section className="relative h-[450px] overflow-hidden mb-8 rounded-2xl shadow-2xl">
        <ImageWithFallback
          src="/hero-bg.jpg"
          alt="Perilla leaves"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-800/50 to-purple-900/70 flex items-center justify-center">
          <div className="text-center max-w-3xl px-4">
            <h1 className="text-5xl font-bold text-white mb-5 tracking-wide">
              {t("home.title")}
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              {t("home.subtitle")}
            </p>
            <Link
              to="/data"
              className="inline-flex items-center px-8 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t("home.explore")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scrolling News Bar */}
      {scrollingNews.length > 0 && (
        <section className="mb-6 bg-purple-50 border border-purple-200 rounded-xl overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-purple-500 text-white">
            <Megaphone className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">最新通知</span>
          </div>
          <div className="relative h-8 overflow-hidden">
            <div className="absolute inset-0 transition-all duration-500 ease-in-out">
              {scrollingNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`h-8 flex items-center px-4 text-sm text-gray-700 hover:bg-purple-100 cursor-pointer transition-colors ${index === currentNewsIndex ? 'block' : 'hidden'}`}
                >
                  {news.category && (
                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded mr-2 flex-shrink-0">
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

      {/* Stats Section - Circular */}
      <section className="mb-8">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-purple-100 text-center min-w-[180px]">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-purple-600">25</span>
            </div>
            <div className="text-gray-600">{t("home.stats.varieties")}</div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-purple-100 text-center min-w-[180px]">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-purple-600">35K+</span>
            </div>
            <div className="text-gray-600">{t("home.stats.genes")}</div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-purple-100 text-center min-w-[180px]">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-purple-600">50</span>
            </div>
            <div className="text-gray-600">{t("home.stats.regions")}</div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-purple-100 text-center min-w-[180px]">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-purple-600">20+</span>
            </div>
            <div className="text-gray-600">{t("home.stats.partners")}</div>
          </div>
        </div>
      </section>

      {/* Features - 2x2 Grid with Icons */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t("home.services")}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/data" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-purple-200 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 transition-colors flex-shrink-0">
                <Database className="h-8 w-8 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-700">{t("home.genomicData")}</h3>
                <p className="text-gray-500">{t("home.genomicDataDesc")}</p>
              </div>
            </div>
          </Link>

          <Link to="/data" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-purple-200 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 transition-colors flex-shrink-0">
                <Flower2 className="h-8 w-8 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-700">{t("home.varieties")}</h3>
                <p className="text-gray-500">{t("home.varietiesDesc")}</p>
              </div>
            </div>
          </Link>

          <Link to="/tools" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-purple-200 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 transition-colors flex-shrink-0">
                <Beaker className="h-8 w-8 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-700">{t("home.analysisTools")}</h3>
                <p className="text-gray-500">{t("home.analysisToolsDesc")}</p>
              </div>
            </div>
          </Link>

          <Link to="/news" className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-purple-200 hover:shadow-xl transition-all">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 transition-colors flex-shrink-0">
                <BookOpen className="h-8 w-8 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-700">{t("nav.news")}</h3>
                <p className="text-gray-500">{t("home.newsUpdates")}</p>
              </div>
            </div>
          </Link>
        </div>
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
                  <span className="px-4 py-1.5 bg-purple-100 text-purple-700 font-semibold rounded-full text-sm">
                    v{item.version}
                  </span>
                  <span className="text-sm text-gray-400">{formatDate(item.release_date)}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-purple-700">{item.title}</h3>
                <p className="text-gray-500">{item.content}</p>
                <div className="mt-4 flex items-center text-purple-600 font-medium">
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
