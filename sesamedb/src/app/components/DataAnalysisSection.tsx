import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import * as echarts from "echarts";
import { BarChart3, Database, Dna, Download, Droplets, Fingerprint, MapPinned, Network, Search, Sprout, SunMedium, Table2, ThermometerSun } from "lucide-react";
import { cropConfig } from "../cropConfig";

type AnyRow = Record<string, any>;
type ListPayload = AnyRow[] | { count?: number; results?: AnyRow[] };
type ChinaFeature = {
  type: "Feature";
  properties?: { name?: string; adcode?: number | string };
  geometry?: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};
type ChinaGeoJson = {
  type?: string;
  features?: ChinaFeature[];
};
type EChartsInstance = {
  setOption: (option: AnyRow, notMerge?: boolean) => void;
  resize: () => void;
  on: (eventName: string, handler: (params: AnyRow) => void) => void;
  off: (eventName: string, handler: (params: AnyRow) => void) => void;
  dispose: () => void;
};

const pageSizes = [10, 20, 50];
const chinaMapUrl = "/data/china-map.json";

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
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  if (!text) return fallback;
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
const normalizeProvinceName = (value: unknown) =>
  String(value ?? "")
    .replace(/省|市|回族自治区|维吾尔自治区|壮族自治区|自治区|特别行政区/g, "")
    .trim();
