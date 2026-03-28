import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Eye, ArrowLeft, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchPerillaNewsById } from "../../apis/data_apis";


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

export function NewsDetail() {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    fetchPerillaNewsById(parseInt(id))
      .then((data: NewsItem) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news detail:", err);
        setLoading(false);
      });
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
        <Link to="/news" className="text-amber-600 hover:text-amber-700">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/news"
        className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Link>

      <article>
        {(news.image_url || news.image) && (
          <img
            src={news.image_url || news.image}
            alt={news.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="flex items-center justify-between mb-4">
          {news.category && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
              {news.category}
            </span>
          )}
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            {news.views} views
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>

        <div className="flex items-center text-gray-500 text-sm mb-8 space-x-4">
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
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
