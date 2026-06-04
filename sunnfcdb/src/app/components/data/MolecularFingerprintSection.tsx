import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BarChart3, CheckCircle2, Database, Dna, Download, FlaskConical, GitBranch, Layers, Search, ShieldCheck } from "lucide-react";
import { cropConfig } from "../../cropConfig";
import {
  fetchSunflowerGeneticDiversityAnalyses,
  fetchSunflowerGermplasmResources,
  fetchSunflowerMarkerLoci,
  fetchSunflowerMolecularFingerprints,
  fetchSunflowerSequencingData,
} from "../../../apis/data_apis";
import { asArray, displayText, downloadCsv } from "./shared";

const tabs = [
  { key: "markers", label: "标记位点库" },
  { key: "matrix", label: "指纹矩阵" },
  { key: "germplasm", label: "种质资源" },
  { key: "sequencing", label: "测序数据" },
  { key: "diversity", label: "遗传多样性" },
];

const markerTypes = ["all", "SSR", "SNP", "INDEL", "KASP", "EST-SSR", "gSSR"];
const markerColors: Record<string, string> = {
  SSR: "bg-emerald-100 text-emerald-800",
  SNP: "bg-blue-100 text-blue-800",
  INDEL: "bg-purple-100 text-purple-800",
  KASP: "bg-orange-100 text-orange-800",
  "EST-SSR": "bg-teal-100 text-teal-800",
  gSSR: "bg-cyan-100 text-cyan-800",
};

const stripColors = ["#10b981", "#2563eb", "#f59e0b", "#8b5cf6", "#14b8a6", "#ef4444", "#64748b"];
const clusterPalette = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#64748b"];
const tablePageSize = 8;

