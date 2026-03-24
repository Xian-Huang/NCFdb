import { Calendar, User, Tag, ArrowLeft, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchNewsDetail } from "../../apis/data_apis";

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

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchNewsDetail(parseInt(id))
      .then((data: NewsItem) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch news:", err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">News not found</h1>
          <Link to="/news" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const tagList = news.tags ? news.tags.split(",").map(t => t.trim()) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link 
        to="/news" 
        className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Link>

      {/* Article */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image */}
        {news.image && (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <ImageWithFallback
              src={news.image}
              alt={news.title || ""}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {news.category && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {news.category}
              </span>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(news.publish_time)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              {news.author}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              {news.views} views
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {news.title}
          </h1>

          {/* Tags */}
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tagList.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>
              Published on {formatDateTime(news.publish_time)} | Updated on {formatDateTime(news.update_time)}
            </p>
          </div>
        </div>
      </article>

      {/* Related News */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related News</h2>
        <Link 
          to="/news" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
        >
          View All News →
        </Link>
      </div>
    </div>
  );
}
