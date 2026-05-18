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
      summary: "Compare nucleotide or protein sequences against curated perilla genome, transcript and protein indexes.",
      metrics: ["4 search modes", "3 target databases", "FASTA batch input"],
      workflow: ["Paste FASTA", "Choose database", "Review hit table"],
      status: "Available",
    },
    {
      icon: Database,
      name: t("tools.browser"),
      description: t("tools.browserDesc"),
      features: ["JBrowse 2", "Track customization", "Comparative view"],
      summary: "Inspect loci with gene models, variant tracks and expression evidence in a synchronized genome view.",
      metrics: ["Genome tracks", "Annotation layers", "Region sharing"],
      workflow: ["Open locus", "Toggle tracks", "Export view"],
      status: "Available",
    },
    {
      icon: FileSearch,
      name: t("tools.geneSearch"),
      description: t("tools.geneSearchDesc"),
      features: ["Advanced filters", "Batch search", "Export results"],
      summary: "Find candidate genes by keyword, identifier, annotation term or genomic interval.",
      metrics: ["ID lookup", "GO filters", "CSV export"],
      workflow: ["Set filters", "Compare records", "Download table"],
      status: "Available",
    },
    {
      icon: BarChart3,
      name: t("tools.expression"),
      description: t("tools.expressionDesc"),
      features: ["Heatmaps", "Co-expression", "Differential expression"],
      summary: "Explore expression profiles across leaf, seed, flower and stress-related perilla samples.",
      metrics: ["Tissue matrix", "Condition groups", "Gene clusters"],
      workflow: ["Select genes", "Choose samples", "Inspect patterns"],
      status: "Available",
    },
    {
      icon: Microscope,
      name: t("tools.variant"),
      description: t("tools.variantDesc"),
      features: ["SNP viewer", "InDels", "Population data"],
      summary: "Browse SNP and InDel records from perilla germplasm panels for trait-linked variation review.",
      metrics: ["SNP/InDel", "Population tags", "Functional impact"],
      workflow: ["Filter region", "Check effects", "Export variants"],
      status: "Available",
    },
    {
      icon: Code,
      name: t("tools.api"),
      description: t("tools.apiDesc"),
      features: ["REST API", "Python SDK", "Documentation"],
      summary: "Use stable API endpoints to integrate perilla records into local analysis scripts and pipelines.",
      metrics: ["JSON output", "Token-ready", "Versioned docs"],
      workflow: ["Choose endpoint", "Set query", "Parse response"],
      status: "Beta",
    },
  ];

  return (
    <div className="space-y-6 bg-white">
      <div className="rounded-[2rem] border border-purple-100 bg-[#fbf7ff] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">Perilla tool studio</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("tools.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">{t("tools.subtitle")}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isBrowser = tool.name === t("tools.browser");
          const isLargeCard = index % 3 === 0;
          return (
            <div
              key={index}
              className={`rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${isLargeCard ? "lg:row-span-2" : ""}`}
            >
              <div className="flex h-full flex-col">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      tool.status === "Available"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>
                <h3 className="mb-1 font-medium text-gray-800">{tool.name}</h3>
                <p className={`${isLargeCard ? "mb-4" : "mb-3 line-clamp-2"} text-sm leading-6 text-gray-500`}>
                  {isLargeCard ? tool.summary : tool.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {tool.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                {isLargeCard && (
                  <div className="mb-5 space-y-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                      {tool.metrics.map((metric, idx) => (
                        <div key={idx} className="rounded-xl border border-purple-100 bg-purple-50/60 px-3 py-2 text-xs font-medium text-purple-800">
                          {metric}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Workflow</div>
                      <div className="flex flex-wrap gap-2">
                        {tool.workflow.map((step, idx) => (
                          <span key={idx} className="rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
                            {idx + 1}. {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => isBrowser ? navigate("/jbrowse") : null}
                  className="mt-auto inline-flex w-fit items-center justify-center rounded-full bg-purple-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700"
                >
                  {t("tools.launch")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BLAST Section */}
      <section className="rounded-[2rem] border border-purple-100 bg-[#fbf7ff] p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-500" />
          {t("tools.blastSearch")}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tools.sequence")}
            </label>
            <textarea
              className="h-28 w-full rounded-[1.25rem] border border-purple-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder=">seq1&#10;ATCGATCGATCGATCG..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.program")}</label>
              <select className="w-full rounded-xl border border-purple-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500">
                <option>BLASTN (nucleotide vs nucleotide)</option>
                <option>BLASTP (protein vs protein)</option>
                <option>BLASTX (nucleotide vs protein)</option>
                <option>tBLASTn (protein vs nucleotide)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.database")}</label>
              <select className="w-full rounded-xl border border-purple-100 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500">
                <option>Reference Genome</option>
                <option>Transcriptome</option>
                <option>Protein Sequences</option>
                <option>ESTs</option>
              </select>
            </div>
          </div>
          <button className="rounded-full bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700">
            {t("tools.run")}
          </button>
        </div>
      </section>

      {/* Tutorials */}
      <section className="rounded-[2rem] border border-purple-100 bg-white p-6">
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
