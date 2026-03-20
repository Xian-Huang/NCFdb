import { Search, Code, BarChart3, Microscope, Database, FileSearch } from "lucide-react";

export function Tools() {
  const tools = [
    {
      icon: Search,
      name: "BLAST Search",
      description: "Perform sequence similarity searches against sesame genome and transcriptome databases",
      features: ["BLASTN", "BLASTP", "BLASTX", "tBLASTn"],
      status: "Available",
    },
    {
      icon: Database,
      name: "Genome Browser",
      description: "Interactive visualization of genome assemblies, annotations, and experimental data",
      features: ["JBrowse 2", "Track customization", "Comparative view"],
      status: "Available",
    },
    {
      icon: FileSearch,
      name: "Gene Search",
      description: "Query genes by ID, name, function, or GO term and retrieve detailed information",
      features: ["Advanced filters", "Batch search", "Export results"],
      status: "Available",
    },
    {
      icon: BarChart3,
      name: "Expression Atlas",
      description: "Explore gene expression patterns across tissues and conditions in sesame",
      features: ["Heatmaps", "Co-expression", "Differential expression"],
      status: "Available",
    },
    {
      icon: Microscope,
      name: "Variant Browser",
      description: "Browse and analyze genetic variants from sesame germplasm collections",
      features: ["SNP viewer", "InDels", "Population data"],
      status: "Available",
    },
    {
      icon: Code,
      name: "API Access",
      description: "Programmatic access to genomic data for custom analysis pipelines",
      features: ["REST API", "Python SDK", "Documentation"],
      status: "Beta",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bioinformatics Tools</h1>
        <p className="text-lg text-gray-600">
          Powerful analysis tools for exploring sesame genomic data
        </p>
      </div>

      {/* Quick Access Tools */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="h-10 w-10 text-green-500" />
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    tool.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                Launch Tool
              </button>
            </div>
          );
        })}
      </div>

      {/* BLAST Search Section */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Search className="h-7 w-7 text-green-500 mr-3" />
          Quick BLAST Search
        </h2>
        <p className="text-gray-600 mb-6">
          Paste your sequence below to perform a BLAST search against the sesame genome
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sequence (FASTA format)
            </label>
            <textarea
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder=">seq1&#10;ATCGATCGATCGATCG..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                <option>BLASTN (nucleotide vs nucleotide)</option>
                <option>BLASTP (protein vs protein)</option>
                <option>BLASTX (nucleotide vs protein)</option>
                <option>tBLASTn (protein vs nucleotide)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                <option>Reference Genome</option>
                <option>Transcriptome</option>
                <option>Protein Sequences</option>
                <option>ESTs</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Run BLAST Search
          </button>
        </div>
      </section>

      {/* Tutorials & Documentation */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Tutorials & Documentation</h2>
        <p className="text-gray-600 mb-6">
          Learn how to make the most of our bioinformatics tools with comprehensive guides and video tutorials
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            📖 User Guides
          </button>
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            🎥 Video Tutorials
          </button>
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            💻 API Documentation
          </button>
        </div>
      </section>
    </div>
  );
}
