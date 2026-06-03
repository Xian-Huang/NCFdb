import { Database, Download, FileText, Search, Dna, Layers3, CheckCircle2, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchDownloadFiles } from "../../apis/data_apis";
import { cropConfig } from "../cropConfig";
import { DataAnalysisSection } from "./DataAnalysisSection";
import { GlobalSearchSection } from "./data/GlobalSearchSection";
import { HplcDatabaseSection } from "./data/HplcDatabaseSection";
import { MolecularFingerprintSection } from "./data/MolecularFingerprintSection";

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return text && hasCjk(text) ? text : fallback;
};

const DATASET_PAGE_SIZE = 6;

const formatSize = (value: any) => {
  if (typeof value === "number") return `${(value / 1024 / 1024).toFixed(1)} MB`;
  return value || "-";
};

export function Data() {
  const [datasetsFiles, setDatasetsFiles] = useState<any[]>([]);
  const [datasetPage, setDatasetPage] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDownloadFiles()
      .then((data: any[]) => setDatasetsFiles(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch download files:", err);
        setDatasetsFiles([]);
      });
  }, []);

  const stats = [
    { icon: Database, value: String(Math.max(datasetsFiles.length, 8)), label: t("data.stats.datasets"), note: t("data.statNotes.datasets") },
    { icon: FileText, value: "7.2 TB", label: t("data.stats.totalSize"), note: t("data.statNotes.totalSize") },
    { icon: Download, value: "41K+", label: t("data.stats.downloads"), note: t("data.statNotes.downloads") },
    { icon: Dna, value: cropConfig.geneCount, label: t("data.stats.genes"), note: `${cropConfig.species} ${t("data.statNotes.genes")}` },
  ];
  const heroChips = [t("data.chips.files"), t("data.chips.metadata"), t("data.chips.analysis")];
  const scopeItems = [t("data.scopeItems.germplasm"), t("data.scopeItems.traits"), t("data.scopeItems.omics")];
  const workflowItems = [t("data.workflow.collect"), t("data.workflow.normalize"), t("data.workflow.publish")];
  const interpretationBadges = [t("data.interpretation.metadata"), t("data.interpretation.evidence"), t("data.interpretation.analysis")];

  const totalDatasetPages = Math.max(1, Math.ceil(datasetsFiles.length / DATASET_PAGE_SIZE));
  const visibleDatasets = datasetsFiles.slice(datasetPage * DATASET_PAGE_SIZE, (datasetPage + 1) * DATASET_PAGE_SIZE);

  return (
    <div className="relative left-1/2 w-[min(100vw-2rem,92rem)] -translate-x-1/2 space-y-10 py-12">
      <section className="relative overflow-hidden rounded-[1.75rem] text-white shadow-xl" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.88), rgba(15,23,42,.42)), url(${cropConfig.pageImages.data})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="grid gap-8 p-7 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="flex min-h-[330px] flex-col justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/75">{t("common.cropName")} {t("data.catalogue")}</p>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight">{t("data.title")}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/86">{t("data.subtitle")}</p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/76">{t("data.description")}</p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {heroChips.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm text-white/88 ring-1 ring-white/18">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.35rem] bg-white/94 p-5 text-slate-900 shadow-lg ring-1 ring-white/40">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: cropConfig.accentDark }}>{t("data.atGlance")}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">{t("data.primaryCoverage")}</h2>
              </div>
              <Layers3 className="h-5 w-5 text-slate-300" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Icon className="h-4 w-4" style={{ color: cropConfig.accent }} />
                      <span>{item.label}</span>
                    </div>
                    <div className="mt-3 text-2xl font-bold text-slate-950">{item.value}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">{item.note}</div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="border-l-4 bg-white/60 py-1 pl-5" style={{ borderColor: cropConfig.accent }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>{t("data.downloadCentre")}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">{t("data.availableDatasets")}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("data.downloadHint")}</p>
              </div>
              <div className="flex min-w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:min-w-[360px]">
                <Search className="h-5 w-5 shrink-0" style={{ color: cropConfig.accent }} />
                <input type="text" placeholder={t("data.search")} className="w-full bg-transparent text-sm text-slate-700 outline-none" />
                <button className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>{t("data.search")}</button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {visibleDatasets.map((dataset, index) => (
              <article key={dataset.id ?? index} className="flex min-h-[230px] flex-col justify-between rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{dataset.version || "v1.0"}</span>
                    <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{cleanText(dataset.format || dataset.file_type, t("data.datasetFallbackFormat"))}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{formatSize(dataset.size || dataset.file_size)}</span>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-slate-950">{cleanText(dataset.title || dataset.file_name, t("data.datasetFallbackTitle"))}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{cleanText(dataset.description, t("data.datasetFallbackDescription"))}</p>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <span className="text-sm text-slate-500">{dataset.downloads || 0} {t("data.stats.downloads")}</span>
                  <a href={dataset.id ? `/api/download/files/${dataset.id}/download/` : "#"} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}><Download className="mr-2 h-4 w-4" />{t("data.download")}</a>
                </div>
              </article>
            ))}
          </div>

          {!datasetsFiles.length && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">{t("data.noDownloadableRecords")}</div>}
          {datasetsFiles.length > DATASET_PAGE_SIZE && (
            <div className="flex items-center justify-end gap-2 text-sm">
              <button disabled={datasetPage === 0} onClick={() => setDatasetPage((value) => Math.max(0, value - 1))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{t("common.previous")}</button>
              <span className="text-xs text-slate-500">{datasetPage + 1} / {totalDatasetPages}</span>
              <button disabled={datasetPage + 1 >= totalDatasetPages} onClick={() => setDatasetPage((value) => Math.min(totalDatasetPages - 1, value + 1))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{t("common.next")}</button>
            </div>
          )}
        </div>

        <aside className="space-y-8 xl:sticky xl:top-24 xl:self-start">
          <section className="border-l-4 py-1 pl-5" style={{ borderColor: cropConfig.accent, background: `linear-gradient(90deg, ${cropConfig.accentSoft}, transparent 68%)` }}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accentDark }}>{t("data.databaseScope")}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{t("data.coverageContext")}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{t("common.databaseIntro")}</p>
            <div className="mt-5 divide-y divide-slate-200 text-sm text-slate-700">
              {scopeItems.map((item) => <div key={item} className="py-3">{item}</div>)}
            </div>
          </section>

          <section className="border-y border-slate-200 py-6">
            <div className="flex items-center gap-2" style={{ color: cropConfig.accent }}>
              <ClipboardList className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-slate-950">{t("data.curationWorkflow")}</h3>
            </div>
            <div className="mt-5 space-y-4 text-sm text-slate-700">
              {workflowItems.map((item, index) => (
                <div key={item} className="flex gap-3"><span className="font-bold" style={{ color: cropConfig.accent }}>{index + 1}</span><span>{item}</span></div>
              ))}
            </div>
          </section>

          <section className="py-1">
            <h3 className="mb-2 text-lg font-semibold text-slate-950">{t("data.notice.title")}</h3>
            <p className="text-sm leading-7 text-slate-600">{t("data.notice.content")}</p>
          </section>
        </aside>
      </section>

      <GlobalSearchSection />
      <HplcDatabaseSection />
      <MolecularFingerprintSection />

      <div id="research-analysis">
        <DataAnalysisSection />
      </div>

      <section className="border-t border-slate-200 pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>{t("data.interpretation.eyebrow")}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{t("data.interpretation.title")}</h2>
        <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-600">
          {t("data.interpretation.desc")}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {interpretationBadges.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: cropConfig.accent }} />{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
}