const percentFromRange = (value: unknown, min: number, max: number) => {
  const numbers = String(value ?? "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const average = numbers.length ? numbers.reduce((sum, item) => sum + item, 0) / numbers.length : min;
  return Math.max(8, Math.min(100, ((average - min) / (max - min)) * 100));
};
const shortRegionLabel = (row: AnyRow, fallback: string) =>
  cleanText(row.province || row.region || row.name, fallback)
    .replace(/省|市|回族自治区|维吾尔自治区|壮族自治区|自治区|特别行政区/g, "");
const regionKey = (row: AnyRow) => normalizeProvinceName(row.province || row.region || row.name || row.code);
function RegionalChinaEChart({
  chinaMap,
  chinaMapFailed,
  featuredProvinceNames,
  mapSites,
  selectedRegionKey,
  onSelectRegion,
  regionFallback,
  t,
}: {
  chinaMap: ChinaGeoJson | null;
  chinaMapFailed: boolean;
  featuredProvinceNames: Set<string>;
  mapSites: AnyRow[];
  selectedRegionKey: string;
  onSelectRegion: (key: string) => void;
  regionFallback: string;
  t: (key: string) => string;
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [echartsFailed, setEchartsFailed] = useState(false);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || !chinaMap?.features?.length) return;

    let disposed = false;
    let chart: EChartsInstance | null = null;
    const resizeObserver = new ResizeObserver(() => chart?.resize());

    try {
      echarts.registerMap("sunflower-china", chinaMap as any);
      chart = echarts.init(element) as unknown as EChartsInstance;
      resizeObserver.observe(element);
      setEchartsFailed(false);

      const mapSiteKeys = new Set(mapSites.map(regionKey).filter(Boolean));
      const featuredData = mapSites.map((row) => {
          const key = regionKey(row);
          const selected = key === selectedRegionKey;
          const lng = numberValue(row.lng);
          const lat = numberValue(row.lat);
          if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
          return {
          name: cleanText(row.province, regionFallback),
          value: [
            lng,
            lat,
            numberValue(row.oil_content || row.avg_oil || row.score) || 1,
          ],
          symbolSize: selected ? 17 : 12,
          itemStyle: selected
            ? { color: cropConfig.accentDark, borderColor: "#ffffff", borderWidth: 3, shadowColor: colorWithAlpha(cropConfig.accent, 0.55), shadowBlur: 18 }
            : undefined,
          row,
          key,
        };
      }).filter(Boolean);
      const provinceData = (chinaMap.features ?? []).map((feature) => {
          const province = normalizeProvinceName(feature.properties?.name);
          return {
            name: feature.properties?.name,
            value: featuredProvinceNames.has(province) ? 1 : 0,
            itemStyle: province === selectedRegionKey
              ? { areaColor: colorWithAlpha(cropConfig.accent, 0.42), borderColor: cropConfig.accentDark, borderWidth: 1.4 }
              : undefined,
          };
      });

      chart.setOption({
          backgroundColor: "transparent",
          tooltip: {
            trigger: "item",
            borderWidth: 0,
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            textStyle: { color: "#fff", fontSize: 12 },
            formatter: (params: AnyRow) => {
              const row = params.data?.row;
              if (!row) return params.name || "";
              return [
                `<strong>${shortRegionLabel(row, regionFallback)}</strong>`,
                cleanText(row.name, regionFallback),
                `${t("research.map.representativeVarieties")}：${asArray(row.varieties).join("、") || t("research.map.pending")}`,
                `${t("research.map.temperature")}：${cleanText(row.temperature, t("research.map.pending"))}`,
                `${t("research.map.precipitation")}：${cleanText(row.precipitation, t("research.map.pending"))}`,
                `${t("research.map.sunshine")}：${cleanText(row.sunshine, t("research.map.pending"))}`,
              ].join("<br/>");
            },
          },
          geo: {
            map: "sunflower-china",
            roam: false,
            layoutCenter: ["50%", "70%"],
            layoutSize: "110%",
            aspectScale: 0.75,
            itemStyle: {
              areaColor: "#e8f5ee",
              borderColor: "#ffffff",
              borderWidth: 0.8,
              shadowColor: "rgba(15, 23, 42, 0.12)",
              shadowBlur: 10,
            },
            emphasis: {
              label: { color: "#0f172a" },
              itemStyle: { areaColor: colorWithAlpha(cropConfig.accent, 0.38) },
            },
          },
          series: [
            {
              type: "map",
              map: "sunflower-china",
              geoIndex: 0,
              data: provinceData,
              label: { show: false },
              itemStyle: {
                areaColor: "#e2e8f0",
                borderColor: "#ffffff",
                borderWidth: 0.8,
              },
              emphasis: {
                label: { show: true, color: "#0f172a", fontWeight: 700 },
                itemStyle: { areaColor: colorWithAlpha(cropConfig.accent, 0.36) },
              },
              select: { disabled: true },
            },
            {
              type: "lines",
              coordinateSystem: "geo",
              silent: true,
              zlevel: 2,
              lineStyle: { width: 1.2, opacity: 0.34, curveness: 0.18, type: "dashed" },
              data: [
                { coords: [[78, 41], [126, 46]], lineStyle: { color: "#f59e0b" } },
                { coords: [[75, 27], [131, 34]], lineStyle: { color: "#38bdf8" } },
                { coords: [[87, 37], [121, 40]], lineStyle: { color: cropConfig.accent } },
              ],
            },
            {
              type: "effectScatter",
              coordinateSystem: "geo",
              zlevel: 3,
              data: featuredData,
              symbolSize: 12,
              rippleEffect: { brushType: "stroke", scale: 4 },
              itemStyle: {
                color: cropConfig.accentDark,
                borderColor: "#ffffff",
                borderWidth: 2,
              },
              label: {
                show: true,
                formatter: (params: AnyRow) => shortRegionLabel(params.data?.row || {}, regionFallback),
                position: "right",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: 12,
                textBorderColor: "#ffffff",
                textBorderWidth: 3,
              },
            },
          ],
      }, true);

      const handleClick = (params: AnyRow) => {
        const row = params.data?.row;
        const key = row ? regionKey(row) : normalizeProvinceName(params.name);
        if (key && mapSiteKeys.has(key)) onSelectRegion(key);
      };
      chart.off("click", handleClick);
      chart.on("click", handleClick);
    } catch {
      setEchartsFailed(true);
    }

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      chart?.dispose();
    };
  }, [chinaMap, featuredProvinceNames, mapSites, onSelectRegion, regionFallback, selectedRegionKey, t]);

  if (!chinaMap?.features?.length || echartsFailed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-500">
        {chinaMapFailed || echartsFailed ? t("research.map.loadFailed") : t("research.map.loading")}
      </div>
    );
  }

  return <div ref={chartRef} className="absolute inset-0 h-full w-full" role="img" aria-label={t("research.map.realMap")} />;
}

