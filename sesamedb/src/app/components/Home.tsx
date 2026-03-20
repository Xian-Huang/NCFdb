import { ArrowRight, Database, Users, BookOpen } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";

interface ChangelogItem {
  id: number;
  version: string;
  title: string;
  content: string;
  changes: string[];
  release_date: string;
  is_published: boolean;
}

export function Home() {
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sesame/changelogs/")
      .then((res) => res.json())
      .then((data) => {
        setChangelog(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch changelog:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1595854341625-f71831d39e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXNhbWUlMjBzZWVkc3xleDF8fHx8MTc3MjAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Sesame"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-white mb-4">
              Sesame Genomic Database
              </h1>
              <p className="text-xl text-green-100 mb-8">
                A comprehensive resource for sesame genomic data, breeding information, and collaborative science
              </p>
              <Link
                to="/data"
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Explore Data
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
            <Database className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Genomic Data</h3>
            <p className="text-gray-600 mb-4">
              Access comprehensive sesame genome sequences, annotations, and expression data
            </p>
            <Link
              to="/data"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
            >
              Browse Data <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
            <BookOpen className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Breeding Resources</h3>
            <p className="text-gray-600 mb-4">
              Explore sesame varieties, traits, and breeding information for crop improvement
            </p>
            <Link
              to="/data"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
            >
              View Varieties <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600 mb-4">
              Join researchers worldwide in advancing sesame genomics and crop science
            </p>
            <Link
              to="/contact"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
            >
              Contact Us <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-green-100">Varieties</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">35K+</div>
              <div className="text-green-100">Genes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50</div>
              <div className="text-green-100">Regions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-green-100">Publications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Updates</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {changelog.map((item) => (
              <Link 
                key={item.id} 
                to={`/changelog/${item.id}`}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-green-600">{formatDate(item.release_date)}</div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    v{item.version}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 hover:text-green-600">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
