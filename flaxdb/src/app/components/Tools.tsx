import { Search, Code, BarChart3, Microscope, Database, FileSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Tools() {
  const { t } = useTranslation();
  
  const tools = [
    {
      icon: Search,
      name: t("tools.blast"),
      description: t("tools.blastDesc"),
      features: ["BLASTN", "BLASTP", "BLASTX", "tBLASTn"],
      status: "Available",
    },
    {
      icon: Database,
      name: t("tools.browser"),
      description: t("tools.browserDesc"),
      features: ["JBrowse 2", "Track customization", "Comparative view"],
      status: "Available",
    },
    {
      icon: FileSearch,
      name: t("tools.geneSearch"),
      description: t("tools.geneSearchDesc"),
      features: ["Advanced filters", "Batch search", "Export results"],
      status: "Available",
    },
    {
      icon: BarChart3,
      name: t("tools.expression"),
      description: t("tools.expressionDesc"),
      features: ["Heatmaps", "Co-expression", "Differential expression"],
      status: "Available",
    },
    {
      icon: Microscope,
      name: t("tools.variant"),
      description: t("tools.variantDesc"),
      features: ["SNP viewer", "InDels", "Population data"],
      status: "Available",
    },
    {
      icon: Code,
      name: t("tools.api"),
      description: t("tools.apiDesc"),
      features: ["REST API", "Python SDK", "Documentation"],
      status: "Beta",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("tools.title")}</h1>
        <p className="text-gray-500">{t("tools.subtitle")}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded ${
                    tool.status === "Available"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{tool.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {tool.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <button className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                {t("tools.launch")}
              </button>
            </div>
          );
        })}
      </div>

      {/* BLAST Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          {t("tools.blastSearch")}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tools.sequence")}
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder=">seq1&#10;ATCGATCGATCGATCG..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.program")}</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>BLASTN (nucleotide vs nucleotide)</option>
                <option>BLASTP (protein vs protein)</option>
                <option>BLASTX (nucleotide vs protein)</option>
                <option>tBLASTn (protein vs nucleotide)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.database")}</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Reference Genome</option>
                <option>Transcriptome</option>
                <option>Protein Sequences</option>
                <option>ESTs</option>
              </select>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
            {t("tools.run")}
          </button>
        </div>
      </section>

      {/* Tutorials */}
      <section className="bg-blue-50 rounded-xl p-6">
        <h2 className="font-medium text-gray-800 mb-4">{t("tools.tutorials")}</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow text-sm border border-gray-100">
            📖 {t("tools.guides")}
          </button>
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow text-sm border border-gray-100">
            🎥 {t("tools.videos")}
          </button>
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow text-sm border border-gray-100">
            💻 {t("tools.apiDocs")}
          </button>
        </div>
      </section>
    </div>
  );
}
