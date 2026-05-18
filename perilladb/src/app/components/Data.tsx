import { Download, Search, Database, FileText, Dna } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchPerillaDownloadFiles } from "../../apis/data_apis";

export function Data() {
  const { t } = useTranslation();
  const [datasetsFiles, setDatasetsFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchPerillaDownloadFiles()
      .then((data: any[]) => {
        setDatasetsFiles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch perilla download files:", err);
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
      <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">Perilla Compound Catalogue</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("data.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("data.subtitle")}</p>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-3xl rounded-full border border-purple-100 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="ml-2 h-5 w-5 text-purple-600" />
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
        <div className="rounded-full bg-purple-600 p-5 text-center text-white shadow-sm">
          <Database className="mx-auto mb-2 h-6 w-6 text-purple-100" />
          <div className="text-2xl font-bold">{datasetsFiles.length}</div>
          <div className="text-xs text-purple-100">{t("data.stats.datasets")}</div>
        </div>
        <div className="rounded-full border border-purple-100 bg-white p-5 text-center shadow-sm">
          <FileText className="mx-auto mb-2 h-6 w-6 text-purple-500" />
          <div className="text-2xl font-bold text-gray-800">2.4 TB</div>
          <div className="text-xs text-gray-500">{t("data.stats.totalSize")}</div>
        </div>
        <div className="rounded-full border border-purple-100 bg-white p-5 text-center shadow-sm">
          <Download className="mx-auto mb-2 h-6 w-6 text-purple-500" />
          <div className="text-2xl font-bold text-gray-800">15K+</div>
          <div className="text-xs text-gray-500">{t("data.stats.downloads")}</div>
        </div>
        <div className="rounded-full border border-purple-100 bg-white p-5 text-center shadow-sm">
          <Dna className="mx-auto mb-2 h-6 w-6 text-purple-500" />
          <div className="text-2xl font-bold text-gray-800">35,232</div>
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
          <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
            {filteredFiles.map((dataset, index) => (
              <div
                key={index}
                className="mb-4 break-inside-avoid rounded-[1.75rem] border border-purple-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-full flex-col justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-2">{dataset.file_name || dataset.title || "Untitled dataset"}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
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
                    <p className="text-sm text-gray-500 mt-2">{dataset.description || "No description available."}</p>
                  </div>
                  <a href={dataset.download_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit rounded-full bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700">
                    {t("data.download")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="rounded-[1.5rem] border border-purple-100 bg-purple-50 p-4">
        <h3 className="font-medium text-purple-800 mb-1">{t("data.notice.title")}</h3>
        <p className="text-sm text-purple-700">
          {t("data.notice.content")}
        </p>
      </div>
    </div>
  );
}
