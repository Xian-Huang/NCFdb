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
const colorWithAlpha = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const numeric = Number.parseInt(value, 16);
  if (Number.isNaN(numeric)) return `rgba(15, 23, 42, ${alpha})`;
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};
const hasCoordinate = (row: AnyRow) => Number.isFinite(Number(row.lng)) && Number.isFinite(Number(row.lat));
const buildRegionMap = (rows: AnyRow[]) => {
  const sourceRows = rows.length >= 6 ? rows : [...rows, ...fallbackRegionMap];
  const seen = new Set<string>();
  return sourceRows
    .map((row, index) => {
      const fallback = fallbackRegionMap[index % fallbackRegionMap.length];
      return {
        ...row,
        code: cleanText(row.code, cleanText(fallback.code, String(index + 1))),
        name: cleanText(row.name, fallback.name),
        climate: cleanText(row.climate, fallback.climate),
        country: cleanText(row.country, fallback.country),
        variety_count: numberValue(row.variety_count) || fallback.variety_count,
        avg_oil: numberValue(row.avg_oil) || fallback.avg_oil,
        lng: hasCoordinate(row) ? Number(row.lng) : fallback.lng,
        lat: hasCoordinate(row) ? Number(row.lat) : fallback.lat,
      };
    })
    .filter((row) => {
      const key = String(row.code || row.name).toUpperCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
};

const fallbackTissues = ["Root", "Leaf", "Bud", "Flower", "Early seed", "Mature seed"];

const fallbackExpressionMatrix = [
  { gene: "HaFAD2-1", function: "oleic acid desaturation", values: [18, 32, 54, 68, 81, 74] },
  { gene: "HaFAD3", function: "linolenic acid synthesis", values: [12, 20, 35, 47, 62, 58] },
  { gene: "HaDGAT1", function: "triacylglycerol assembly", values: [22, 38, 59, 76, 88, 83] },
  { gene: "HaWRI1", function: "oil biosynthesis regulator", values: [28, 44, 61, 73, 69, 52] },
  { gene: "HaOLE1", function: "oil body formation", values: [8, 16, 42, 66, 91, 87] },
  { gene: "HaSAD6", function: "stearoyl-ACP desaturase", values: [26, 41, 64, 79, 72, 55] },
  { gene: "HaNAC29", function: "salt tolerance response", values: [11, 23, 39, 57, 68, 70] },
  { gene: "HaWRKY33", function: "broomrape defense", values: [9, 18, 31, 49, 63, 76] },
  { gene: "HaHKT1", function: "ion transport", values: [15, 26, 34, 52, 67, 72] },
  { gene: "HaCYP707A", function: "stress hormone turnover", values: [7, 14, 28, 44, 59, 66] },
  { gene: "HaLEA14", function: "seed dehydration tolerance", values: [5, 12, 33, 58, 79, 85] },
  { gene: "HaMYB96", function: "cuticle and drought response", values: [13, 25, 43, 60, 71, 64] },
].map((row) => ({
  ...row,
  values: fallbackTissues.map((tissue, index) => ({ tissue, value: row.values[index] })),
}));

const fallbackRegionMap = [
  { name: "Inner Mongolia Hetao Trial Zone", code: "IM", country: "China", climate: "temperate semi-arid", variety_count: 18, avg_oil: 48.6, lat: 40.82, lng: 111.76 },
  { name: "Xinjiang Irrigated Oasis Panel", code: "XJ", country: "China", climate: "continental arid", variety_count: 16, avg_oil: 47.9, lat: 43.82, lng: 87.62 },
  { name: "Heilongjiang Cool Region Nursery", code: "HLJ", country: "China", climate: "cool temperate", variety_count: 12, avg_oil: 44.8, lat: 45.76, lng: 126.64 },
  { name: "Jilin Disease Resistance Nursery", code: "JL", country: "China", climate: "temperate monsoon", variety_count: 10, avg_oil: 45.2, lat: 43.90, lng: 125.32 },
  { name: "Gansu Dryland Evaluation Site", code: "GS", country: "China", climate: "dry plateau", variety_count: 9, avg_oil: 46.1, lat: 36.06, lng: 103.83 },
  { name: "Ningxia Salinity Screening Site", code: "NX", country: "China", climate: "semi-arid irrigated", variety_count: 8, avg_oil: 45.7, lat: 38.49, lng: 106.23 },
  { name: "Hebei Adaptation Nursery", code: "HB", country: "China", climate: "warm temperate", variety_count: 7, avg_oil: 44.4, lat: 38.04, lng: 114.52 },
  { name: "Shandong Quality Verification Site", code: "SD", country: "China", climate: "warm temperate monsoon", variety_count: 6, avg_oil: 43.8, lat: 36.65, lng: 117.12 },
];

const fallbackProteinNodes = ["HaWRI1", "HaDGAT1", "HaFAD2-1", "HaFAD3", "HaOLE1", "HaSAD6", "HaNAC29", "HaHKT1", "HaWRKY33", "HaLEA14"].map((id, index) => ({
  id,
  label: id,
  score: 94 - index * 4,
}));

const fallbackProteinEdges = [
  ["HaWRI1", "HaDGAT1", 0.92],
  ["HaWRI1", "HaFAD2-1", 0.74],
  ["HaDGAT1", "HaOLE1", 0.88],
  ["HaFAD2-1", "HaFAD3", 0.81],
  ["HaSAD6", "HaFAD2-1", 0.77],
  ["HaNAC29", "HaHKT1", 0.84],
  ["HaWRKY33", "HaNAC29", 0.62],
  ["HaLEA14", "HaNAC29", 0.58],
  ["HaDGAT1", "HaFAD3", 0.58],
  ["HaWRI1", "HaSAD6", 0.71],
].map(([source, target, weight]) => ({ source, target, weight }));

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
  const expressionMatrix = asArray(visuals.expression_matrix).length ? asArray(visuals.expression_matrix) : fallbackExpressionMatrix;
  const expressionTissues = Array.isArray(visuals.expression_tissues) && visuals.expression_tissues.length ? visuals.expression_tissues as string[] : fallbackTissues;
  const maxExpression = Math.max(
    1,
    ...expressionMatrix.flatMap((row) => asArray(row.values).map((item) => numberValue(item.value))),
    ...heatRows.map((row) => numberValue(row.expression_value || row.tpm || row.fpkm)),
  );
  const regionVisuals = (asArray(visuals.regions).length ? asArray(visuals.regions) : regions).slice(0, 12);
  const rawRegionMap = asArray(visuals.region_map).length ? asArray(visuals.region_map) : regionVisuals;
  const regionMap = buildRegionMap(rawRegionMap);
  const maxRegionVarieties = Math.max(1, ...regionMap.map((row) => numberValue(row.variety_count)));
  const network = asArray(visuals.network).slice(0, 12);
  const proteinNodes = (asArray(visuals.protein_nodes).length ? asArray(visuals.protein_nodes) : fallbackProteinNodes).slice(0, 10);
  const proteinEdges = (asArray(visuals.protein_edges).length ? asArray(visuals.protein_edges) : fallbackProteinEdges).slice(0, 16);
  const renderedProteinNodes = proteinNodes.length
    ? proteinNodes
    : Array.from(new Set(network.flatMap((edge) => [edge.source, edge.target]).filter(Boolean))).slice(0, 10).map((id, index) => ({ id, label: id, score: 80 - index * 3 }));
  const proteinNodePositions = renderedProteinNodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(1, renderedProteinNodes.length) - Math.PI / 2;
    return {
      ...node,
      x: 50 + Math.cos(angle) * 32,
      y: 43 + Math.sin(angle) * 27,
    };
  });
  const proteinPositionById = new Map(proteinNodePositions.map((node) => [String(node.id || node.label), node]));
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

      <div className="space-y-6">
        <Panel title={t("research.sections.regionHeat")} icon={<MapPinned className="h-5 w-5" />}>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] border" style={{ borderColor: colorWithAlpha(cropConfig.accent, 0.18), background: `radial-gradient(circle at 30% 25%, ${colorWithAlpha(cropConfig.accent, 0.18)}, transparent 31%), linear-gradient(135deg, #f8fafc, ${cropConfig.accentSoft})` }}>
              <div className="absolute left-[18%] top-[18%] h-[62%] w-[66%] rounded-[45%_55%_50%_50%] border bg-white/55 shadow-inner" style={{ borderColor: colorWithAlpha(cropConfig.accent, 0.22) }} />
              <div className="absolute left-[24%] top-[24%] h-[45%] w-[48%] rounded-[48%_52%_55%_45%] border" style={{ borderColor: colorWithAlpha(cropConfig.accent, 0.14), backgroundColor: colorWithAlpha(cropConfig.accent, 0.08) }} />
              {regionMap.map((row, index) => {
                const lng = numberValue(row.lng) || 103.8;
                const lat = numberValue(row.lat) || 36.5;
                const left = Math.max(12, Math.min(86, ((lng - 78) / 54) * 74 + 10));
                const top = Math.max(10, Math.min(84, 88 - ((lat - 18) / 32) * 74));
                const size = 12 + Math.round((numberValue(row.variety_count) / maxRegionVarieties) * 22);
                return (
                  <div key={`${row.code || row.name}-${index}`} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
                    <div className="absolute inset-0 rounded-full opacity-25 blur-md" style={{ width: size + 14, height: size + 14, backgroundColor: cropConfig.accent }} />
                    <div className="relative flex items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-lg" style={{ width: size, height: size, backgroundColor: cropConfig.accent }}>
                      {cleanText(row.code, String(index + 1))}
                    </div>
                    <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-48 -translate-x-1/2 rounded-xl bg-slate-950 p-3 text-xs text-white shadow-xl group-hover:block">
                      <div className="font-semibold">{cleanText(row.name, regionFallback)}</div>
                      <div className="mt-1 text-slate-300">{row.variety_count || 0} {t("research.units.varieties")} · avg oil {row.avg_oil || 0}%</div>
                    </div>
                  </div>
                );
              })}
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/85 px-4 py-3 text-xs text-slate-600 shadow-sm backdrop-blur">
                Geographic distribution map uses curated field-site coordinates and germplasm density.
              </div>
            </div>

            <div className="divide-y divide-slate-100 border-y border-slate-100">
              {regionMap.slice(0, 8).map((row, index) => (
                <div key={`${row.id || row.code}-${index}`} className="grid gap-3 py-3 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                  <span className="font-semibold text-slate-950">{cleanText(row.code || row.name, regionFallback)}</span>
                  <div>
                    <div className="truncate text-sm font-medium text-slate-700">{cleanText(row.name, regionFallback)}</div>
                    <div className="mt-1 text-xs text-slate-500">{cleanText(row.climate, t("research.fallback.climatePending"))}</div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: cropConfig.accentDark }}>{row.variety_count || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <Panel title={t("research.sections.expressionHeat")} icon={<Dna className="h-5 w-5" />} tone="soft">
            <div className="overflow-x-auto">
              {expressionMatrix.length ? (
                <div className="min-w-[520px]">
                  <div className="mb-2 grid gap-1" style={{ gridTemplateColumns: `130px repeat(${Math.max(1, expressionTissues.length)}, minmax(42px, 1fr))` }}>
                    <div />
                    {expressionTissues.map((tissue) => <div key={tissue} className="truncate text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">{tissue}</div>)}
                  </div>
                  <div className="space-y-1">
                    {expressionMatrix.map((row, index) => (
                      <div key={`${row.gene}-${index}`} className="grid gap-1" style={{ gridTemplateColumns: `130px repeat(${Math.max(1, expressionTissues.length)}, minmax(42px, 1fr))` }}>
                        <div className="truncate pr-2 text-xs font-semibold text-slate-700" title={cleanText(row.function, geneFallback)}>{cleanText(row.gene, geneFallback)}</div>
                        {asArray(row.values).map((cell, cellIndex) => {
                          const value = numberValue(cell.value);
                          const intensity = Math.min(1, value / maxExpression);
                          return (
                            <div key={`${row.gene}-${cell.tissue}-${cellIndex}`} title={`${row.gene} ${cell.tissue}: ${value}`} className="h-7 rounded-md border border-white" style={{ backgroundColor: colorWithAlpha(cropConfig.accent, 0.18 + intensity * 0.78) }} />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-10 gap-1">
                  {heatRows.map((row, index) => (
                    <div key={`${row.id}-${index}`} title={`${cleanText(row.gene_id || row.gene, geneFallback)} ${row.expression_value || row.tpm || 0}`} className="aspect-square rounded-[3px] ring-1" style={{ backgroundColor: cropConfig.accentSoft, opacity: Math.min(1, 0.25 + numberValue(row.expression_value || row.tpm || row.fpkm) / 80), boxShadow: `inset 0 0 0 1px ${cropConfig.accent}22` }} />
                  ))}
                </div>
              )}
            </div>
          </Panel>

          <Panel title={t("research.sections.proteinNetwork")} icon={<Network className="h-5 w-5" />}>
            <div className="relative min-h-[390px] overflow-hidden rounded-2xl bg-slate-50">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {(proteinEdges.length ? proteinEdges : network).map((edge, index) => {
                  const source = proteinPositionById.get(String(edge.source));
                  const target = proteinPositionById.get(String(edge.target));
                  if (!source || !target) return null;
                  return (
                    <line
                      key={`${edge.source}-${edge.target}-${index}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={cropConfig.accent}
                      strokeOpacity={0.16 + Math.min(0.5, numberValue(edge.weight) / 2)}
                      strokeWidth={0.45 + Math.min(1.4, numberValue(edge.weight))}
                    />
                  );
                })}
              </svg>
              {proteinNodePositions.map((node, index) => {
                const size = 42 + Math.round(numberValue(node.score) / 12);
                return (
                  <div key={`${node.id || node.label}-${index}`} className="absolute flex items-center justify-center rounded-full border-2 border-white p-2 text-center text-[10px] font-semibold leading-tight shadow-md" style={{ left: `${node.x}%`, top: `${node.y}%`, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, backgroundColor: index < 5 ? cropConfig.accentSoft : colorWithAlpha(cropConfig.accent, 0.08), color: cropConfig.accentDark }}>
                    <span className="line-clamp-2">{cleanText(node.label || node.id, geneFallback)}</span>
                  </div>
                );
              })}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 rounded-xl bg-white/85 p-3 text-xs text-slate-600 shadow-sm backdrop-blur">
                <span className="font-semibold text-slate-800">Network focus:</span>
                <span>oil biosynthesis</span>
                <span>seed storage protein</span>
                <span>stress response</span>
              </div>
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
