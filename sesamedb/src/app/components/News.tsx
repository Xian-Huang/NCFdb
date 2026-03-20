import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Eye, ArrowRight } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sesame News & Updates</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest research, breeding advances, and events in sesame genomics
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No news available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  {item.category && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {item.category}
                    </span>
                  )}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Eye className="h-4 w-4 mr-1" />
                    {item.views}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 hover:text-green-600 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
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
