import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, Database, Dna, Download, Layers3, MapPinned, Network, Search, Table2 } from "lucide-react";

type AnyRow = Record<string, any>;
type ListPayload = AnyRow[] | { count?: number; results?: AnyRow[] };

const pageSizes = [25, 50, 100];

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

export function Research() {
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
  const heatRows = asArray(visuals.gene_expression).slice(0, 60);
  const regionVisuals = (asArray(visuals.regions).length ? asArray(visuals.regions) : regions).slice(0, 24);
  const network = asArray(visuals.network).slice(0, 24);
  const counts = visuals.counts || {};
  const varietyFallback = t("research.fallback.variety");
  const regionFallback = t("research.fallback.region");
  const geneFallback = t("research.fallback.gene");

  return (
    <div className="space-y-6 bg-emerald-50/30 p-0 text-slate-900">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_80%_20%,#bbf7d0,transparent_34%),linear-gradient(135deg,#f0fdf4,#ecfdf5)] border border-green-100 p-6 shadow-sm rounded-xl border-green-200">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{t("research.eyebrow")}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-slate-950">{t("research.title")}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t("research.subtitle")}</p>
            <div className="mt-5 inline-flex items-center gap-2 border border-white/70 bg-white/70 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
              <Layers3 className="h-4 w-4 text-emerald-700" />
              Seed quality analysis lab
            </div>
          </div>
          <div className="grid min-w-[280px] grid-cols-3 gap-3 text-sm sm:min-w-[520px]">
            <Stat icon={<Database className="h-4 w-4" />} label={t("research.stats.nutrition")} value={totalNutrition || numberValue(counts.nutrition)} />
            <Stat icon={<MapPinned className="h-4 w-4" />} label={t("research.stats.regions")} value={numberValue(counts.regions) || regions.length} />
            <Stat icon={<Dna className="h-4 w-4" />} label={t("research.stats.genes")} value={numberValue(counts.genes)} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3 border border-green-100 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-emerald-700" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("research.searchPlaceholder")} className="w-full bg-transparent text-sm text-slate-700 outline-none" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["nutrition", "varieties", "genes", "regions"].map((item) => (
            <a key={item} href={`/api/export/${item}/`} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition-colors">
              <Download className="h-4 w-4" />{item}.csv
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title={t("research.sections.nutritionMatrix")} icon={<Table2 className="h-5 w-5" />}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>{t("research.showing", { shown: nutritionRows.length, total: totalNutrition })}</span>
            <label className="flex items-center gap-2">
              {t("research.pageSize")}
              <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(0); }} className="border border-slate-200 bg-white px-2 py-1 text-slate-700">
                {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-emerald-700">
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
            <button disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} className="border border-slate-200 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{t("research.previous")}</button>
            <span className="text-xs text-slate-500">{page + 1} / {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)} className="border border-slate-200 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{t("research.next")}</button>
          </div>
        </Panel>

        <Panel title={t("research.sections.nutritionChart")} icon={<BarChart3 className="h-5 w-5" />}>
          <div className="space-y-4">
            {topNutrition.map((row, index) => {
              const width = Math.max(8, Math.round((numberValue(row.oil_content) / maxOil) * 100));
              return <div key={`bar-${row.id}-${index}`}><div className="mb-1 flex justify-between gap-4 text-xs text-slate-500"><span className="truncate">{cleanText(row.variety_code || row.variety_name || row.sample_code, varietyFallback)}</span><span>{row.oil_content ?? 0}{t("research.units.percent")}</span></div><div className="h-2.5 bg-slate-100"><div className="h-2.5 bg-emerald-500" style={{ width: `${width}%` }} /></div></div>;
            })}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel title={t("research.sections.regionHeat")} icon={<MapPinned className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-3">
            {regionVisuals.map((row, index) => (
              <div key={`${row.id}-${index}`} className="border border-slate-100 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-3"><span className="truncate font-medium text-slate-900">{cleanText(row.code || row.name, regionFallback)}</span><span className="text-xs text-emerald-700">{row.variety_count || 0} {t("research.units.varieties")}</span></div>
                <div className="mt-2 h-2 bg-slate-100"><div className="h-2 bg-emerald-500" style={{ width: `${Math.min(100, 12 + numberValue(row.variety_count) * 12)}%` }} /></div>
                <p className="mt-2 truncate text-xs text-slate-500">{cleanText(row.country, emptyCell)} · {cleanText(row.climate, t("research.fallback.climatePending"))}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <Panel title={t("research.sections.expressionHeat")} icon={<Dna className="h-5 w-5" />}>
            <div className="grid grid-cols-10 gap-1">
              {heatRows.map((row, index) => (
                <div key={`${row.id}-${index}`} title={`${cleanText(row.gene_id || row.gene, geneFallback)} ${row.expression_value || row.tpm || 0}`} className="aspect-square bg-green-50 ring-green-100 ring-1" style={{ opacity: Math.min(1, 0.25 + numberValue(row.expression_value || row.tpm || row.fpkm) / 80) }} />
              ))}
            </div>
          </Panel>

          <Panel title={t("research.sections.proteinNetwork")} icon={<Network className="h-5 w-5" />}>
            <div className="relative min-h-[260px] overflow-hidden bg-slate-50">
              {network.map((edge, index) => (
                <div key={`${edge.source}-${index}`} className="absolute flex h-16 w-16 items-center justify-center rounded-full border border-white bg-green-50 ring-green-100 p-2 text-center text-[10px] font-medium text-emerald-700 shadow-sm" style={{ left: `${8 + (index % 4) * 23}%`, top: `${8 + Math.floor(index / 4) * 15}%` }}>
                  <span className="line-clamp-2">{cleanText(edge.source || edge.target, geneFallback)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="rounded-xl border border-green-100 bg-gradient-to-br from-white to-emerald-50 p-4 shadow-sm"><div className="flex items-center gap-2 text-emerald-700">{icon}<span className="text-xs">{label}</span></div><div className="mt-2 text-2xl font-bold text-slate-950">{value}</div></div>;
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <section className="rounded-xl border border-green-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm"><div className="mb-4 flex items-center gap-2 border-b border-green-100 pb-3 text-emerald-700">{icon}<h2 className="text-lg font-semibold text-slate-950">{title}</h2></div>{children}</section>;
}