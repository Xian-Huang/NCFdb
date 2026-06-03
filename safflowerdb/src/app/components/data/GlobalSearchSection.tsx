import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Dna, Leaf, MapPin, Search } from "lucide-react";
import { cropConfig } from "../../cropConfig";
import { fetchSafflowerGlobalSearch } from "../../../apis/data_apis";
import { asArray, displayText } from "./shared";

const groups = [
  { key: "varieties", title: "品种", icon: Leaf, anchor: "#hplc-database" },
  { key: "genes", title: "基因", icon: Dna, anchor: "#research-analysis" },
  { key: "regions", title: "区域", icon: MapPin, anchor: "#research-analysis" },
];

export function GlobalSearchSection() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({ varieties: [], genes: [], regions: [], nutrition: [] });
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => groups.reduce((sum, group) => sum + asArray(results[group.key]).length, 0), [results]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextQuery = input.trim();
    if (!nextQuery) return;
    setQuery(nextQuery);
    setLoading(true);
    fetchSafflowerGlobalSearch(nextQuery)
      .then(setResults)
      .catch(() => setResults({ varieties: [], genes: [], regions: [], nutrition: [] }))
      .finally(() => setLoading(false));
  };

  const primaryText = (groupKey: string, row: any) => {
    if (groupKey === "genes") return displayText(row.gene_id);
    return displayText(row.name || row.sample_code);
  };

  const secondaryText = (groupKey: string, row: any) => {
    if (groupKey === "genes") return displayText(row.name || row.function || row.pathway, "基因功能待补充");
    if (groupKey === "regions") return displayText([row.code, row.country, row.climate].filter(Boolean).join(" · "), "区域信息待补充");
    return displayText([row.variety_code, row.seed_color, row.region_name].filter(Boolean).join(" · "), "品种信息待补充");
  };

  return (
    <section id="global-search" className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: cropConfig.accent }}>
            <Search className="h-4 w-4" />
            Global search
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">全局搜索</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">搜索品种、基因和区域记录，并从结果跳转到相关数据模块继续分析。</p>
          <form onSubmit={submit} className="mt-5 flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none" placeholder="输入品种、基因 ID、区域名称..." />
            <button className="rounded-xl px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: cropConfig.accent }}>
              搜索
            </button>
          </form>
          {query && <div className="mt-3 text-xs text-slate-500">{loading ? "正在搜索..." : `关键词 "${query}" 找到 ${total} 条结果`}</div>}
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {groups.map((group) => {
            const Icon = group.icon;
            const rows = asArray(results[group.key]);
            return (
              <div key={group.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Icon className="h-4 w-4" style={{ color: cropConfig.accent }} />
                    {group.title}
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">{rows.length}</span>
                </div>
                <div className="space-y-2">
                  {rows.slice(0, 5).map((row) => (
                    <a key={`${group.key}-${row.id}`} href={group.anchor} className="block rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-950">{primaryText(group.key, row)}</div>
                          <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{secondaryText(group.key, row)}</div>
                        </div>
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                      </div>
                    </a>
                  ))}
                  {query && !rows.length && !loading && <div className="rounded-xl bg-white p-4 text-center text-xs text-slate-500">无匹配记录</div>}
                  {!query && <div className="rounded-xl bg-white p-4 text-center text-xs text-slate-500">输入关键词后显示结果</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


