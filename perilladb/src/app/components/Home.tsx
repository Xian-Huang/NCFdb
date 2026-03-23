import { ArrowRight, Database, Users, BookOpen } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
    fetch("/api/perilla/changelogs/")
      .then((res) => res.json())
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
      {/* Hero Section */}
      <section className="relative h-[350px] overflow-hidden rounded-xl shadow-lg mb-8">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
          alt="Perilla"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/85 to-purple-600/60 flex items-center">
          <div className="container mx-auto px-8">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold text-white mb-3">
                {t("home.title")}
              </h1>
              <p className="text-lg text-purple-100 mb-5">
                {t("home.subtitle")}
              </p>
              <Link
                to="/data"
                className="inline-flex items-center px-5 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                {t("home.explore")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-4 divide-x divide-purple-400">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-white">25</div>
            <div className="text-xs text-purple-100">{t("home.stats.varieties")}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-white">35K+</div>
            <div className="text-xs text-purple-100">{t("home.stats.genes")}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-white">50</div>
            <div className="text-xs text-purple-100">{t("home.stats.regions")}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-white">20+</div>
            <div className="text-xs text-purple-100">{t("home.stats.partners")}</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500 inline-block">{t("home.services")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/data" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <Database className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-700">{t("home.genomicData")}</h3>
                <p className="text-sm text-gray-500">{t("home.genomicDataDesc")}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500" />
            </div>
          </Link>

          <Link to="/data" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <BookOpen className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-700">{t("home.varieties")}</h3>
                <p className="text-sm text-gray-500">{t("home.varietiesDesc")}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500" />
            </div>
          </Link>

          <Link to="/tools" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <Users className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-700">{t("home.analysisTools")}</h3>
                <p className="text-sm text-gray-500">{t("home.analysisToolsDesc")}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500" />
            </div>
          </Link>

          <Link to="/news" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <BookOpen className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-700">{t("nav.news")}</h3>
                <p className="text-sm text-gray-500">{t("home.genomicDataDesc")}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500" />
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500 inline-block">{t("home.newsUpdates")}</h2>
        {loading ? (
          <p className="text-gray-500">{t("home.loading")}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {changelog.map((item) => (
              <Link 
                key={item.id} 
                to={`/changelog/${item.id}`}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    v{item.version}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(item.release_date)}</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
