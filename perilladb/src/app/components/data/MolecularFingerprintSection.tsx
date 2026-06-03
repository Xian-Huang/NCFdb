import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BarChart3, Database, Dna, Download, FlaskConical, Layers, Search } from "lucide-react";
import { cropConfig } from "../../cropConfig";
import {
  fetchPerillaGeneticDiversityAnalyses,
  fetchPerillaGermplasmResources,
  fetchPerillaMarkerLoci,
  fetchPerillaMolecularFingerprints,
  fetchPerillaSequencingData,
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

export function MolecularFingerprintSection() {
  const [activeTab, setActiveTab] = useState("markers");
  const [query, setQuery] = useState("");
  const [markerType, setMarkerType] = useState("all");
  const [markers, setMarkers] = useState<any[]>([]);
  const [fingerprints, setFingerprints] = useState<any[]>([]);
  const [germplasm, setGermplasm] = useState<any[]>([]);
  const [sequencing, setSequencing] = useState<any[]>([]);
  const [diversity, setDiversity] = useState<any[]>([]);

  useEffect(() => {
    Promise.allSettled([
      fetchPerillaMarkerLoci({ limit: 500 }),
      fetchPerillaMolecularFingerprints({ limit: 1000 }),
      fetchPerillaGermplasmResources({ limit: 500 }),
      fetchPerillaSequencingData({ limit: 500 }),
      fetchPerillaGeneticDiversityAnalyses({ limit: 500 }),
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

  const genotypeClass = (code: unknown) => {
    if (code === "AA" || code === "0") return "bg-emerald-200";
    if (code === "BB" || code === "1") return "bg-blue-200";
    if (code === "AB" || code === "H") return "bg-yellow-200";
    return code ? "bg-slate-200" : "bg-white";
  };

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
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">整合 SSR、SNP、INDEL、KASP 等标记位点、品种指纹矩阵、测序记录和遗传多样性分析结果。</p>
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
            {filteredMarkers.map((marker) => (
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
          {!filteredMarkers.length && <Empty text="暂无标记位点数据" />}
        </div>
      )}

      {activeTab === "matrix" && (
        <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 p-4">
          {fingerprints.length ? (
            <table className="min-w-[760px] border-collapse text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 border border-slate-200 bg-white px-2 py-2 text-left text-slate-600">品种 / 标记</th>
                  {matrixMarkers.map((marker) => <th key={marker.id} className="border border-slate-200 px-2 py-2 text-center text-slate-600">{marker.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {matrixVarieties.map((variety) => (
                  <tr key={variety.id}>
                    <td className="sticky left-0 z-10 border border-slate-200 bg-white px-2 py-2 font-semibold text-slate-800">{variety.name}</td>
                    {matrixMarkers.map((marker) => {
                      const cell = fingerprints.find((row) => row.variety === variety.id && (row.marker_id || row.marker) === marker.id);
                      return <td key={marker.id} className={`border border-slate-200 px-2 py-2 text-center ${genotypeClass(cell?.genotype_code)}`}>{cell?.genotype_code || cell?.fragment_size || "-"}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <Empty text="暂无指纹矩阵数据" />}
        </div>
      )}

      {activeTab === "germplasm" && (
        <Table headers={["品种", "种质编号", "类型", "采集地点", "采集年份", "提供机构", "分子数据", "测序数据"]}>
          {germplasm.map((row) => (
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

      {activeTab === "sequencing" && (
        <Table headers={["品种", "登录号", "类型", "平台", "深度", "SNP", "INDEL", "公共数据库", "链接"]}>
          {sequencing.map((row) => (
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

