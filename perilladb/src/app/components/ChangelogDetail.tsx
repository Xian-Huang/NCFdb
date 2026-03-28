import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchChangelog } from "../../apis/data_apis";

interface ChangelogItem {
  id: number;
  version: string;
  title: string;
  content: string;
  changes: string[];
  release_date: string;
  is_published: boolean;
}

export function ChangelogDetail() {
  const { id } = useParams<{ id: string }>();
  const [changelog, setChangelog] = useState<ChangelogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchChangelog()
      .then((data: ChangelogItem) => {
        setChangelog(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch changelog:", err);
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
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!changelog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Changelog not found</h1>
          <Link to="/" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/" 
        className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-amber-500 text-white text-lg font-bold rounded-full">
              v{changelog.version}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(changelog.release_date)}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {changelog.title}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 mb-8">
            <p>{changelog.content}</p>
          </div>

          {changelog.changes && changelog.changes.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-amber-500" />
                What's New
              </h2>
              <ul className="space-y-3">
                {changelog.changes.map((change, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              to="/" 
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
