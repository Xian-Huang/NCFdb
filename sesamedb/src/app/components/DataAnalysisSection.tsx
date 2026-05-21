import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, Database, Dna, Download, MapPinned, Network, Search, Table2 } from "lucide-react";
import { cropConfig } from "../cropConfig";

type AnyRow = Record<string, any>;
type ListPayload = AnyRow[] | { count?: number; results?: AnyRow[] };

const pageSizes = [10, 20, 50];

const apiGet = async (endpoint: string) => {
  const response = await fetch(`/api/${endpoint}`);
  if (!response.ok) throw new Error(endpoint);
  return response.json();
};

const asArray = (value: unknown): AnyRow[] => {
  if (Array.isArray(value)) return value as AnyRow[];
  if (value && typeof value === "object" && Array.isArray((value as { results?: unknown }).results)) {
    return (value as { results: AnyRow[] }).results;
  }
  return [];
};

const listCount = (value: ListPayload | null, fallback = 0) => {
  if (Array.isArray(value)) return value.length;
  return value?.count ?? fallback;
};

const numberValue = (value: unknown) => Number(value ?? 0) || 0;
const emptyCell = "-";
const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  if (!text || hasCjk(text)) return fallback;
  return text;
};

export function DataAnalysisSection() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [nutritionPayload, setNutritionPayload] = useState<ListPayload | null>(null);
  const [regions, setRegions] = useState<AnyRow[]>([]);
  const [visuals, setVisuals] = useState<AnyRow>({ regions: [], network: [], gene_expression: [], counts: {} });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(0);
      setDebouncedQuery(query.trim());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(page * pageSize),
    });
    if (debouncedQuery) params.set("q", debouncedQuery);

    apiGet(`nutrition-data/?${params.toString()}`)
      .then(setNutritionPayload)
      .catch(() => setNutritionPayload({ count: 0, results: [] }));
  }, [debouncedQuery, page, pageSize]);

  useEffect(() => {
    Promise.allSettled([
      apiGet("regions/?limit=100"),
      apiGet("visualizations/"),
    ]).then(([regionData, visualData]) => {
      if (regionData.status === "fulfilled") setRegions(asArray(regionData.value));
      if (visualData.status === "fulfilled") setVisuals(visualData.value || {});
    });
  }, []);

  const nutritionRows = useMemo(() => asArray(nutritionPayload), [nutritionPayload]);
  const totalNutrition = listCount(nutritionPayload, nutritionRows.length);
  const totalPages = Math.max(1, Math.ceil(totalNutrition / pageSize));
  const topNutrition = nutritionRows.slice(0, 8);
  const maxOil = Math.max(1, ...topNutrition.map((row) => numberValue(row.oil_content)));
  const heatRows = asArray(visuals.gene_expression).slice(0, 40);
  const regionVisuals = (asArray(visuals.regions).length ? asArray(visuals.regions) : regions).slice(0, 12);
  const network = asArray(visuals.network).slice(0, 12);
  const counts = visuals.counts || {};
  const varietyFallback = t("research.fallback.variety");
  const regionFallback = t("research.fallback.region");
  const geneFallback = t("research.fallback.gene");

  return (
    <section className="space-y-6 text-slate-900">
      <div className="border-t border-slate-200 pt-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>Exploratory views</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{t("research.title")}</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{t("research.subtitle")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            <Stat icon={<Database className="h-4 w-4" />} label={t("research.stats.nutrition")} value={totalNutrition || numberValue(counts.nutrition)} />
            <Stat icon={<MapPinned className="h-4 w-4" />} label={t("research.stats.regions")} value={numberValue(counts.regions) || regions.length} />
            <Stat icon={<Dna className="h-4 w-4" />} label={t("research.stats.genes")} value={numberValue(counts.genes)} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5" style={{ color: cropConfig.accentDark }} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("research.searchPlaceholder")} className="w-full bg-transparent text-sm text-slate-700 outline-none" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["nutrition", "varieties", "genes", "regions"].map((item) => (
            <a key={item} href={`/api/export/${item}/`} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>
              <Download className="h-4 w-4" />{item}.csv
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Panel title={t("research.sections.nutritionChart")} icon={<BarChart3 className="h-5 w-5" />} tone="soft">
          <div className="space-y-4">
            {topNutrition.map((row, index) => {
              const width = Math.max(8, Math.round((numberValue(row.oil_content) / maxOil) * 100));
              return <div key={`bar-${row.id}-${index}`}><div className="mb-1 flex justify-between gap-4 text-xs text-slate-500"><span className="truncate">{cleanText(row.variety_code || row.variety_name || row.sample_code, varietyFallback)}</span><span>{row.oil_content ?? 0}{t("research.units.percent")}</span></div><div className="h-2.5 rounded-full bg-white/80"><div className="h-2.5 rounded-full" style={{ width: `${width}%`, backgroundColor: cropConfig.accent }} /></div></div>;
            })}
            {!topNutrition.length && <div className="py-8 text-center text-sm text-slate-500">{t("research.noResults")}</div>}
          </div>
        </Panel>

        <Panel title={t("research.sections.nutritionMatrix")} icon={<Table2 className="h-5 w-5" />}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>{t("research.showing", { shown: nutritionRows.length, total: totalNutrition })}</span>
            <label className="flex items-center gap-2">
              {t("research.pageSize")}
              <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(0); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700">
                {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em]" style={{ color: cropConfig.accentDark }}>
                <tr>
                  <th className="px-3 py-3">{t("research.columns.sample")}</th>
                  <th className="px-3 py-3">{t("research.columns.variety")}</th>
                  <th className="px-3 py-3">{t("research.columns.region")}</th>
                  <th className="px-3 py-3">{t("research.columns.oil")}</th>
                  <th className="px-3 py-3">{t("research.columns.protein")}</th>
                  <th className="px-3 py-3">{t("research.columns.traitComponent")}</th>
                  <th className="px-3 py-3">{t("research.columns.method")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nutritionRows.map((row, index) => (
                  <tr key={`${row.id}-${index}`} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-900">{cleanText(row.sample_code, `${t("research.fallback.samplePrefix")}-${page * pageSize + index + 1}`)}</td>
                    <td className="px-3 py-3 text-slate-600">{cleanText(row.variety_code || row.variety_name || row.name, varietyFallback)}</td>
                    <td className="px-3 py-3 text-slate-600">{cleanText(row.region_code || row.region_name, regionFallback)}</td>
                    <td className="px-3 py-3 text-slate-600">{row.oil_content ?? emptyCell}</td>
                    <td className="px-3 py-3 text-slate-600">{row.protein ?? emptyCell}</td>
                    <td className="px-3 py-3 text-slate-600">{row.lignan ?? row.fatty_acid ?? emptyCell}</td>
                    <td className="px-3 py-3 text-slate-600">{cleanText(row.method, "HPLC/NIR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!nutritionRows.length && <div className="py-8 text-center text-sm text-slate-500">{t("research.noResults")}</div>}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-sm">
            <button disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{t("research.previous")}</button>
            <span className="text-xs text-slate-500">{page + 1} / {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{t("research.next")}</button>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel title={t("research.sections.regionHeat")} icon={<MapPinned className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {regionVisuals.map((row, index) => (
              <div key={`${row.id}-${index}`} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-3"><span className="truncate font-medium text-slate-900">{cleanText(row.code || row.name, regionFallback)}</span><span className="text-xs" style={{ color: cropConfig.accentDark }}>{row.variety_count || 0} {t("research.units.varieties")}</span></div>
                <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{ width: `${Math.min(100, 12 + numberValue(row.variety_count) * 12)}%`, backgroundColor: cropConfig.accent }} /></div>
                <p className="mt-2 truncate text-xs text-slate-500">{cleanText(row.country, emptyCell)} · {cleanText(row.climate, t("research.fallback.climatePending"))}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <Panel title={t("research.sections.expressionHeat")} icon={<Dna className="h-5 w-5" />} tone="soft">
            <div className="grid grid-cols-10 gap-1">
              {heatRows.map((row, index) => (
                <div key={`${row.id}-${index}`} title={`${cleanText(row.gene_id || row.gene, geneFallback)} ${row.expression_value || row.tpm || 0}`} className="aspect-square rounded-[3px] ring-1" style={{ backgroundColor: cropConfig.accentSoft, opacity: Math.min(1, 0.25 + numberValue(row.expression_value || row.tpm || row.fpkm) / 80), boxShadow: `inset 0 0 0 1px ${cropConfig.accent}22` }} />
              ))}
            </div>
          </Panel>

          <Panel title={t("research.sections.proteinNetwork")} icon={<Network className="h-5 w-5" />}>
            <div className="relative min-h-[260px] overflow-hidden rounded-2xl bg-slate-50">
              {network.map((edge, index) => (
                <div key={`${edge.source}-${index}`} className="absolute flex h-16 w-16 items-center justify-center rounded-full border border-white p-2 text-center text-[10px] font-medium shadow-sm" style={{ left: `${8 + (index % 4) * 23}%`, top: `${8 + Math.floor(index / 4) * 15}%`, backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>
                  <span className="line-clamp-2">{cleanText(edge.source || edge.target, geneFallback)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="border-l border-slate-200 pl-4"><div className="flex items-center gap-2" style={{ color: cropConfig.accent }}>{icon}<span className="text-xs font-medium text-slate-600">{label}</span></div><div className="mt-2 text-2xl font-bold text-slate-950">{value}</div></div>;
}

function Panel({ title, icon, children, tone = "white" }: { title: string; icon: ReactNode; children: ReactNode; tone?: "white" | "soft" }) {
  return <section className="rounded-[1.25rem] border border-slate-200 p-6 shadow-sm" style={{ backgroundColor: tone === "soft" ? cropConfig.accentSoft : "#fff" }}><div className="mb-5 flex items-center gap-2" style={{ color: cropConfig.accent }}><div className="rounded-xl bg-white/80 p-2">{icon}</div><h2 className="text-lg font-semibold text-slate-950">{title}</h2></div>{children}</section>;
}