export function MolecularFingerprintSection() {
  const [activeTab, setActiveTab] = useState("markers");
  const [query, setQuery] = useState("");
  const [markerType, setMarkerType] = useState("all");
  const [selectedVarietyId, setSelectedVarietyId] = useState<number | null>(null);
  const [markerPage, setMarkerPage] = useState(0);
  const [germplasmPage, setGermplasmPage] = useState(0);
  const [sequencingPage, setSequencingPage] = useState(0);
  const [markers, setMarkers] = useState<any[]>([]);
  const [fingerprints, setFingerprints] = useState<any[]>([]);
  const [germplasm, setGermplasm] = useState<any[]>([]);
  const [sequencing, setSequencing] = useState<any[]>([]);
  const [diversity, setDiversity] = useState<any[]>([]);

  useEffect(() => {
    Promise.allSettled([
      fetchSunflowerMarkerLoci({ limit: 500 }),
      fetchSunflowerMolecularFingerprints({ limit: 1000 }),
      fetchSunflowerGermplasmResources({ limit: 500 }),
      fetchSunflowerSequencingData({ limit: 500 }),
      fetchSunflowerGeneticDiversityAnalyses({ limit: 500 }),
    ]).then(([markerResult, fingerprintResult, germplasmResult, sequencingResult, diversityResult]) => {
      if (markerResult.status === "fulfilled") setMarkers(asArray(markerResult.value));
      if (fingerprintResult.status === "fulfilled") setFingerprints(asArray(fingerprintResult.value));
      if (germplasmResult.status === "fulfilled") setGermplasm(asArray(germplasmResult.value));
      if (sequencingResult.status === "fulfilled") setSequencing(asArray(sequencingResult.value));
      if (diversityResult.status === "fulfilled") setDiversity(asArray(diversityResult.value));
    });
  }, []);

  const filteredMarkers = useMemo(() => {
    const text = query.trim().toLowerCase();
    return markers.filter((marker) => {
      const matchesType = markerType === "all" || marker.marker_type === markerType;
      const haystack = [marker.marker_id, marker.marker_name, marker.chromosome, marker.associated_trait, marker.annotated_gene].join(" ").toLowerCase();
      return matchesType && (!text || haystack.includes(text));
    });
  }, [markers, markerType, query]);

  useEffect(() => setMarkerPage(0), [markerType, query]);

  const matrixVarieties = useMemo(() => {
    const map = new Map<number, string>();
    fingerprints.forEach((row) => {
      if (row.variety && !map.has(row.variety)) map.set(row.variety, row.variety_name || `品种 ${row.variety}`);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [fingerprints]);

  const matrixMarkers = useMemo(() => {
    const map = new Map<string, { name: string; type: string }>();
    fingerprints.forEach((row) => {
      const markerId = row.marker_id || row.marker;
      if (markerId && !map.has(markerId)) map.set(markerId, { name: row.marker_name || markerId, type: row.marker_type || "SSR" });
    });
    return Array.from(map.entries()).map(([id, value]) => ({ id, ...value }));
  }, [fingerprints]);

  const fingerprintLookup = useMemo(() => {
    const map = new Map<string, any>();
    fingerprints.forEach((row) => {
      const markerId = row.marker_id || row.marker;
      if (row.variety && markerId) map.set(`${row.variety}-${markerId}`, row);
    });
    return map;
  }, [fingerprints]);

  useEffect(() => {
    if (!selectedVarietyId && matrixVarieties.length) setSelectedVarietyId(matrixVarieties[0].id);
    if (selectedVarietyId && matrixVarieties.length && !matrixVarieties.some((item) => item.id === selectedVarietyId)) setSelectedVarietyId(matrixVarieties[0].id);
  }, [matrixVarieties, selectedVarietyId]);

  const genotypeClass = (code: unknown) => {
    if (code === "AA" || code === "0") return "bg-emerald-200";
    if (code === "BB" || code === "1") return "bg-blue-200";
    if (code === "AB" || code === "H") return "bg-yellow-200";
    if (String(code || "").includes("/")) return "bg-purple-200";
    return code ? "bg-slate-200" : "bg-white";
  };

  const genotypeColor = (code: unknown) => {
    const text = String(code || "-");
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) hash += text.charCodeAt(index);
    return stripColors[hash % stripColors.length];
  };

  const similarityPairs = useMemo(() => {
    const rows: { a: string; b: string; score: number; same: number; total: number }[] = [];
    matrixVarieties.forEach((left, leftIndex) => {
      matrixVarieties.slice(leftIndex + 1).forEach((right) => {
        let same = 0;
        let total = 0;
        matrixMarkers.forEach((marker) => {
          const leftCode = fingerprintLookup.get(`${left.id}-${marker.id}`)?.genotype_code;
          const rightCode = fingerprintLookup.get(`${right.id}-${marker.id}`)?.genotype_code;
          if (leftCode && rightCode) {
            total += 1;
            if (leftCode === rightCode) same += 1;
          }
        });
        if (total) rows.push({ a: left.name, b: right.name, score: same / total, same, total });
      });
    });
    return rows.sort((a, b) => b.score - a.score);
  }, [fingerprintLookup, matrixMarkers, matrixVarieties]);

  const clusterGroups = useMemo(() => {
    const groups = new Map<string, { name: string; varieties: string[]; anchor: string }>();
    matrixVarieties.forEach((variety, index) => {
      const anchorMarker = matrixMarkers[index % Math.max(1, Math.min(3, matrixMarkers.length))];
      const anchorCode = anchorMarker ? fingerprintLookup.get(`${variety.id}-${anchorMarker.id}`)?.genotype_code : "";
      const groupName = anchorCode ? `簇 ${String.fromCharCode(65 + (String(anchorCode).charCodeAt(0) % 3))}` : "待聚类";
      const current = groups.get(groupName) || { name: groupName, varieties: [], anchor: anchorCode || "-" };
      current.varieties.push(variety.name);
      groups.set(groupName, current);
    });
    return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [fingerprintLookup, matrixMarkers, matrixVarieties]);

  const coreChecks = useMemo(() => {
    return matrixVarieties.map((variety) => {
      const rows = matrixMarkers.map((marker) => fingerprintLookup.get(`${variety.id}-${marker.id}`)).filter(Boolean);
      const missing = Math.max(0, matrixMarkers.length - rows.length);
      const avgQuality = rows.length ? rows.reduce((sum, row) => sum + Number(row.quality_score || 0), 0) / rows.length : 0;
      const maxSimilarity = similarityPairs
        .filter((pair) => pair.a === variety.name || pair.b === variety.name)
        .reduce((max, pair) => Math.max(max, pair.score), 0);
      const status = missing > 1 || avgQuality < 88 ? "复核" : maxSimilarity >= 0.95 ? "疑似重复" : "通过";
      return { ...variety, missing, avgQuality, maxSimilarity, status };
    });
  }, [fingerprintLookup, matrixMarkers, matrixVarieties, similarityPairs]);

  const selectedVariety = matrixVarieties.find((item) => item.id === selectedVarietyId) || matrixVarieties[0];
  const stripMarkers = matrixMarkers.slice(0, 12);
  const matrixCoverage = matrixVarieties.length && matrixMarkers.length ? Math.round((fingerprints.length / (matrixVarieties.length * matrixMarkers.length)) * 100) : 0;
  const meanSimilarity = similarityPairs.length ? similarityPairs.reduce((sum, pair) => sum + pair.score, 0) / similarityPairs.length : 0;
  const corePassCount = coreChecks.filter((row) => row.status === "通过").length;
  const pagedMarkers = paginate(filteredMarkers, markerPage, tablePageSize);
  const pagedGermplasm = paginate(germplasm, germplasmPage, tablePageSize);
  const pagedSequencing = paginate(sequencing, sequencingPage, tablePageSize);

  const exportMarkers = () => {
    downloadCsv(
      "marker_loci.csv",
      ["标记ID", "名称", "类型", "染色体", "位置", "关联性状", "PIC"],
      filteredMarkers.map((marker) => [marker.marker_id, marker.marker_name, marker.marker_type, marker.chromosome, marker.position, marker.associated_trait, marker.pic]),
    );
  };

  return (
    <section id="molecular-fingerprint" className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: cropConfig.accent }}>
            <Dna className="h-4 w-4" />
            Molecular fingerprint
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">分子指纹与种质资源</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">整合 SSR、SNP、INDEL、KASP 等标记位点，展示品种指纹条带、相似性聚类、核心种质校验、测序记录和遗传多样性分析结果。</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          {[
            [Dna, markers.length, "标记"],
            [FlaskConical, matrixVarieties.length, "指纹品种"],
            [BarChart3, sequencing.length, "测序"],
            [Layers, diversity.length, "分析"],
          ].map(([Icon, value, label]: any) => (
            <div key={label} className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600 ring-1 ring-slate-100">
              <div className="flex items-center gap-1"><Icon className="h-3.5 w-3.5" style={{ color: cropConfig.accent }} />{label}</div>
              <div className="mt-1 text-lg font-bold text-slate-950">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`} style={activeTab === tab.key ? { backgroundColor: cropConfig.accent } : undefined}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "markers" && (
        <div className="mt-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 lg:max-w-xl">
              <Search className="ml-2 mt-2 h-4 w-4 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="搜索标记、染色体、性状..." />
            </div>
            <div className="flex gap-2">
              <select value={markerType} onChange={(event) => setMarkerType(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                {markerTypes.map((item) => <option key={item} value={item}>{item === "all" ? "全部类型" : item}</option>)}
              </select>
              <button onClick={exportMarkers} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                CSV
              </button>
            </div>
          </div>
          <Table headers={["标记ID", "名称", "类型", "染色体", "位置", "关联性状", "PIC"]}>
            {pagedMarkers.map((marker) => (
              <tr key={marker.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-semibold text-slate-900">{displayText(marker.marker_id)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(marker.marker_name)}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${markerColors[marker.marker_type] || "bg-slate-100 text-slate-700"}`}>{displayText(marker.marker_type)}</span></td>
                <td className="px-4 py-3 text-slate-600">{displayText(marker.chromosome)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(marker.position)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(marker.associated_trait)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(marker.pic)}</td>
              </tr>
            ))}
          </Table>
          <Pagination page={markerPage} pageSize={tablePageSize} total={filteredMarkers.length} onPageChange={setMarkerPage} />
          {!filteredMarkers.length && <Empty text="暂无标记位点数据" />}
        </div>
      )}

      {activeTab === "matrix" && (
        <div className="mt-5 space-y-5">
          {fingerprints.length ? (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <Metric icon={<Dna className="h-4 w-4" />} label="矩阵覆盖率" value={`${matrixCoverage}%`} />
                <Metric icon={<GitBranch className="h-4 w-4" />} label="平均相似度" value={`${(meanSimilarity * 100).toFixed(1)}%`} />
                <Metric icon={<ShieldCheck className="h-4 w-4" />} label="核心校验通过" value={`${corePassCount}/${coreChecks.length}`} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">品种指纹条带</h3>
                    <p className="mt-1 text-xs text-slate-500">按标记位点展示当前品种的分型编码，可用于快速身份识别。</p>
                  </div>
                  <select value={selectedVariety?.id || ""} onChange={(event) => setSelectedVarietyId(Number(event.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
                    {matrixVarieties.map((variety) => <option key={variety.id} value={variety.id}>{variety.name}</option>)}
                  </select>
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, stripMarkers.length)}, minmax(52px, 1fr))` }}>
                  {stripMarkers.map((marker) => {
                    const cell = selectedVariety ? fingerprintLookup.get(`${selectedVariety.id}-${marker.id}`) : null;
                    const code = cell?.genotype_code || cell?.fragment_size || "-";
                    return (
                      <div key={marker.id} className="min-h-[76px] rounded-lg bg-white p-2 text-center ring-1 ring-slate-200">
                        <div className="mx-auto h-8 rounded-md" style={{ backgroundColor: genotypeColor(code), opacity: code === "-" ? 0.18 : 0.88 }} />
                        <div className="mt-2 truncate text-[10px] font-semibold text-slate-500" title={marker.name}>{marker.name}</div>
                        <div className="truncate text-xs font-bold text-slate-900">{code}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="max-h-[520px] overflow-auto">
                    <table className="min-w-[760px] border-collapse text-xs">
                      <thead>
                        <tr>
                          <th className="sticky left-0 top-0 z-20 border border-slate-200 bg-white px-2 py-2 text-left text-slate-600">品种 / 标记</th>
                          {matrixMarkers.map((marker) => <th key={marker.id} className="sticky top-0 z-10 border border-slate-200 bg-white px-2 py-2 text-center text-slate-600">{marker.name}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {matrixVarieties.map((variety) => (
                          <tr key={variety.id}>
                            <td className="sticky left-0 z-10 border border-slate-200 bg-white px-2 py-2 font-semibold text-slate-800">{variety.name}</td>
                            {matrixMarkers.map((marker) => {
                              const cell = fingerprintLookup.get(`${variety.id}-${marker.id}`);
                              return <td key={marker.id} className={`border border-slate-200 px-2 py-2 text-center ${genotypeClass(cell?.genotype_code)}`}>{cell?.genotype_code || cell?.fragment_size || "-"}</td>;
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:[&>section]:h-[760px]">
                  <Panel title="相似性聚类" icon={<GitBranch className="h-4 w-4" />}>
                    <div className="min-h-0 flex-1 overflow-auto pr-1">
                      <ClusterDendrogram groups={clusterGroups} similarityPairs={similarityPairs} />
                      <div className="space-y-3">
                        {clusterGroups.map((group, index) => {
                          const color = clusterPalette[index % clusterPalette.length];
                          return (
                          <div key={group.name} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100" style={{ borderLeft: `4px solid ${color}` }}>
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{group.name}</span>
                              <span className="text-xs text-slate-500">锚定 {group.anchor}</span>
                            </div>
                            <div className="mt-2 text-xs leading-5 text-slate-600">{group.varieties.join("、")}</div>
                          </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <div className="mb-2 text-xs font-semibold text-slate-500">相似度最高组合</div>
                        {similarityPairs.slice(0, 4).map((pair) => (
                          <div key={`${pair.a}-${pair.b}`} className="mb-2 text-xs text-slate-600">
                            <div className="flex justify-between gap-2"><span className="truncate">{pair.a} / {pair.b}</span><span>{(pair.score * 100).toFixed(1)}%</span></div>
                            <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full" style={{ width: `${pair.score * 100}%`, backgroundColor: cropConfig.accent }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Panel>

                  <Panel title="核心种质校验" icon={<ShieldCheck className="h-4 w-4" />}>
                    <div className="mb-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-emerald-50 px-2 py-3 text-emerald-700 ring-1 ring-emerald-100">
                        <div className="text-lg font-bold">{corePassCount}</div>
                        <div>通过</div>
                      </div>
                      <div className="rounded-xl bg-orange-50 px-2 py-3 text-orange-700 ring-1 ring-orange-100">
                        <div className="text-lg font-bold">{coreChecks.filter((row) => row.status === "疑似重复").length}</div>
                        <div>疑似重复</div>
                      </div>
                      <div className="rounded-xl bg-slate-100 px-2 py-3 text-slate-700 ring-1 ring-slate-200">
                        <div className="text-lg font-bold">{coreChecks.filter((row) => row.status === "复核").length}</div>
                        <div>复核</div>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
                      {coreChecks.map((row) => (
                        <div key={row.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-xl bg-slate-50 p-3 text-xs ring-1 ring-slate-100">
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-slate-900">{row.name}</div>
                            <div className="mt-1 text-slate-500">缺失 {row.missing} · 质量 {row.avgQuality.toFixed(1)} · 最高相似 {(row.maxSimilarity * 100).toFixed(1)}%</div>
                          </div>
                          <span className={`inline-flex h-7 items-center rounded-full px-2 font-semibold ${row.status === "通过" ? "bg-emerald-100 text-emerald-700" : row.status === "疑似重复" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-700"}`}>
                            {row.status === "通过" && <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}
                            {row.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              </div>
            </>
          ) : <Empty text="暂无指纹矩阵数据" />}
        </div>
      )}

      {activeTab === "germplasm" && (
        <Table headers={["品种", "种质编号", "类型", "采集地点", "采集年份", "提供机构", "分子数据", "测序数据"]}>
          {pagedGermplasm.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">{displayText(row.variety_name)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.germplasm_number)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.germplasm_type)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.collection_site)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.collection_year)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.donor_institution)}</td>
              <td className="px-4 py-3 text-slate-600">{row.has_molecular_data ? "有" : "无"}</td>
              <td className="px-4 py-3 text-slate-600">{row.has_sequencing_data ? "有" : "无"}</td>
            </tr>
          ))}
        </Table>
      )}
      {activeTab === "germplasm" && <Pagination page={germplasmPage} pageSize={tablePageSize} total={germplasm.length} onPageChange={setGermplasmPage} />}

      {activeTab === "sequencing" && (
        <Table headers={["品种", "登录号", "类型", "平台", "深度", "SNP", "INDEL", "公共数据库", "链接"]}>
          {pagedSequencing.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">{displayText(row.variety_name)}</td>
              <td className="px-4 py-3 font-mono text-blue-600">{displayText(row.accession_number)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.data_type)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.platform)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.coverage)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.snp_count)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.indel_count)}</td>
              <td className="px-4 py-3 text-slate-600">{displayText(row.public_database)}</td>
              <td className="px-4 py-3">{row.data_url ? <a href={row.data_url} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">查看</a> : "-"}</td>
            </tr>
          ))}
        </Table>
      )}
      {activeTab === "sequencing" && <Pagination page={sequencingPage} pageSize={tablePageSize} total={sequencing.length} onPageChange={setSequencingPage} />}

      {activeTab === "diversity" && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {diversity.map((row) => (
            <article key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-950">{displayText(row.analysis_name)}</h3>
                <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{displayText(row.analysis_type)}</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{displayText(row.description, "暂无分析说明")}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>标记：{displayText(row.marker_count)}</span>
                <span>品种：{displayText(row.variety_count)}</span>
                <span>类型：{displayText(row.marker_type)}</span>
              </div>
              {row.result_image_url && <img src={row.result_image_url} alt={row.analysis_name} className="mt-4 max-h-56 w-full rounded-xl border border-slate-200 object-contain" />}
            </article>
          ))}
          {!diversity.length && <Empty text="暂无遗传多样性分析结果" />}
        </div>
      )}
    </section>
  );
}

