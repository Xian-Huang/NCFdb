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
      features: ["SNP viewer", "Structural variants", "Population data"],
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
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Sunflower tool bench</p>
        <h1 className="text-4xl font-bold mb-4 text-slate-950">{t("tools.title")}</h1>
        <p className="max-w-3xl text-lg text-gray-600">
          {t("tools.subtitle")}
        </p>
      </div>

      {/* Quick Access Tools */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isBrowser = tool.name === t("tools.browser");
          return (
            <div
              key={index}
              className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-2xl bg-amber-100 p-3">
                  <Icon className="h-7 w-7 text-amber-600" />
                </div>
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
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => isBrowser ? navigate("/jbrowse") : null}
                className="w-full rounded-xl bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600"
              >
                {t("tools.launch")}
              </button>
            </div>
          );
        })}
      </div>

      {/* BLAST Search Section */}
      <section className="rounded-[2rem] border border-amber-100 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Search className="h-7 w-7 text-amber-500 mr-3" />
          {t("tools.blastSearch")}
        </h2>
        <p className="text-gray-600 mb-6">
          Paste your sequence below to perform a BLAST search against the sunflower genome
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tools.sequence")}
            </label>
            <textarea
              className="h-32 w-full rounded-2xl border border-gray-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500"
              placeholder=">seq1&#10;ATCGATCGATCGATCG..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tools.program")}
              </label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500">
                <option>BLASTN (nucleotide vs nucleotide)</option>
                <option>BLASTP (protein vs protein)</option>
                <option>BLASTX (nucleotide vs protein)</option>
                <option>tBLASTn (protein vs nucleotide)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tools.database")}
              </label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500">
                <option>Reference Genome</option>
                <option>Transcriptome</option>
                <option>Protein Sequences</option>
                <option>ESTs</option>
              </select>
            </div>
          </div>
          <button className="rounded-xl bg-amber-500 px-6 py-3 text-white transition-colors hover:bg-amber-600">
            {t("tools.run")}
          </button>
        </div>
      </section>

      {/* Tutorials & Documentation */}
      <section className="rounded-[2rem] bg-slate-950 p-8 text-white">
        <h2 className="text-2xl font-semibold mb-4">{t("tools.tutorials")}</h2>
        <p className="text-slate-300 mb-6">
          Learn how to make the most of our bioinformatics tools with comprehensive guides and video tutorials
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            📖 {t("tools.guides")}
          </button>
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            🎥 {t("tools.videos")}
          </button>
          <button className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            💻 {t("tools.apiDocs")}
          </button>
        </div>
      </section>
    </div>
  );
}
