import { ArrowRight, Database, Users, BookOpen, Droplets, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchSafflowerChangelog } from "../../apis/data_apis";

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
  const [loading, setLoading] = useState(true);

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
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div>
      {/* Hero Section - Diagonal Split */}
      <section className="relative h-[380px] overflow-hidden mb-8 rounded-xl shadow-xl">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/hero-bg.jpg"
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

      {/* Stats Section - Horizontal Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-4 divide-x divide-red-200 bg-white rounded-xl shadow-md p-6">
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("home.services")}</h2>
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
