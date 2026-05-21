import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cropConfig } from "../cropConfig";
import { fetchChangelogDetail } from "../../apis/data_apis";

interface ChangelogItem {
  id: number;
  version: string;
  title: string;
  content: string;
  changes: string[];
  release_date: string;
  is_published: boolean;
}

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return !text || hasCjk(text) ? fallback : text;
};

export function ChangelogDetail() {
  const { id } = useParams<{ id: string }>();
  const [changelog, setChangelog] = useState<ChangelogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchChangelogDetail(parseInt(id))
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
          <Link to="/" className="mt-4 inline-block" style={{ color: cropConfig.accent }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link 
        to="/" 
        className="mb-6 inline-flex items-center text-gray-600 transition-colors hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      {/* Changelog Card */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="rounded-full px-4 py-2 text-lg font-bold text-white" style={{ backgroundColor: cropConfig.accent }}>
              v{changelog.version}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(changelog.release_date)}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {cleanText(changelog.title, "Database release note")}
          </h1>

          {/* Description */}
          <div className="prose prose-lg max-w-none text-gray-700 mb-8">
            <p>{cleanText(changelog.content, "Database content and interface updates are available for this release.")}</p>
          </div>

          {/* Changes List */}
          {changelog.changes && changelog.changes.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5" style={{ color: cropConfig.accent }} />
                What's New
              </h2>
              <ul className="space-y-3">
                {changelog.changes.map((change, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accent }}>
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{cleanText(change, "Release item updated")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              to="/" 
              className="inline-flex items-center font-medium hover:opacity-80" style={{ color: cropConfig.accent }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

