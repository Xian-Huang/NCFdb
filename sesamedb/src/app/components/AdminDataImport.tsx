import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { batchCreateSesameRecords } from "../../apis/data_apis";
import { cropConfig } from "../cropConfig";

type ImportEntity = {
  key: string;
  label: string;
  fields: string[];
  sample: Record<string, string>;
};

const entities: ImportEntity[] = [
  { key: "regions", label: "区域", fields: ["name", "code", "country", "climate", "description"], sample: { name: "襄阳", code: "XY", country: "中国", climate: "亚热带季风", description: "芝麻优势产区" } },
  { key: "varieties", label: "品种", fields: ["name", "variety_code", "region", "seed_color", "oil_content"], sample: { name: "豫芝11号", variety_code: "YZ11", region: "1", seed_color: "白色", oil_content: "57.50" } },
  { key: "nutrition-data", label: "营养数据", fields: ["variety", "sample_code", "oil_content", "protein", "fatty_acid", "lignan", "moisture", "method", "test_date"], sample: { variety: "1", sample_code: "S2026-001", oil_content: "57.50", protein: "22.10", fatty_acid: "41.30", lignan: "12.300", moisture: "6.20", method: "HPLC", test_date: "2026-05-01" } },
  { key: "genes", label: "基因", fields: ["gene_id", "name", "symbol", "chromosome", "start_position", "end_position", "function", "pathway"], sample: { gene_id: "SINPZ1100015", name: "Oil biosynthesis candidate", symbol: "SiDGAT1", chromosome: "Chr11", start_position: "120000", end_position: "124800", function: "脂质合成", pathway: "oil biosynthesis" } },
  { key: "gene-associations", label: "基因关联", fields: ["source_gene", "target_gene", "target_trait", "association_type", "confidence_score", "p_value", "evidence_source"], sample: { source_gene: "1", target_gene: "", target_trait: "含油量", association_type: "trait", confidence_score: "0.8500", p_value: "0.000012", evidence_source: "GWAS" } },
  { key: "marker-loci", label: "标记位点", fields: ["marker_id", "marker_name", "marker_type", "chromosome", "position", "associated_trait", "pic"], sample: { marker_id: "SSR001", marker_name: "SiSSR001", marker_type: "SSR", chromosome: "Chr1", position: "123456", associated_trait: "木酚素含量", pic: "0.650" } },
  { key: "molecular-fingerprints", label: "分子指纹", fields: ["variety", "marker", "genotype_code", "allele1", "allele2", "fragment_size", "quality_score"], sample: { variety: "1", marker: "SSR001", genotype_code: "AA", allele1: "200", allele2: "200", fragment_size: "200bp", quality_score: "95" } },
  { key: "germplasm-resources", label: "种质资源", fields: ["variety", "germplasm_number", "germplasm_type", "collection_site", "collection_year", "donor_institution", "has_molecular_data", "has_sequencing_data"], sample: { variety: "1", germplasm_number: "CN-SI-001", germplasm_type: "cultivar", collection_site: "河南", collection_year: "2024", donor_institution: "农业科学院", has_molecular_data: "true", has_sequencing_data: "false" } },
  { key: "sequencing-data", label: "测序数据", fields: ["variety", "accession_number", "data_type", "platform", "coverage", "reference_genome", "snp_count", "indel_count", "public_database", "data_url"], sample: { variety: "1", accession_number: "SRR000001", data_type: "WGS", platform: "Illumina NovaSeq", coverage: "30", reference_genome: "Si_v2.0", snp_count: "120000", indel_count: "32000", public_database: "NCBI SRA", data_url: "https://example.com" } },
  { key: "genetic-diversity-analyses", label: "遗传多样性", fields: ["analysis_name", "analysis_type", "marker_type", "marker_count", "variety_count", "result_image_url", "description", "analysis_date"], sample: { analysis_name: "芝麻SSR遗传多样性分析", analysis_type: "PCA", marker_type: "SSR", marker_count: "48", variety_count: "127", result_image_url: "https://example.com/pca.png", description: "PCA 分析结果", analysis_date: "2026-05-01" } },
];

export function AdminDataImport() {
  const [entityKey, setEntityKey] = useState(entities[0].key);
  const [csvText, setCsvText] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const entity = entities.find((item) => item.key === entityKey) || entities[0];

  const template = useMemo(() => {
    const header = entity.fields.join(",");
    const row = entity.fields.map((field) => entity.sample[field] ?? "").join(",");
    return `${header}\n${row}`;
  }, [entity]);

  const rows = useMemo(() => parseCsv(csvText), [csvText]);

  const importRows = async () => {
    setMessage("");
    if (!rows.length) {
      setMessage("没有可导入的数据。");
      return;
    }
    setBusy(true);
    try {
      const result = await batchCreateSesameRecords(entity.key, rows);
      setMessage(result.created ? `导入完成：${result.created} 条。` : `导入失败：${JSON.stringify(result.errors || result.error)}`);
    } catch (error: any) {
      setMessage(`导入失败：${error.message || error}`);
    } finally {
      setBusy(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob(["\uFEFF" + template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${entity.key}_template.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: cropConfig.accent }}>
              <Upload className="h-4 w-4" />
              Batch import
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">批量导入</h1>
            <p className="mt-2 text-sm text-slate-600">本地免登录导入入口，支持 CSV 表头映射到后端 batchCreate 接口。</p>
          </div>
          <a href="/admin-local/molecular-data" className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">分子数据管理</a>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <label className="text-sm font-medium text-slate-700">
              导入类型
              <select value={entityKey} onChange={(event) => { setEntityKey(event.target.value); setCsvText(""); setMessage(""); }} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                {entities.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileSpreadsheet className="h-4 w-4" style={{ color: cropConfig.accent }} />
                模板字段
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {entity.fields.map((field) => <span key={field} className="rounded-full bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-100">{field}</span>)}
              </div>
              <button onClick={downloadTemplate} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                下载 CSV 模板
              </button>
            </div>
          </aside>

          <main className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-950">{entity.label} CSV</h2>
              <button onClick={() => setCsvText(template)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">填入示例</button>
            </div>
            <textarea value={csvText} onChange={(event) => setCsvText(event.target.value)} className="h-72 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs outline-none focus:bg-white" placeholder={template} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-500">已解析 {rows.length} 条记录</div>
              <button onClick={importRows} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: cropConfig.accent }}>
                {busy ? "导入中..." : "开始导入"}
              </button>
            </div>
            {message && <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</div>}
            {rows.length > 0 && <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(rows.slice(0, 5), null, 2)}</pre>}
          </main>
        </div>
      </div>
    </div>
  );
}

function parseCsv(value: string) {
  const lines = value.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitLine(lines[0]).map((item) => item.trim());
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    return headers.reduce<Record<string, any>>((row, header, index) => {
      const raw = (cells[index] ?? "").trim();
      if (raw === "") return row;
      if (raw === "true" || raw === "false") row[header] = raw === "true";
      else if (/^-?\d+(\.\d+)?$/.test(raw)) row[header] = Number(raw);
      else row[header] = raw;
      return row;
    }, {});
  }).filter((row) => Object.keys(row).length);
}

function splitLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

