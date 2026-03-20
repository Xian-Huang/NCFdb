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
    fetch("/api/sunflower/changelog/")
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
          src="https://images.unsplash.com/photo-1712338481983-e742ac6f260d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBjbG9zZSUyMHVwJTIweWVsbG93fGVufDF8fHx8MTc3MTk5OTE4NHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Sunflower"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-white mb-4">
              Sunflower Haplotype Genome Database
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                A comprehensive resource for sunflower genomic data, research tools, and collaborative science
              </p>
              <Link
                to="/data"
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
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
          <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <Database className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Genomic Data</h3>
            <p className="text-gray-600 mb-4">
              Access comprehensive sunflower genome sequences, annotations, and expression data
            </p>
            <Link
              to="/data"
              className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
            >
              Browse Data <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <BookOpen className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Research Tools</h3>
            <p className="text-gray-600 mb-4">
              Utilize powerful bioinformatics tools for sequence analysis and data visualization
            </p>
            <Link
              to="/tools"
              className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
            >
              Use Tools <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600 mb-4">
              Join researchers worldwide in advancing sunflower genomics and crop science
            </p>
            <Link
              to="/events"
              className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
            >
              View Events <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-amber-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-amber-100">Metabolome</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">52</div>
              <div className="text-amber-100">Resequencing</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">17</div>
              <div className="text-amber-100">Proteome</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-amber-100">Publications</div>
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
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-amber-600">{formatDate(item.release_date)}</div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                    v{item.version}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 hover:text-amber-600">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
