import { Search, Code, BarChart3, Microscope, Database, FileSearch, BookOpen, Video, FileCode } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cropConfig } from "../cropConfig";

export function Tools() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tools = [
    { icon: Search, name: t("tools.blast"), description: t("tools.blastDesc"), features: ["BLASTN", "BLASTP", "BLASTX", "tBLASTn"], status: "Available" },
    { icon: Database, name: t("tools.browser"), description: t("tools.browserDesc"), features: ["JBrowse 2", "Track customization", "Comparative view"], status: "Available" },
    { icon: FileSearch, name: t("tools.geneSearch"), description: t("tools.geneSearchDesc"), features: ["Advanced filters", "Batch search", "Export results"], status: "Available" },
    { icon: BarChart3, name: t("tools.expression"), description: t("tools.expressionDesc"), features: ["Heatmaps", "Co-expression", "Differential expression"], status: "Available" },
    { icon: Microscope, name: t("tools.variant"), description: t("tools.variantDesc"), features: ["SNP viewer", "Structural variants", "Population data"], status: "Available" },
    { icon: Code, name: t("tools.api"), description: t("tools.apiDesc"), features: ["REST API", "Python SDK", "Documentation"], status: "Beta" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[1.75rem] p-8 text-white shadow-xl" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.84), rgba(15,23,42,.36)), url(${cropConfig.pageImages.tools})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="relative max-w-4xl"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/75">{cropConfig.cropName} tool bench</p><h1 className="text-4xl font-bold mb-4">{t("tools.title")}</h1><p className="max-w-3xl text-lg text-white/85">{t("tools.subtitle")}</p><p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">Tools are tuned for {cropConfig.traitFocus}, from sequence lookup to visualization and export.</p></div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isBrowser = tool.name === t("tools.browser");
          return <div key={tool.name} className="flex h-full min-h-[360px] flex-col rounded-[1.25rem] border border-slate-200 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: `linear-gradient(180deg, ${cropConfig.accentSoft}, #ffffff 46%)` }}><div className="mb-4 flex items-start justify-between"><div className="rounded-2xl p-3" style={{ backgroundColor: "white" }}><Icon className="h-7 w-7" style={{ color: cropConfig.accent }} /></div><span className="rounded-full px-3 py-1 text-sm" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{tool.status}</span></div><h3 className="mb-2 min-h-[56px] text-xl font-semibold text-slate-950">{tool.name}</h3><p className="mb-4 min-h-[72px] text-sm leading-6 text-slate-600">{tool.description}</p><div className="mb-5 flex min-h-[76px] flex-wrap content-start gap-2">{tool.features.map((feature) => <span key={feature} className="h-fit rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">{feature}</span>)}</div><button onClick={() => isBrowser ? navigate("/jbrowse") : null} className="mt-auto w-full rounded-xl px-4 py-2 text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>{t("tools.launch")}</button></div>;
        })}
      </div>


      <section className="grid gap-8 border-l-4 py-2 pl-6 lg:grid-cols-[1.05fr_0.95fr]" style={{ borderColor: cropConfig.accent }}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>Analysis workflow</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">From query to evidence package</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The tool bench is designed for repeated research tasks: start with a gene, accession or sequence query, inspect linked annotations, compare trait evidence, then export a compact result set for downstream statistics or figure preparation.
          </p>
          <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {["Search genome and annotation indexes", "Review browser tracks and variation panels", "Compare expression and nutrition evidence", "Export tables, figures and API-ready identifiers"].map((item, index) => (
              <div key={item} className="border-t border-slate-200 py-3 text-sm leading-6 text-slate-700"><span className="font-semibold" style={{ color: cropConfig.accentDark }}>0{index + 1}</span> {item}</div>
            ))}
          </div>
        </div>
        <div className="border-y border-slate-200 py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>Output standards</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Reusable results</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Result pages keep identifiers, genome builds, thresholds and timestamps visible. This makes it easier to cite database evidence, repeat an analysis session, and combine exported records with local breeding or omics workflows.
          </p>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_0.86fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm"><h2 className="mb-4 flex items-center text-2xl font-semibold text-slate-950"><Search className="mr-3 h-7 w-7" style={{ color: cropConfig.accent }} />{t("tools.blastSearch")}</h2><p className="mb-6 text-sm leading-7 text-slate-600">Paste a sequence below to search against the {cropConfig.cropName.toLowerCase()} reference genome, transcriptome or protein catalog.</p><div className="space-y-4"><div><label className="mb-2 block text-sm font-medium text-slate-700">{t("tools.sequence")}</label><textarea className="h-32 w-full rounded-2xl border border-slate-200 px-4 py-2 outline-none focus:ring-2" placeholder=">seq1&#10;ATCGATCGATCGATCG..." /></div><div className="grid gap-4 md:grid-cols-2"><label className="block text-sm font-medium text-slate-700">{t("tools.program")}<select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 outline-none"><option>BLASTN</option><option>BLASTP</option><option>BLASTX</option><option>tBLASTn</option></select></label><label className="block text-sm font-medium text-slate-700">{t("tools.database")}<select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 outline-none"><option>Reference Genome</option><option>Transcriptome</option><option>Protein Sequences</option><option>Variation Panels</option></select></label></div><button className="rounded-xl px-6 py-3 text-white" style={{ backgroundColor: cropConfig.accent }}>{t("tools.run")}</button></div></div>
        <div className="rounded-[1.5rem] p-8 text-white" style={{ backgroundColor: cropConfig.accentDark }}><h2 className="mb-4 text-2xl font-semibold">{t("tools.tutorials")}</h2><p className="mb-6 text-sm leading-7 text-white/75">Guides cover data upload conventions, genome browser tracks, API access and interpretation of {cropConfig.cropName.toLowerCase()} trait dashboards.</p><div className="grid gap-3"><button className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-800" style={{ backgroundColor: cropConfig.accentSoft }}><BookOpen className="h-5 w-5" />{t("tools.guides")}</button><button className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-800" style={{ backgroundColor: cropConfig.accentSoft }}><Video className="h-5 w-5" />{t("tools.videos")}</button><button className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-800" style={{ backgroundColor: cropConfig.accentSoft }}><FileCode className="h-5 w-5" />{t("tools.apiDocs")}</button></div></div>
      </section>
    </div>
  );
}