function paginate<T>(rows: T[], page: number, pageSize: number) {
  const maxPage = Math.max(0, Math.ceil(rows.length / pageSize) - 1);
  const currentPage = Math.min(page, maxPage);
  return rows.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
}

function Pagination({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  if (total <= pageSize) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-sm text-slate-600">
      <span className="mr-auto text-xs text-slate-500">共 {total} 条，每页 {pageSize} 条</span>
      <button disabled={currentPage === 0} onClick={() => onPageChange(Math.max(0, currentPage - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50">上一页</button>
      <span className="text-xs text-slate-500">{currentPage + 1} / {pageCount}</span>
      <button disabled={currentPage + 1 >= pageCount} onClick={() => onPageChange(Math.min(pageCount - 1, currentPage + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50">下一页</button>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500" style={{ color: cropConfig.accent }}>{icon}{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

function ClusterDendrogram({ groups, similarityPairs }: { groups: { name: string; varieties: string[]; anchor: string }[]; similarityPairs: { a: string; b: string; score: number }[] }) {
  const rows = groups.flatMap((group) => group.varieties.map((variety) => ({ group, variety })));
  const height = Math.max(190, rows.length * 28 + 34);
  const rootX = 36;
  const baseGroupX = 170;
  const leafX = 420;
  const yFor = (index: number) => 24 + index * 28;
  const getGroupScore = (varieties: string[]) => {
    const set = new Set(varieties);
    const pairs = similarityPairs.filter((pair) => set.has(pair.a) && set.has(pair.b));
    return pairs.length ? pairs.reduce((sum, pair) => sum + pair.score, 0) / pairs.length : 0.72;
  };
  const groupLayouts = groups.map((group, groupIndex) => {
    const indexes = rows.map((row, index) => row.group.name === group.name ? index : -1).filter((index) => index >= 0);
    const top = yFor(indexes[0] || 0);
    const bottom = yFor(indexes[indexes.length - 1] || 0);
    const center = (top + bottom) / 2;
    const score = getGroupScore(group.varieties);
    return { group, top, bottom, center, x: baseGroupX + score * 60, score, color: clusterPalette[groupIndex % clusterPalette.length] };
  });
  const rootTop = groupLayouts[0]?.center || 24;
  const rootBottom = groupLayouts[groupLayouts.length - 1]?.center || rootTop;

  if (!rows.length) return <Empty text="暂无聚类图数据" />;
  return (
    <div className="mb-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
      <div className="mb-2 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold text-slate-700">品种相似性聚类图</span>
        <span>相似度越高，分支越靠右</span>
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {groupLayouts.map(({ group, color }) => (
          <span key={group.name} className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {group.name}
          </span>
        ))}
      </div>
      <div className="max-h-72 overflow-auto rounded-lg bg-white p-2">
        <svg viewBox={`0 0 560 ${height}`} className="min-w-[520px] text-xs" style={{ height }}>
          <line x1={rootX} y1={rootTop} x2={rootX} y2={rootBottom} stroke="#cbd5e1" strokeWidth="2" />
          <text x={8} y={Math.max(16, rootTop - 8)} fill="#64748b" fontSize="11">聚类根</text>
          {groupLayouts.map(({ group, top, bottom, center, x, score, color }) => (
            <g key={group.name}>
              <line x1={rootX} y1={center} x2={x} y2={center} stroke="#94a3b8" strokeWidth="2" />
              <line x1={x} y1={top} x2={x} y2={bottom} stroke={color} strokeWidth="2.5" />
              <circle cx={x} cy={center} r="4" fill={color} />
              <text x={x + 8} y={center - 8} fill="#0f172a" fontSize="12" fontWeight="700">{group.name}</text>
              <text x={x + 8} y={center + 7} fill="#64748b" fontSize="10">{(score * 100).toFixed(1)}%</text>
            </g>
          ))}
          {rows.map((row, index) => {
            const y = yFor(index);
            const layout = groupLayouts.find((item) => item.group.name === row.group.name);
            const groupX = layout?.x || baseGroupX;
            return (
              <g key={`${row.group.name}-${row.variety}`}>
                <line x1={groupX} y1={y} x2={leafX} y2={y} stroke={layout?.color || "#cbd5e1"} strokeWidth="1.5" opacity="0.75" />
                <circle cx={leafX} cy={y} r="3.5" fill="#ffffff" stroke={layout?.color || cropConfig.accent} strokeWidth="1.5" />
                <text x={leafX + 10} y={y + 4} fill="#334155" fontSize="12">{row.variety}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <span style={{ color: cropConfig.accent }}>{icon}</span>
        {title}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
      <Database className="mb-3 h-8 w-8 text-slate-300" />
      {text}
    </div>
  );
}

