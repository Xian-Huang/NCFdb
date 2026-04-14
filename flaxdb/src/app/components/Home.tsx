import { ArrowRight, Database, Users, BookOpen, FlaskConical, Leaf, Dna } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchChangelog } from "../../apis/data_apis";

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
    fetchChangelog()
      .then((data: ChangelogItem[]) => {
        setChangelog(data.slice(0, 3));
        setLoading(false);
      })
      .catch((err: any) => {
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
      {/* Hero Section - Split Screen */}
      <section className="relative h-[420px] overflow-hidden mb-8 rounded-2xl shadow-2xl">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/hero-bg.jpg"
            alt="Flax field with blue flowers"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex">
          <div className="w-1/2 bg-gradient-to-r from-blue-900/95 to-blue-800/80 flex items-center">
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
          <div className="w-1/2"></div>
        </div>
      </section>

      {/* Stats Section - Bento Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[200px]">
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("home.services")}</h2>
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