const fallbackTissues = ["根", "叶", "花蕾", "花", "早期种子", "成熟种子"];

const fallbackExpressionMatrix = [
  { gene: "HaFAD2-1", function: "油酸去饱和", values: [18, 32, 54, 68, 81, 74] },
  { gene: "HaFAD3", function: "亚麻酸合成", values: [12, 20, 35, 47, 62, 58] },
  { gene: "HaDGAT1", function: "三酰甘油组装", values: [22, 38, 59, 76, 88, 83] },
  { gene: "HaWRI1", function: "油脂生物合成调控", values: [28, 44, 61, 73, 69, 52] },
  { gene: "HaOLE1", function: "油体形成", values: [8, 16, 42, 66, 91, 87] },
  { gene: "HaSAD6", function: "硬脂酰-ACP 去饱和", values: [26, 41, 64, 79, 72, 55] },
  { gene: "HaNAC29", function: "耐盐响应", values: [11, 23, 39, 57, 68, 70] },
  { gene: "HaWRKY33", function: "列当防御", values: [9, 18, 31, 49, 63, 76] },
  { gene: "HaHKT1", function: "离子运输", values: [15, 26, 34, 52, 67, 72] },
  { gene: "HaCYP707A", function: "胁迫激素代谢", values: [7, 14, 28, 44, 59, 66] },
  { gene: "HaLEA14", function: "籽粒脱水耐受", values: [5, 12, 33, 58, 79, 85] },
  { gene: "HaMYB96", function: "角质层与抗旱响应", values: [13, 25, 43, 60, 71, 64] },
].map((row) => ({
  ...row,
  values: fallbackTissues.map((tissue, index) => ({ tissue, value: row.values[index] })),
}));

const getConfigArray = (key: string, fallback: AnyRow[]) => {
  const value = (cropConfig as unknown as AnyRow)[key];
  return Array.isArray(value) && value.length ? value : fallback;
};

