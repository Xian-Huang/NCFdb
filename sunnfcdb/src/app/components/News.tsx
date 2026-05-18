import { Calendar, User, ArrowRight, Newspaper } from "lucide-react";
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
    <div className="bg-[#f8faf5]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="rounded-[2rem] bg-gradient-to-br from-amber-500 via-yellow-400 to-lime-300 p-8 text-slate-950 shadow-xl shadow-amber-100">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-amber-800">
          <Newspaper className="h-4 w-4" />
          Sunflower research updates
        </div>
        <h1 className="text-4xl font-bold mb-4">{t("news.title")}</h1>
        <p className="max-w-3xl text-lg text-slate-700">
          {t("news.subtitle")}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-amber-100 bg-white p-3 shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {category === "All" ? t("news.categories.all") : category}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="space-y-6">
        {filteredNews.length === 0 ? (
          <p className="text-center text-gray-500">{t("news.noNews")}</p>
        ) : (
          filteredNews.map((item) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-[1.5rem] border border-amber-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="md:flex">
              {item.image && (
                <div className="h-64 overflow-hidden md:w-80">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title || ""}
                    className="h-full max-h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {item.category && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      {item.category}
                    </span>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(item.publish_time)}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-3 group-hover:text-amber-700">
                  <Link to={`/news/${item.id}`}>{item.title}</Link>
                </h2>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4 mr-1" />
                  {item.author}
                </div>
                <p className="text-gray-600 mb-4">{item.content}</p>
                <Link to={`/news/${item.id}`} className="inline-flex items-center font-medium text-amber-700 hover:text-amber-800">
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
          ))
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-[1.75rem] bg-slate-950 p-8 text-white">
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
    </div>
  );
}
