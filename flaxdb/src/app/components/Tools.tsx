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
    <div className="space-y-6 rounded-[1.75rem] border border-blue-100 bg-[#f6f9ff] p-6">
      <div className="border-b border-blue-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Flax analysis console</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("tools.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("tools.subtitle")}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isBrowser = tool.name === t("tools.browser");
          return (
            <div
              key={index}
              className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
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
              <h3 className="font-medium text-slate-950 mb-1">{tool.name}</h3>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">{tool.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {tool.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <button
                onClick={() => isBrowser ? navigate("/jbrowse") : null}
                className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              >
                {t("tools.launch")}
              </button>
            </div>
          );
        })}
      </div>

      {/* BLAST Section */}
      <section className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-950 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600" />
          {t("tools.blastSearch")}
        </h2>
        <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("tools.sequence")}
            </label>
            <textarea
              className="h-28 w-full rounded-2xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder=">seq1&#10;ATCGATCGATCGATCG..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t("tools.program")}</label>
              <select className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                <option>BLASTN (nucleotide vs nucleotide)</option>
                <option>BLASTP (protein vs protein)</option>
                <option>BLASTX (nucleotide vs protein)</option>
                <option>tBLASTn (protein vs nucleotide)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t("tools.database")}</label>
              <select className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                <option>Reference Genome</option>
                <option>Transcriptome</option>
                <option>Protein Sequences</option>
                <option>ESTs</option>
              </select>
            </div>
          </div>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
            {t("tools.run")}
          </button>
        </div>
      </section>

      {/* Tutorials */}
      <section className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-950 mb-4">{t("tools.tutorials")}</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <button className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-blue-100">
            📖 {t("tools.guides")}
          </button>
          <button className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-blue-100">
            🎥 {t("tools.videos")}
          </button>
          <button className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-blue-100">
            💻 {t("tools.apiDocs")}
          </button>
        </div>
      </section>
    </div>
  );
}