const fingerprintBlueprint = getConfigArray("fingerprintMarkers", [
  { marker: "SSR-01", chromosome: "Chr01", type: "SSR", status: "待导入", usage: "品种身份识别" },
  { marker: "SNP-07", chromosome: "Chr07", type: "SNP", status: "待导入", usage: "高木酚素材料分组" },
  { marker: "InDel-11", chromosome: "Chr11", type: "InDel", status: "待导入", usage: "核心种质一致性校验" },
  { marker: "KASP-18", chromosome: "Chr18", type: "KASP", status: "预留", usage: "功能位点验证" },
]);

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
  const regionListRef = useRef<HTMLDivElement | null>(null);
  const regionItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [nutritionPayload, setNutritionPayload] = useState<ListPayload | null>(null);
  const [regions, setRegions] = useState<AnyRow[]>([]);
  const [visuals, setVisuals] = useState<AnyRow>({ regions: [], network: [], gene_expression: [], counts: {} });
  const [chinaMap, setChinaMap] = useState<ChinaGeoJson | null>(null);
  const [chinaMapFailed, setChinaMapFailed] = useState(false);
  const [selectedRegionKey, setSelectedRegionKey] = useState("");

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

  useEffect(() => {
    fetch(chinaMapUrl)
      .then((response) => {
        if (!response.ok) throw new Error("china-map");
        return response.json();
      })
      .then((data) => {
        setChinaMap(Array.isArray(data?.features) ? data : null);
        setChinaMapFailed(false);
      })
      .catch(() => {
        setChinaMap(null);
        setChinaMapFailed(true);
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
  const regionalFeatureSites = asArray(visuals.region_map).slice(0, 50);
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
  const featuredProvinceNames = new Set(regionalFeatureSites.map((row) => normalizeProvinceName(row.province)).filter(Boolean));
  const mapSites = regionalFeatureSites.map((row, index) => ({ ...row, index }));

  useEffect(() => {
    if (!selectedRegionKey) return;
    regionItemRefs.current[selectedRegionKey]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedRegionKey]);

  return (
    <div className="space-y-6 text-slate-900">
      <div className="border-t border-slate-200 pt-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>{t("research.integratedView")}</p>
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
              <Download className="h-4 w-4" />{t("research.exportCsv", { name: t(`research.exportNames.${item}`) })}
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
        <Panel title={t("research.sections.regionalMap")} icon={<MapPinned className="h-5 w-5" />}>
          <div className="grid items-stretch gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="flex min-h-[460px] flex-col overflow-hidden rounded-[1.25rem] border bg-white shadow-sm xl:h-[560px]" style={{ borderColor: colorWithAlpha(cropConfig.accent, 0.18) }}>
              <div className="shrink-0 border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: cropConfig.accentDark }}>{t("research.map.realMap")}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{t("research.map.provinceBoundary")}</div>
                  </div>
                  <div className="text-xs text-slate-400">{t("research.map.source")}</div>
                </div>
                <div className="mt-2 text-xs leading-5 text-slate-500">{t("research.map.note")}</div>
              </div>

              <div className="relative h-[320px] min-h-0 flex-1 overflow-hidden bg-slate-50 sm:h-[360px] lg:h-[380px] xl:h-auto">
                <div className="pointer-events-none absolute inset-3 rounded-[1rem] border border-white/80" />

                <RegionalChinaEChart
                  chinaMap={chinaMap}
                  chinaMapFailed={chinaMapFailed}
                  featuredProvinceNames={featuredProvinceNames}
                  mapSites={mapSites}
                  selectedRegionKey={selectedRegionKey}
                  onSelectRegion={setSelectedRegionKey}
                  regionFallback={regionFallback}
                  t={t}
                />
              </div>

              <div className="grid shrink-0 gap-2 border-t border-slate-100 bg-white p-3 text-xs text-slate-600 sm:grid-cols-3 sm:p-4">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="text-lg font-semibold text-slate-900">{regionalFeatureSites.length}</div>
                  <div>{t("research.map.sites")}</div>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="text-lg font-semibold text-slate-900">{featuredProvinceNames.size}</div>
                  <div>{t("research.map.provinces")}</div>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="font-semibold text-slate-900">{t("research.map.temperature")} / {t("research.map.precipitation")}</div>
                  <div className="mt-1 text-slate-500">{t("research.map.sunshine")}</div>
                </div>
              </div>
            </div>

            <div ref={regionListRef} className="min-h-[360px] overflow-y-auto rounded-[1.25rem] border border-slate-100 bg-white px-4 shadow-sm xl:h-[560px] xl:min-h-0">
              {!regionalFeatureSites.length && (
                <div className="flex h-full min-h-[320px] items-center justify-center text-center text-sm leading-6 text-slate-500">
                  {t("research.map.noMapData")}
                </div>
              )}
              {regionalFeatureSites.map((row, index) => {
                const key = regionKey(row);
                const selected = key === selectedRegionKey;
                return (
                <div
                  ref={(element) => { regionItemRefs.current[key] = element; }}
                  key={`${row.id || row.code}-${index}`}
                  className={`grid gap-3 border-b py-4 transition-all duration-200 last:border-b-0 sm:grid-cols-[64px_1fr] sm:items-start ${
                    selected ? "rounded-2xl border border-transparent px-3 shadow-sm" : "border-slate-100"
                  }`}
                  style={selected ? { backgroundColor: colorWithAlpha(cropConfig.accent, 0.08), boxShadow: `inset 3px 0 0 ${cropConfig.accent}` } : undefined}
                >
                  <span className="w-fit rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: selected ? cropConfig.accentDark : cropConfig.accent }}>{shortRegionLabel(row, regionFallback)}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-800">
                      <span>{cleanText(row.name, regionFallback)}</span>
                      <span className="text-xs font-normal text-slate-500">{cleanText(row.province, t("research.map.provinceFallback"))} · {cleanText(row.region, t("research.map.regionFallback"))}</span>
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">{cleanText(row.trait, t("research.map.traitFallback"))} · {cleanText(row.component, t("research.map.componentShortFallback"))}</div>
                    <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                      <span className="inline-flex items-center gap-1"><ThermometerSun className="h-3.5 w-3.5" style={{ color: cropConfig.accent }} />{row.temperature}</span>
                      <span className="inline-flex items-center gap-1"><Droplets className="h-3.5 w-3.5" style={{ color: cropConfig.accent }} />{row.precipitation}</span>
                      <span className="inline-flex items-center gap-1"><SunMedium className="h-3.5 w-3.5" style={{ color: cropConfig.accent }} />{row.sunshine}</span>
                    </div>
                    <div className="mt-3 grid gap-2 text-[11px] text-slate-500 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                      <Meter label={t("research.map.temperature")} value={row.temperature} width={percentFromRange(row.temperature, 0, 18)} />
                      <Meter label={t("research.map.precipitation")} value={row.precipitation} width={percentFromRange(row.precipitation, 100, 900)} />
                      <Meter label={t("research.map.sunshine")} value={row.sunshine} width={percentFromRange(row.sunshine, 1800, 3400)} />
                    </div>
                    <div className="mt-2 text-xs leading-5 text-slate-500">{t("research.map.representativeVarieties")}：{asArray(row.varieties).join("、") || t("research.map.pending")}；{t("research.map.soil")}：{cleanText(row.soil, t("research.map.pending"))}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-400">{t("research.map.coordinate")}：{row.lng}, {row.lat}</div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </Panel>

        <Panel title={t("research.sections.fingerprint")} icon={<Fingerprint className="h-5 w-5" />} tone="soft">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-slate-200">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: cropConfig.accentDark }}>
                <Sprout className="h-4 w-4" />
                {t("research.fingerprint.status")}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">{t("research.fingerprint.title")}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("research.fingerprint.desc")}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {[t("research.fingerprint.sample"), t("research.fingerprint.markerSite"), t("research.fingerprint.allele")].map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600 ring-1 ring-slate-100">{item}</div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid grid-cols-[1fr_0.8fr_0.7fr_0.7fr_1fr] bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                <span>{t("research.fingerprint.marker")}</span><span>{t("research.fingerprint.chromosome")}</span><span>{t("research.fingerprint.type")}</span><span>{t("research.fingerprint.statusColumn")}</span><span>{t("research.fingerprint.usage")}</span>
              </div>
              {fingerprintBlueprint.map((item, index) => (
                <div key={`${item.marker}-${index}`} className="grid grid-cols-[1fr_0.8fr_0.7fr_0.7fr_1fr] gap-2 border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">{item.marker}</span>
                  <span>{item.chromosome}</span>
                  <span>{item.type}</span>
                  <span className="text-xs" style={{ color: cropConfig.accentDark }}>{item.status}</span>
                  <span className="text-xs text-slate-500">{item.usage}</span>
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
                <span className="font-semibold text-slate-800">{t("research.network.focus")}</span>
                <span>{t("research.network.oil")}</span>
                <span>{t("research.network.storage")}</span>
                <span>{t("research.network.stress")}</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="border-l border-slate-200 pl-4"><div className="flex items-center gap-2" style={{ color: cropConfig.accent }}>{icon}<span className="text-xs font-medium text-slate-600">{label}</span></div><div className="mt-2 text-2xl font-bold text-slate-950">{value}</div></div>;
}

function Meter({ label, value, width }: { label: string; value: unknown; width: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span>{label}</span>
        <span className="truncate text-slate-400">{String(value ?? "-")}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full" style={{ width: `${width}%`, backgroundColor: cropConfig.accent }} />
      </div>
    </div>
  );
}

function Panel({ title, icon, children, tone = "white" }: { title: string; icon: ReactNode; children: ReactNode; tone?: "white" | "soft" }) {
  return <section className="rounded-[1.25rem] border border-slate-200 p-6 shadow-sm" style={{ backgroundColor: tone === "soft" ? cropConfig.accentSoft : "#fff" }}><div className="mb-5 flex items-center gap-2" style={{ color: cropConfig.accent }}><div className="rounded-xl bg-white/80 p-2">{icon}</div><h2 className="text-lg font-semibold text-slate-950">{title}</h2></div>{children}</section>;
}
