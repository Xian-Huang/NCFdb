import { Calendar, User, Tag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function News() {
  const news = [
    {
      title: "Major Breakthrough in Drought Resistance Gene Identification",
      date: "February 20, 2026",
      author: "Dr. Sarah Chen",
      category: "Research",
      image: "https://images.unsplash.com/photo-1712338481983-e742ac6f260d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBjbG9zZSUyMHVwJTIweWVsbG93fGVufDF8fHx8MTc3MTk5OTE4NHww&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Researchers have identified a novel set of genes responsible for enhanced drought resistance in wild sunflower populations. This discovery could lead to the development of more resilient cultivated varieties...",
    },
    {
      title: "New Transcriptome Atlas Released",
      date: "February 15, 2026",
      author: "Database Team",
      category: "Database Update",
      image: "https://images.unsplash.com/photo-1579154204845-5d7f8d4dc785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxETkElMjBnZW5vbWUlMjBzZXF1ZW5jaW5nfGVufDF8fHx8MTc3MTkwNjU3NXww&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "We are excited to announce the release of a comprehensive transcriptome atlas covering 15 different tissue types and developmental stages. The dataset includes over 500 RNA-seq samples...",
    },
    {
      title: "International Sunflower Genomics Consortium Expands",
      date: "February 10, 2026",
      author: "Dr. Michael Rodriguez",
      category: "Collaboration",
      image: "https://images.unsplash.com/photo-1760420940953-3958ad9f6287?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpZmljJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NzE5OTkxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "The consortium welcomes five new research institutions from three continents, bringing the total number of participating organizations to 47. This expansion will enhance collaborative research efforts...",
    },
    {
      title: "Genome Browser Enhancement: New Visualization Features",
      date: "February 5, 2026",
      author: "Development Team",
      category: "Tools",
      image: "https://images.unsplash.com/photo-1614308457932-e16d85c5d053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwcmVzZWFyY2glMjBtaWNyb3Njb3BlfGVufDF8fHx8MTc3MTk1MjI1NXww&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "The latest update to our genome browser includes improved performance, new annotation tracks, and enhanced comparative genomics features. Users can now visualize synteny across multiple species...",
    },
    {
      title: "Publication Spotlight: Oil Biosynthesis Pathways Revealed",
      date: "January 28, 2026",
      author: "Dr. Emma Thompson",
      category: "Publication",
      excerpt: "A new study published in Nature Plants details the complete oil biosynthesis pathway in sunflower seeds, identifying key regulatory genes that control oil content and composition. The research team used...",
    },
    {
      title: "Pangenome Project Reaches 500 Accessions Milestone",
      date: "January 20, 2026",
      author: "Pangenome Consortium",
      category: "Research",
      excerpt: "The Sunflower Pangenome Project has successfully sequenced and assembled genomes from 500 diverse sunflower accessions. This resource will enable comprehensive studies of genetic diversity and trait evolution...",
    },
  ];

  const categories = ["All", "Research", "Database Update", "Collaboration", "Tools", "Publication"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">News & Updates</h1>
        <p className="text-lg text-gray-600">
          Stay informed about the latest developments in sunflower genomics research
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full transition-colors ${
              category === "All"
                ? "bg-amber-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="space-y-8">
        {news.map((item, index) => (
          <article
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="md:flex">
              {item.image && (
                <div className="md:w-80 h-64 md:h-auto overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {item.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {item.date}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-3 hover:text-amber-600 cursor-pointer">
                  {item.title}
                </h2>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4 mr-1" />
                  {item.author}
                </div>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <button className="text-amber-600 hover:text-amber-700 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          </article>
        ))}
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
