import { Download, Search, Database, FileText, Dna } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchFlaxDownloadFiles } from "../../apis/data_apis";

export function Data() {
  const { t } = useTranslation();
  const [datasetsFiles, setDatasetsFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchFlaxDownloadFiles()
      .then((data: any[]) => {
        setDatasetsFiles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch flax download files:", err);
        setDatasetsFiles([]);
      });
  }, []);

  const filteredFiles = datasetsFiles.filter((f) => {
    const fileName = String(f?.file_name ?? f?.title ?? "");
    const category = String(f?.category ?? "");
    const keyword = searchTerm.toLowerCase();
    return fileName.toLowerCase().includes(keyword) || category.toLowerCase().includes(keyword);
  });

  return (
    <div className="space-y-6 rounded-[1.75rem] border border-blue-100 bg-[#f6f9ff] p-6">
      {/* Header */}
      <div className="border-b border-blue-100 pb-6 text-slate-950">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Flax Omics Repository</p>
            <h1 className="mt-2 text-3xl font-bold">{t("data.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("data.subtitle")}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.16em] text-blue-700">Workspace status</div>
            <div className="mt-2 text-2xl font-bold">{datasetsFiles.length} datasets indexed</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-blue-600" />
          <input
            type="text"
            placeholder={t("data.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <Database className="mb-3 h-6 w-6 text-blue-600" />
          <div className="text-2xl font-bold text-slate-950">{datasetsFiles.length}</div>
          <div className="text-xs text-slate-500">{t("data.stats.datasets")}</div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <FileText className="mb-3 h-6 w-6 text-blue-600" />
          <div className="text-2xl font-bold text-slate-950">2.4 TB</div>
          <div className="text-xs text-slate-500">{t("data.stats.totalSize")}</div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <Download className="mb-3 h-6 w-6 text-blue-600" />
          <div className="text-2xl font-bold text-slate-950">15K+</div>
          <div className="text-xs text-slate-500">{t("data.stats.downloads")}</div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <Dna className="mb-3 h-6 w-6 text-blue-600" />
          <div className="text-2xl font-bold text-slate-950">35,232</div>
          <div className="text-xs text-slate-500">{t("data.stats.genes")}</div>
        </div>
      </div>

      {/* Datasets */}
      <div>
        <h2 className="text-lg font-semibold text-slate-950 mb-4">{t("data.availableDatasets")}</h2>
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
            <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{t("data.noData")}</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredFiles.map((dataset, index) => (
              <div
                key={index}
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300"
              >
                <div className="flex h-full flex-col justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-950 mb-2">{dataset.file_name || dataset.title || "Untitled dataset"}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {dataset.version || "v1.0"}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {dataset.file_type || dataset.format || "file"}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
                        {dataset.file_size || dataset.size || "-"}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">
                        {dataset.category || "general"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{dataset.description || "No description available."}</p>
                  </div>
                  <a href={dataset.download_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
                    {t("data.download")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <h3 className="font-medium text-blue-800 mb-1">{t("data.notice.title")}</h3>
        <p className="text-sm text-blue-700">
          {t("data.notice.content")}
        </p>
      </div>
    </div>
  );
}
