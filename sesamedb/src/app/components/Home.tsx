import { ArrowRight, Database, Users, BookOpen, Sprout, LeafyGreen, Bean } from "lucide-react";
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
    fetch("/api/sesame/changelogs/")
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
      {/* Hero Section - Card Overlay Style */}
      <section className="relative h-[400px] overflow-hidden mb-8 rounded-2xl shadow-2xl">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1587771613366-849e202d2e21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
          alt="Sesame"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent flex items-end">
          <div className="container mx-auto px-6 pb-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-2xl shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sprout className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">SesameDB</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t("home.title")}
              </h1>
              <p className="text-gray-600 mb-4">
                {t("home.subtitle")}
              </p>
              <div className="flex gap-3">
                <Link
                  to="/data"
                  className="inline-flex items-center px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  {t("home.explore")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {t("home.analysisTools")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Minimal Strip */}
      <section className="mb-8">
        <div className="grid grid-cols-4 gap-px bg-gray-200 rounded-xl overflow-hidden">
          <div className="bg-white p-5 text-center hover:bg-green-50 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Bean className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold text-gray-800">25</div>
            </div>
            <div className="text-xs text-gray-500">{t("home.stats.varieties")}</div>
          </div>
          <div className="bg-white p-5 text-center hover:bg-green-50 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <LeafyGreen className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold text-gray-800">35K+</div>
            </div>
            <div className="text-xs text-gray-500">{t("home.stats.genes")}</div>
          </div>
          <div className="bg-white p-5 text-center hover:bg-green-50 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Database className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold text-gray-800">50</div>
            </div>
            <div className="text-xs text-gray-500">{t("home.stats.regions")}</div>
          </div>
          <div className="bg-white p-5 text-center hover:bg-green-50 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold text-gray-800">20+</div>
            </div>
            <div className="text-xs text-gray-500">{t("home.stats.partners")}</div>
          </div>
        </div>
      </section>

      {/* Features - 1-2 Asymmetric Layout */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t("home.services")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Large card on left */}
          <Link to="/data" className="md:col-span-1 group bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Database className="h-10 w-10 text-white mb-4" />
            <h3 className="font-bold text-xl text-white mb-2 group-hover:text-green-100">{t("home.genomicData")}</h3>
            <p className="text-green-100 text-sm">{t("home.genomicDataDesc")}</p>
          </Link>
          
          {/* Two smaller cards on right */}
          <div className="md:col-span-2 grid gap-4">
            <Link to="/data" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t("home.varieties")}</h3>
                  <p className="text-sm text-gray-500">{t("home.varietiesDesc")}</p>
                </div>
              </div>
            </Link>
            
            <div className="grid grid-cols-2 gap-4">
              <Link to="/tools" className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
                <Users className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-800">{t("home.analysisTools")}</h3>
              </Link>
              
              <Link to="/news" className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
                <BookOpen className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-800">{t("nav.news")}</h3>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates - Timeline Style */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t("home.newsUpdates")}</h2>
        {loading ? (
          <p className="text-gray-500">{t("home.loading")}</p>
        ) : (
          <div className="space-y-3">
            {changelog.map((item, index) => (
              <Link 
                key={item.id} 
                to={`/changelog/${item.id}`}
                className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
              >
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <span className={`text-sm font-bold ${index === 0 ? 'text-white' : 'text-gray-600'}`}>{index + 1}</span>
                  </div>
                  {index < changelog.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      v{item.version}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(item.release_date)}</span>
                  </div>
                  <h3 className="font-medium text-gray-800 group-hover:text-green-700 truncate">{item.title}</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-green-500 ml-3" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
