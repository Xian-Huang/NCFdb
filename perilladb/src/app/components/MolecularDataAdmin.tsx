import { FormEvent, useEffect, useMemo, useState } from "react";
import { Database, Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import {
  createPerillaGeneticDiversityAnalysis,
  createPerillaGermplasmResource,
  createPerillaMarkerLocus,
  createPerillaMolecularFingerprint,
  createPerillaSequencingData,
  deletePerillaGeneticDiversityAnalysis,
  deletePerillaMarkerLocus,
  deletePerillaMolecularFingerprint,
  deletePerillaSequencingData,
  fetchPerillaGeneticDiversityAnalyses,
  fetchPerillaGermplasmResources,
  fetchPerillaMarkerLoci,
  fetchPerillaMolecularFingerprints,
  fetchPerillaSequencingData,
  updatePerillaGeneticDiversityAnalysis,
  updatePerillaGermplasmResource,
  updatePerillaMarkerLocus,
  updatePerillaMolecularFingerprint,
  updatePerillaSequencingData,
} from "../../apis/data_apis";
import { cropConfig } from "../cropConfig";
import { asArray, displayText } from "./data/shared";

type Schema = {
  key: string;
  title: string;
  fetch: () => Promise<any>;
  create: (data: any) => Promise<any>;
  update?: (id: number, data: any) => Promise<any>;
  delete?: (id: number) => Promise<any>;
  fields: string[];
  required: string[];
  columns: string[];
  defaults?: Record<string, any>;
  selects?: Record<string, string[]>;
};

const schemas: Schema[] = [
  {
    key: "markers",
    title: "标记位点",
    fetch: () => fetchPerillaMarkerLoci({ limit: 500 }),
    create: createPerillaMarkerLocus,
    update: updatePerillaMarkerLocus,
    delete: deletePerillaMarkerLocus,
    fields: ["marker_id", "marker_name", "marker_type", "chromosome", "position", "forward_primer", "reverse_primer", "expected_size", "reference_allele", "alternate_allele", "annotated_gene", "associated_trait", "polymorphism_rate", "pic", "notes"],
    required: ["marker_id", "marker_type"],
    columns: ["marker_id", "marker_name", "marker_type", "chromosome", "position", "associated_trait", "pic"],
    defaults: { marker_type: "SSR" },
    selects: { marker_type: ["SSR", "SNP", "INDEL", "KASP", "EST-SSR", "gSSR"] },
  },
  {
    key: "fingerprints",
    title: "分子指纹",
    fetch: () => fetchPerillaMolecularFingerprints({ limit: 500 }),
    create: createPerillaMolecularFingerprint,
    update: updatePerillaMolecularFingerprint,
    delete: deletePerillaMolecularFingerprint,
    fields: ["variety", "marker", "genotype_code", "allele1", "allele2", "fragment_size", "quality_score", "notes"],
    required: ["variety", "marker"],
    columns: ["variety_name", "marker_id", "genotype_code", "allele1", "allele2", "fragment_size", "quality_score"],
  },
  {
    key: "germplasm",
    title: "种质资源",
    fetch: () => fetchPerillaGermplasmResources({ limit: 500 }),
    create: createPerillaGermplasmResource,
    update: updatePerillaGermplasmResource,
    fields: ["variety", "germplasm_number", "germplasm_type", "collection_site", "collection_year", "donor_institution", "ploidy", "genome_size", "chromosome_number", "plant_height", "branch_number", "capsule_number", "seeds_per_capsule", "thousand_seed_weight", "seed_coat_color", "flower_color", "stem_color", "disease_resistance", "drought_resistance", "fingerprint_profile", "has_molecular_data", "has_sequencing_data", "notes"],
    required: ["variety"],
    columns: ["variety_name", "germplasm_number", "germplasm_type", "collection_site", "collection_year", "has_molecular_data", "has_sequencing_data"],
    defaults: { germplasm_type: "cultivar", drought_resistance: "unknown", has_molecular_data: false, has_sequencing_data: false },
    selects: { germplasm_type: ["cultivar", "landrace", "wild_species", "breeding_line", "mutant"], drought_resistance: ["high", "medium", "low", "unknown"] },
  },
  {
    key: "sequencing",
    title: "测序数据",
    fetch: () => fetchPerillaSequencingData({ limit: 500 }),
    create: createPerillaSequencingData,
    update: updatePerillaSequencingData,
    delete: deletePerillaSequencingData,
    fields: ["variety", "accession_number", "data_type", "platform", "read_length", "coverage", "total_reads", "raw_data_size", "clean_data_size", "mapping_rate", "reference_genome", "snp_count", "indel_count", "data_url", "public_database", "submission_date", "notes"],
    required: ["variety", "data_type"],
    columns: ["variety_name", "accession_number", "data_type", "platform", "coverage", "snp_count", "public_database"],
    defaults: { data_type: "WGS" },
    selects: { data_type: ["WGS", "RNA-seq", "WGBS", "ChIP-seq", "RAD-seq", "GBS"] },
  },
  {
    key: "diversity",
    title: "遗传多样性",
    fetch: () => fetchPerillaGeneticDiversityAnalyses({ limit: 500 }),
    create: createPerillaGeneticDiversityAnalysis,
    update: updatePerillaGeneticDiversityAnalysis,
    delete: deletePerillaGeneticDiversityAnalysis,
    fields: ["analysis_name", "analysis_type", "marker_type", "marker_count", "variety_count", "result_data", "result_image_url", "description", "analysis_date"],
    required: ["analysis_name", "analysis_type"],
    columns: ["analysis_name", "analysis_type", "marker_type", "marker_count", "variety_count", "analysis_date"],
    defaults: { analysis_type: "PCA" },
    selects: { analysis_type: ["PCA", "clustering", "phylogenetic", "structure", "AMOVA", "kinship"] },
  },
];

export function MolecularDataAdmin() {
  const [activeKey, setActiveKey] = useState(schemas[0].key);
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, any>>({});
  const [editing, setEditing] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const schema = schemas.find((item) => item.key === activeKey) || schemas[0];

  const emptyForm = useMemo(() => schema.defaults || {}, [schema]);

  const loadRows = () => {
    setLoading(true);
    schema.fetch()
      .then((data) => setRows(asArray(data)))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setEditing(null);
    setForm(emptyForm);
    setMessage("");
    loadRows();
  }, [activeKey]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const missing = schema.required.filter((field) => form[field] === undefined || form[field] === null || String(form[field]).trim() === "");
    if (missing.length) {
      setMessage(`请填写必填字段：${missing.join(", ")}`);
      return;
    }
    const payload = normalizePayload(form);
    try {
      if (editing && schema.update) await schema.update(editing.id, payload);
      else await schema.create(payload);
      setForm(emptyForm);
      setEditing(null);
      setMessage("保存成功。");
      loadRows();
    } catch (error: any) {
      setMessage(`保存失败：${error.message || error}`);
    }
  };

  const remove = async (row: any) => {
    if (!schema.delete || !window.confirm("确定删除这条记录吗？")) return;
    await schema.delete(row.id);
    loadRows();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: cropConfig.accent }}>
                <Database className="h-4 w-4" />
                Molecular admin
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950">分子指纹数据管理</h1>
              <p className="mt-2 text-sm text-slate-600">管理标记位点、品种指纹、种质资源、测序记录和多样性分析。</p>
            </div>
            <div className="flex gap-2">
              <a href="/admin-local/import" className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">批量导入</a>
              <a href="/data#molecular-fingerprint" className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">查看前台</a>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {schemas.map((item) => (
            <button key={item.key} onClick={() => setActiveKey(item.key)} className={`rounded-xl px-4 py-2 text-sm font-medium ${activeKey === item.key ? "text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`} style={activeKey === item.key ? { backgroundColor: cropConfig.accent } : undefined}>
              {item.title}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-950">{editing ? "编辑记录" : `新增${schema.title}`}</h2>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} className="text-sm text-slate-500 hover:text-slate-900">取消编辑</button>}
            </div>
            <div className="grid gap-3">
              {schema.fields.map((field) => (
                <label key={field} className="text-xs font-medium text-slate-600">
                  {field}{schema.required.includes(field) ? " *" : ""}
                  {schema.selects?.[field] ? (
                    <select value={form[field] ?? ""} onChange={(event) => setForm((value) => ({ ...value, [field]: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                      <option value="">请选择</option>
                      {schema.selects[field].map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : typeof emptyForm[field] === "boolean" || field.startsWith("has_") ? (
                    <div className="mt-2">
                      <input type="checkbox" checked={!!form[field]} onChange={(event) => setForm((value) => ({ ...value, [field]: event.target.checked }))} />
                    </div>
                  ) : field.includes("notes") || field.includes("description") || field.includes("primer") || field.includes("data") || field.includes("profile") ? (
                    <textarea value={form[field] ?? ""} onChange={(event) => setForm((value) => ({ ...value, [field]: event.target.value }))} className="mt-1 h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
                  ) : (
                    <input value={form[field] ?? ""} onChange={(event) => setForm((value) => ({ ...value, [field]: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
                  )}
                </label>
              ))}
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: cropConfig.accent }}>
              <Plus className="h-4 w-4" />
              {editing ? "保存修改" : "创建"}
            </button>
            {message && <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{message}</div>}
          </form>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-950">{schema.title}列表</h2>
              <button onClick={loadRows} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <RefreshCw className="h-4 w-4" />
                刷新
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    {schema.columns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      {schema.columns.map((column) => <td key={column} className="px-4 py-3 text-slate-600">{displayText(row[column])}</td>)}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {schema.update && <button onClick={() => { setEditing(row); setForm(pickForm(row, schema.fields)); }} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Edit className="h-4 w-4" /></button>}
                          {schema.delete && <button onClick={() => remove(row)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <div className="py-8 text-center text-sm text-slate-500">加载中...</div>}
              {!loading && !rows.length && <div className="py-8 text-center text-sm text-slate-500">暂无数据</div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function normalizePayload(form: Record<string, any>) {
  const payload: Record<string, any> = {};
  Object.entries(form).forEach(([key, value]) => {
    if (["id", "create_time", "update_time"].includes(key)) return;
    if (value === "" || value === null || value === undefined) return;
    if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) payload[key] = Number(value);
    else payload[key] = value;
  });
  return payload;
}

function pickForm(row: Record<string, any>, fields: string[]) {
  return fields.reduce<Record<string, any>>((next, field) => {
    next[field] = row[field] ?? "";
    return next;
  }, {});
}

