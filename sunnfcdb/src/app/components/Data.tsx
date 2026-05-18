import { Download, Search, Database, FileText, Dna } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchDownloadFiles } from "../../apis/data_apis";

export function Data() {
  const [datasetsFiles, setDatasetsFiles] = useState<any[]>([]);
  const { t } = useTranslation();
  
  useEffect(() => {
    fetchDownloadFiles()
      .then((data: any[]) => {
        setDatasetsFiles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch sunflower download files:", err);
        setDatasetsFiles([]);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-yellow-400 p-8 text-white shadow-xl shadow-amber-100">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100">Sunflower data catalogue</p>
        <h1 className="text-4xl font-bold mb-4">{t("data.title")}</h1>
        <p className="max-w-3xl text-lg text-amber-50">
          {t("data.subtitle")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <Search className="h-5 w-5 text-amber-500 mr-3" />
          <input
            type="text"
            placeholder={t("data.search")}
            className="flex-1 outline-none text-gray-700"
          />
          <button className="rounded-xl bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600">
            {t("data.search")}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-amber-100 bg-white p-5 text-center shadow-sm">
          <Database className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <div className="text-2xl font-bold">6</div>
          <div className="text-sm text-gray-600">{t("data.stats.datasets")}</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-5 text-center shadow-sm">
          <FileText className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <div className="text-2xl font-bold">7.2 TB</div>
          <div className="text-sm text-gray-600">{t("data.stats.totalSize")}</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-5 text-center shadow-sm">
          <Download className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <div className="text-2xl font-bold">41K+</div>
          <div className="text-sm text-gray-600">{t("data.stats.downloads")}</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-5 text-center shadow-sm">
          <Dna className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <div className="text-2xl font-bold">52,232</div>
          <div className="text-sm text-gray-600">{t("data.stats.genes")}</div>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold mb-4">{t("data.availableDatasets")}</h2>
        {datasetsFiles.map((dataset, index) => (
          <div
            key={index}
            className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{dataset.title || dataset.file_name || "Untitled dataset"}</h3>
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {dataset.version || "v1.0"}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {dataset.format || dataset.file_type || "file"}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {dataset.size || dataset.file_size || "-"}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{dataset.description || "No description available."}</p>
                <div className="text-sm text-gray-500">
                  {dataset.downloads || 0} {t("data.stats.downloads")}
                </div>
              </div>
              <a href={dataset.id ? `/api/download/files/${dataset.id}/download/` : "#"} target="_blank" rel="noopener noreferrer" download className="ml-4 flex items-center rounded-xl bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600">
                <Download className="h-4 w-4 mr-2" />
                {t("data.download")}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Data Access Notice */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">{t("data.notice.title")}</h3>
        <p className="text-blue-800">
          {t("data.notice.content")}
        </p>
      </div>
    </div>
  );
}
