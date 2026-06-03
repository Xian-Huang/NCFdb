import { useEffect, useMemo, useState } from "react";
import { Download, Filter, FlaskConical } from "lucide-react";
import { cropConfig } from "../../cropConfig";
import { fetchSafflowerNutritionData, fetchSafflowerRegions, fetchSafflowerVarieties } from "../../../apis/data_apis";
import { asArray, displayText, downloadCsv, numberOrZero } from "./shared";

export function HplcDatabaseSection() {
  const [rows, setRows] = useState<any[]>([]);
  const [statRows, setStatRows] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ variety: "", region: "", min_oil: "", max_oil: "" });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    Promise.all([
      fetchSafflowerRegions({ limit: 500 }),
      fetchSafflowerVarieties({ limit: 500 }),
    ]).then(([regionData, varietyData]) => {
      setRegions(asArray(regionData));
      setVarieties(asArray(varietyData));
    }).catch(() => {
      setRegions([]);
      setVarieties([]);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchSafflowerNutritionData({ page, pageSize, ...filters })
      .then((data) => {
        setRows(asArray(data));
        setTotal(Number(data?.count ?? asArray(data).length));
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
    fetchSafflowerNutritionData({ limit: 5000, ...filters })
      .then((data) => {
        const allRows = asArray(data);
        setStatRows(allRows);
        setTotal((current) => Number(data?.count ?? current ?? allRows.length));
      })
      .catch(() => setStatRows([]));
  }, [filters]);

  const stats = useMemo(() => {
    const sourceRows = statRows.length ? statRows : rows;
    const oilRows = sourceRows.filter((row) => row.oil_content !== null && row.oil_content !== undefined);
    const lignanRows = sourceRows.filter((row) => row.lignan !== null && row.lignan !== undefined);
    const avg = (items: any[], key: string) => items.length
      ? items.reduce((sum, row) => sum + numberOrZero(row[key]), 0) / items.length
      : 0;
    return {
      total: total || sourceRows.length,
      avgOil: avg(oilRows, "oil_content").toFixed(2),
      avgLignan: avg(lignanRows, "lignan").toFixed(3),
      maxOil: oilRows.length ? Math.max(...oilRows.map((row) => numberOrZero(row.oil_content))).toFixed(2) : "0.00",
    };
  }, [rows, statRows, total]);

  const exportRows = () => {
    const sourceRows = statRows.length ? statRows : rows;
    downloadCsv(
      `HPLC_nutrition_${new Date().toISOString().slice(0, 10)}.csv`,
      ["样品编号", "品种", "区域", "含油量(%)", "木酚素", "蛋白质(%)", "脂肪酸(%)", "水分(%)", "方法", "检测日期"],
      sourceRows.map((row) => [
        row.sample_code,
        row.variety_name,
        row.region_name,
        row.oil_content,
        row.lignan,
        row.protein,
        row.fatty_acid,
        row.moisture,
        row.method,
        row.test_date,
      ]),
    );
  };

  return (
    <section id="hplc-database" className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: cropConfig.accent }}>
            <FlaskConical className="h-4 w-4" />
            HPLC database
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">HPLC 营养成分库</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">按品种、区域和含油率范围筛选营养检测记录，快速查看平均含油量、木酚素水平和最高含油率。</p>
        </div>
        <button onClick={exportRows} className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>
          <Download className="h-4 w-4" />
          导出 CSV
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {[
          ["样本总数", stats.total],
          ["平均含油量", `${stats.avgOil}%`],
          ["平均木酚素", stats.avgLignan],
          ["最高含油量", `${stats.maxOil}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="text-xs font-medium text-slate-500">{label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_0.8fr_0.8fr]">
        <label className="text-xs font-medium text-slate-600">
          品种
          <select value={filters.variety} onChange={(event) => setFilters((value) => ({ ...value, variety: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
            <option value="">全部品种</option>
            {varieties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-600">
          区域
          <select value={filters.region} onChange={(event) => setFilters((value) => ({ ...value, region: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
            <option value="">全部区域</option>
            {regions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-600">
          最低含油量
          <input value={filters.min_oil} onChange={(event) => setFilters((value) => ({ ...value, min_oil: event.target.value }))} type="number" step="0.01" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" placeholder="%" />
        </label>
        <label className="text-xs font-medium text-slate-600">
          最高含油量
          <input value={filters.max_oil} onChange={(event) => setFilters((value) => ({ ...value, max_oil: event.target.value }))} type="number" step="0.01" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" placeholder="%" />
        </label>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {["样品", "品种", "区域", "含油量", "木酚素", "蛋白质", "脂肪酸", "检测方法"].map((header) => <th key={header} className="px-4 py-3">{header}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{displayText(row.sample_code)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(row.variety_name)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(row.region_name)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(row.oil_content)}%</td>
                <td className="px-4 py-3 text-slate-600">{displayText(row.lignan)}</td>
                <td className="px-4 py-3 text-slate-600">{displayText(row.protein)}%</td>
                <td className="px-4 py-3 text-slate-600">{displayText(row.fatty_acid)}%</td>
                <td className="px-4 py-3 text-slate-600">{displayText(row.method, "HPLC/NIR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !rows.length && <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500"><Filter className="h-4 w-4" />暂无符合条件的数据</div>}
        {loading && <div className="py-10 text-center text-sm text-slate-500">正在加载 HPLC 数据...</div>}
      </div>
      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span>第 {page} / {Math.max(1, Math.ceil((total || rows.length) / pageSize))} 页，共 {total || rows.length} 条数据库记录</span>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-xl border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">上一页</button>
          <button disabled={page >= Math.max(1, Math.ceil((total || rows.length) / pageSize)) || loading} onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">下一页</button>
        </div>
      </div>
    </section>
  );
}

