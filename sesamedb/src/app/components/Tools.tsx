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
    <div className="space-y-6 bg-white">
      <div className="border-b border-green-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Sesame analysis drawer</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("tools.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">{t("tools.subtitle")}</p>
      </div>

      {/* Tools Grid */}
      <div className="overflow-hidden border border-green-100 bg-white">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isBrowser = tool.name === t("tools.browser");
          return (
            <div
              key={index}
              className={`grid gap-4 bg-white p-4 transition-colors hover:bg-green-50 md:grid-cols-[48px_1fr_120px] md:items-center ${index !== tools.length - 1 ? "border-b border-green-100" : ""}`}
            >
              <div className="flex items-start justify-between md:block">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                  <Icon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <span
                  className={`mb-2 inline-flex rounded-full px-2 py-0.5 text-xs ${
                    tool.status === "Available"
                      ? "bg-green-50 text-green-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {tool.status}
                </span>
                <h3 className="font-medium text-gray-800 mb-1">{tool.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{tool.description}</p>
                <div className="flex flex-wrap gap-1">
                {tool.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {feature}
                  </span>
                ))}
                </div>
              </div>
              <button
                onClick={() => isBrowser ? navigate("/jbrowse") : null}
                className="w-full rounded-xl bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
              >
                {t("tools.launch")}
              </button>
            </div>
          );
        })}
      </div>

      {/* BLAST Section */}
      <section className="rounded-2xl border border-green-100 bg-green-50/50 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-green-500" />
          {t("tools.blastSearch")}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tools.sequence")}
            </label>
            <textarea
              className="h-24 w-full rounded-2xl border border-green-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500"
              placeholder=">seq1&#10;ATCGATCGATCGATCG..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.program")}</label>
              <select className="w-full rounded-xl border border-green-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500">
                <option>BLASTN (nucleotide vs nucleotide)</option>
                <option>BLASTP (protein vs protein)</option>
                <option>BLASTX (nucleotide vs protein)</option>
                <option>tBLASTn (protein vs nucleotide)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.database")}</label>
              <select className="w-full rounded-xl border border-green-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500">
                <option>Reference Genome</option>
                <option>Transcriptome</option>
                <option>Protein Sequences</option>
                <option>ESTs</option>
              </select>
            </div>
          </div>
          <button className="rounded-xl bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700">
            {t("tools.run")}
          </button>
        </div>
      </section>

      {/* Tutorials */}
      <section className="rounded-2xl border border-green-100 bg-white p-6">
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
