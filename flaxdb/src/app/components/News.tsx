import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Eye, ArrowRight, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchFlaxNews } from "../../apis/data_apis";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  category: string;
  tags: string;
  views: number;
  create_time: string;
  publish_time: string;
}

export function News() {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchFlaxNews()
      .then((data: NewsItem[]) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
        setLoading(false);
      });
  }, []);

  const categories = ["all", "research", "breeding", "events", "publications"];

  const filteredNews = selectedCategory === "all" 
    ? news 
    : news.filter(item => item.category?.toLowerCase() === selectedCategory);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-7 text-slate-900">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-blue-100">
        <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="p-8 text-white sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-100">
              <Newspaper className="h-4 w-4" />
              Flax research bulletin
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{t("news.title")}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{t("news.subtitle")}</p>
          </div>
          <div className="grid border-t border-white/10 bg-white p-5 lg:border-l lg:border-t-0">
            <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Knowledge stream</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Updates are grouped as an operational feed for flax genome resources, oil and fiber traits, publications and project events.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            {t(`news.categories.${category}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white py-12 text-center text-gray-400">{t("news.loading")}</div>
      ) : filteredNews.length === 0 ? (
        <div className="rounded-2xl bg-white py-12 text-center text-gray-400">
          <p>{t("news.noNews")}</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group block h-full w-full overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              {item.image && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="w-full p-5">
                <div className="flex items-center justify-between mb-2">
                  {item.category && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {t(`news.categories.${item.category}`)}
                    </span>
                  )}
                  <div className="flex items-center text-gray-400 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {item.views}
                  </div>
                </div>
                <h3 className="mb-3 line-clamp-2 font-semibold text-slate-900 group-hover:text-blue-700">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.publish_time || item.create_time)}
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
