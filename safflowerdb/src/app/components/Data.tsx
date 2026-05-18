import { Download, Search, Database, FileText, Dna } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchSafflowerDownloadFiles } from "../../apis/data_apis";

export function Data() {
  const { t } = useTranslation();
  const [datasetsFiles, setDatasetsFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchSafflowerDownloadFiles()
      .then((data: any[]) => {
        setDatasetsFiles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch safflower download files:", err);
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
    <div className="space-y-6 bg-white font-mono">
      {/* Header */}
      <div className="border-l-8 border-red-600 bg-red-50 p-6 ring-1 ring-red-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Safflower Resource Ledger</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("data.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("data.subtitle")}</p>
      </div>

      {/* Search Bar */}
      <div className="border border-red-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-red-600" />
          <input
            type="text"
            placeholder={t("data.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-none border-b-4 border-red-500 bg-red-50 p-4">
          <Database className="mb-2 h-6 w-6 text-red-600" />
          <div className="text-2xl font-bold text-gray-900">{datasetsFiles.length}</div>
          <div className="text-xs text-gray-500">{t("data.stats.datasets")}</div>
        </div>
        <div className="rounded-none border-b-4 border-red-200 bg-white p-4 ring-1 ring-red-100">
          <FileText className="mb-2 h-6 w-6 text-red-600" />
          <div className="text-2xl font-bold text-gray-900">2.4 TB</div>
          <div className="text-xs text-gray-500">{t("data.stats.totalSize")}</div>
        </div>
        <div className="rounded-none border-b-4 border-red-200 bg-white p-4 ring-1 ring-red-100">
          <Download className="mb-2 h-6 w-6 text-red-600" />
          <div className="text-2xl font-bold text-gray-900">15K+</div>
          <div className="text-xs text-gray-500">{t("data.stats.downloads")}</div>
        </div>
        <div className="rounded-none border-b-4 border-red-200 bg-white p-4 ring-1 ring-red-100">
          <Dna className="mb-2 h-6 w-6 text-red-600" />
          <div className="text-2xl font-bold text-gray-900">35,232</div>
          <div className="text-xs text-gray-500">{t("data.stats.genes")}</div>
        </div>
      </div>

      {/* Datasets */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("data.availableDatasets")}</h2>
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl">
            <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{t("data.noData")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((dataset, index) => (
              <div
                key={index}
                className="border border-red-100 bg-white p-4 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-2">{dataset.file_name || dataset.title || "Untitled dataset"}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded">
                        {dataset.version || "v1.0"}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs">
                        {dataset.file_type || dataset.format || "file"}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs">
                        {dataset.file_size || dataset.size || "-"}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs">
                        {dataset.category || "general"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{dataset.description || "No description available."}</p>
                  </div>
                  <a href={dataset.download_url || "#"} target="_blank" rel="noopener noreferrer" className="ml-4 bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700">
                    {t("data.download")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="border border-red-100 bg-red-50 p-4">
        <h3 className="font-medium text-red-800 mb-1">{t("data.notice.title")}</h3>
        <p className="text-sm text-red-700">
          {t("data.notice.content")}
        </p>
      </div>
    </div>
  );
}
