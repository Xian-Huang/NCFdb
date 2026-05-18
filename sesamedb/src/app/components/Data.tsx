import { Download, Search, Database, FileText, Dna } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchSesameDownloadFiles } from "../../apis/data_apis";

export function Data() {
  const { t } = useTranslation();
  const [datasetsFiles, setDatasetsFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchSesameDownloadFiles()
      .then((data: any[]) => {
        setDatasetsFiles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch sesame download files:", err);
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
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="border-b border-green-100 pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Sesame Data Archive</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("data.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("data.subtitle")}</p>
          </div>
          <div className="bg-green-50 px-5 py-3 text-sm text-green-800">
            Curated sesame germplasm and nutrition files
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border border-green-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-green-600" />
          <input
            type="text"
            placeholder={t("data.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-green-100 bg-green-100 lg:grid-cols-4">
        <div className="bg-white p-4">
          <Database className="mb-3 h-6 w-6 text-green-600" />
          <div className="text-2xl font-bold text-gray-900">{datasetsFiles.length}</div>
          <div className="text-xs text-gray-500">{t("data.stats.datasets")}</div>
        </div>
        <div className="bg-white p-4">
          <FileText className="mb-3 h-6 w-6 text-green-600" />
          <div className="text-2xl font-bold text-gray-900">2.4 TB</div>
          <div className="text-xs text-gray-500">{t("data.stats.totalSize")}</div>
        </div>
        <div className="bg-white p-4">
          <Download className="mb-3 h-6 w-6 text-green-600" />
          <div className="text-2xl font-bold text-gray-900">15K+</div>
          <div className="text-xs text-gray-500">{t("data.stats.downloads")}</div>
        </div>
        <div className="bg-white p-4">
          <Dna className="mb-3 h-6 w-6 text-green-600" />
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
          <div className="overflow-hidden border border-green-100 bg-white">
            <div className="hidden bg-green-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-green-800 md:grid md:grid-cols-[1fr_220px_120px]">
              <span>Dataset</span>
              <span className="hidden md:block">Metadata</span>
              <span className="text-right">Access</span>
            </div>
            {filteredFiles.map((dataset, index) => (
              <div
                key={index}
                className={`grid gap-4 p-4 transition-colors hover:bg-green-50/70 md:grid-cols-[1fr_220px_120px] md:items-center ${index !== filteredFiles.length - 1 ? "border-b border-green-100" : ""}`}
              >
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">{dataset.file_name || dataset.title || "Untitled dataset"}</h3>
                    <p className="text-sm text-gray-500 mt-2">{dataset.description || "No description available."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
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
                  <a href={dataset.download_url || "#"} target="_blank" rel="noopener noreferrer" className="justify-self-start bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700 md:justify-self-end">
                    {t("data.download")}
                  </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="border border-green-100 bg-green-50 p-4">
        <h3 className="font-medium text-green-800 mb-1">{t("data.notice.title")}</h3>
        <p className="text-sm text-green-700">
          {t("data.notice.content")}
        </p>
      </div>
    </div>
  );
}
