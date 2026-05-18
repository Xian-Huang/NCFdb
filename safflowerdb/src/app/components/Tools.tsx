import { Search, Code, BarChart3, Microscope, Database, FileSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function Tools() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
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
    <div className="space-y-6 bg-white font-mono">
      <div className="border-l-8 border-red-500 bg-white p-6 shadow-sm ring-1 ring-red-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Safflower utility board</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("tools.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">{t("tools.subtitle")}</p>
      </div>

      {/* Tools Grid */}
      <div className="overflow-hidden border border-red-100 bg-white">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isBrowser = tool.name === t("tools.browser");
          return (
            <div
              key={index}
              className={`grid gap-4 p-5 transition-colors hover:bg-red-50 md:grid-cols-[56px_1fr_120px] md:items-center ${index !== tools.length - 1 ? "border-b border-red-100" : ""}`}
            >
              <div className="flex items-start justify-between md:block">
                <div className="flex h-11 w-11 items-center justify-center bg-red-100">
                  <Icon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-gray-800">{tool.name}</h3>
                  <span
                    className={`px-2 py-0.5 text-xs ${
                      tool.status === "Available"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{tool.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tool.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => isBrowser ? navigate("/jbrowse") : null}
                className="w-full bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
              >
                {t("tools.launch")}
              </button>
            </div>
          );
        })}
      </div>

      {/* BLAST Section */}
      <section className="border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-red-500" />
          {t("tools.blastSearch")}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tools.sequence")}
            </label>
            <textarea
              className="h-28 w-full border border-red-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500"
              placeholder=">seq1&#10;ATCGATCGATCGATCG..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.program")}</label>
              <select className="w-full border border-red-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500">
                <option>BLASTN (nucleotide vs nucleotide)</option>
                <option>BLASTP (protein vs protein)</option>
                <option>BLASTX (nucleotide vs protein)</option>
                <option>tBLASTn (protein vs nucleotide)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.database")}</label>
              <select className="w-full border border-red-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500">
                <option>Reference Genome</option>
                <option>Transcriptome</option>
                <option>Protein Sequences</option>
                <option>ESTs</option>
              </select>
            </div>
          </div>
          <button className="bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700">
            {t("tools.run")}
          </button>
        </div>
      </section>

      {/* Tutorials */}
      <section className="bg-red-50 p-6">
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
