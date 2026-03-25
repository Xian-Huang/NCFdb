import { Calendar, User, Tag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNews } from "../../apis/data_apis";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  category: string;
  tags: string;
  views: number;
  is_published: boolean;
  create_time: string;
  update_time: string;
  publish_time: string;
}

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { t } = useTranslation();

  useEffect(() => {
    fetchNews()
      .then((data: NewsItem[]) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch news:", err);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(news.map((item) => item.category).filter(Boolean)))];

  const filteredNews = selectedCategory === "All" 
    ? news 
    : news.filter((item) => item.category === selectedCategory);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">{t("news.loading")}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("news.title")}</h1>
        <p className="text-lg text-gray-600">
          {t("news.subtitle")}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? "bg-amber-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {category === "All" ? t("news.categories.all") : category}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="space-y-8">
        {filteredNews.length === 0 ? (
          <p className="text-center text-gray-500">{t("news.noNews")}</p>
        ) : (
          filteredNews.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="md:flex">
              {item.image && (
                <div className="md:w-80 h-64 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title || ""}
                    className="w-full h-full max-h-64 object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {item.category && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {item.category}
                    </span>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(item.publish_time)}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-3 hover:text-amber-600 cursor-pointer">
                  <Link to={`/news/${item.id}`}>{item.title}</Link>
                </h2>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4 mr-1" />
                  {item.author}
                </div>
                <p className="text-gray-600 mb-4">{item.content}</p>
                <Link to={`/news/${item.id}`} className="text-amber-600 hover:text-amber-700 font-medium">
                  Read More →
                </Link>
              </div>
            </div>
          </article>
          ))
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">
            Get the latest news and updates delivered directly to your inbox
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded text-gray-900 outline-none"
            />
            <button className="px-6 py-2 bg-white text-amber-600 rounded hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
