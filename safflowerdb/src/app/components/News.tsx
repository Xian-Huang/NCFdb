import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Eye, ArrowRight } from "lucide-react";
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("news.title")}</h1>
        <p className="text-gray-500">{t("news.subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-green-500 text-white"
                : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200"
            }`}
          >
            {t(`news.categories.${category}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t("news.loading")}</div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl">
          <p>{t("news.noNews")}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-300 transition-all overflow-hidden"
            >
              {item.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  {item.category && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                      {t(`news.categories.${item.category}`)}
                    </span>
                  )}
                  <div className="flex items-center text-gray-400 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {item.views}
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 hover:text-green-600">
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
