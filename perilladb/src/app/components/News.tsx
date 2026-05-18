import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowRight, Flower2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchPerillaNews } from "../../apis/data_apis";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  image_url: string;
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
    fetchPerillaNews()
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
    <div className="space-y-7 bg-gradient-to-b from-purple-50/60 to-white text-gray-900">
      <section className="rounded-[2rem] border border-purple-100 bg-white p-8 text-center shadow-xl shadow-purple-100/70">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-700">
          <Flower2 className="h-7 w-7" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">Perilla knowledge garden</p>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">{t("news.title")}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">{t("news.subtitle")}</p>
      </section>

      <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-purple-100 bg-white p-3 shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-purple-500 text-white shadow-md shadow-purple-100"
                : "bg-white text-gray-600 hover:bg-purple-50 border border-gray-200"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group block h-full w-full overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100"
            >
              {(item.image_url || item.image) && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={item.image_url || item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="w-full p-5">
                <div className="flex items-center justify-between mb-2">
                  {item.category && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      {t(`news.categories.${item.category}`)}
                    </span>
                  )}
                  <div className="flex items-center text-gray-400 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {item.views}
                  </div>
                </div>
                <h3 className="mb-3 line-clamp-2 font-bold text-gray-800 group-hover:text-purple-700">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.publish_time || item.create_time)}
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
