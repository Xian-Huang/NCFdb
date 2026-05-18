import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Eye, ArrowRight, Bean } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchSesameNews } from "../../apis/data_apis";

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
    fetchSesameNews()
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
      <section className="grid gap-5 rounded-[2rem] border border-green-100 bg-white p-6 shadow-lg shadow-green-100/50 lg:grid-cols-[1fr_260px]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-700">Sesame archive notes</p>
          <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">{t("news.title")}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t("news.subtitle")}</p>
        </div>
        <div className="rounded-[1.5rem] bg-green-50 p-5">
          <Bean className="mb-4 h-8 w-8 text-green-700" />
          <p className="text-sm leading-6 text-slate-600">
            Dataset releases, lignan records and project updates are collected as a searchable sesame research register.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-green-100 bg-white p-3 shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200"
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
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group grid overflow-hidden rounded-[1.5rem] border border-green-100 bg-white shadow-sm transition-all hover:bg-green-50/40 hover:shadow-lg sm:grid-cols-[180px_1fr]"
            >
              {item.image && (
                <div className="h-44 overflow-hidden sm:h-full">
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
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-green-100">
                      {t(`news.categories.${item.category}`)}
                    </span>
                  )}
                  <div className="flex items-center text-gray-400 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {item.views}
                  </div>
                </div>
                <h3 className="mb-3 line-clamp-2 font-semibold text-slate-900 group-hover:text-green-800">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.publish_time || item.create_time)}
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
