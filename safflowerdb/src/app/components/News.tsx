import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowRight, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchSafflowerNews } from "../../apis/data_apis";

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
    fetchSafflowerNews()
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
    <div className="space-y-7 text-gray-900">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-red-900 p-8 text-white shadow-xl shadow-red-100">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-red-500/40 to-transparent md:block" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/80 px-4 py-2 text-sm font-medium">
            <Droplets className="h-4 w-4" />
            Safflower research dispatch
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">{t("news.title")}</h1>
          <p className="mt-4 text-base leading-7 text-red-100">{t("news.subtitle")}</p>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-xl border border-red-100 bg-white p-3 shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-red-500 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-red-50 border border-gray-200"
            }`}
          >
            {t(`news.categories.${category}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl bg-white py-12 text-center text-gray-400">{t("news.loading")}</div>
      ) : filteredNews.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center text-gray-400">
          <p>{t("news.noNews")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group grid overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm transition-all hover:border-red-200 hover:shadow-lg md:grid-cols-[220px_1fr]"
            >
              {item.image && (
                <div className="h-44 overflow-hidden md:h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  {item.category && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                      {t(`news.categories.${item.category}`)}
                    </span>
                  )}
                  <div className="flex items-center text-gray-400 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {item.views}
                  </div>
                </div>
                <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-800 group-hover:text-red-700">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.publish_time || item.create_time)}
                  </div>
                  <ArrowRight className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
