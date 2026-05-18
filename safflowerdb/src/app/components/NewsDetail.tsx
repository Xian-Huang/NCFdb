import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Eye, ArrowLeft, User } from "lucide-react";
import { fetchSafflowerNewsById } from "../../apis/data_apis";

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

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSafflowerNewsById(parseInt(id))
        .then((data: NewsItem) => {
          setNews(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch news detail:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">News not found</h1>
        <Link to="/news" className="text-red-600 hover:text-red-700">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/news"
        className="mb-6 inline-flex items-center text-gray-600 transition-colors hover:text-red-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Link>

      <article className="overflow-hidden rounded-[1.5rem] border border-red-100 bg-white shadow-xl shadow-red-100/60">
        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="h-96 w-full object-cover"
          />
        )}

        <div className="p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          {news.category && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-800">
              {news.category}
            </span>
          )}
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            {news.views} views
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">{news.title}</h1>

        <div className="mb-8 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {news.author || "Anonymous"}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(news.publish_time || news.create_time)}
          </div>
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {news.tags && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {news.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-800"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        </div>
      </article>
    </div>
  );
}
