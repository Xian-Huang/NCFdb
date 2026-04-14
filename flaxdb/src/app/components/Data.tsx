import { Download, Search, Database, FileText, Dna } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchFlaxDownloadFiles } from "../../apis/data_apis";

export function Data() {
  const { t } = useTranslation();
  const [datasetsFiles, setDatasetsFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchFlaxDownloadFiles().then((data: any[]) => {
      setDatasetsFiles(data);
    });
  }, []);

  const filteredFiles = datasetsFiles.filter(f => 
    f.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("data.title")}</h1>
        <p className="text-gray-500">{t("data.subtitle")}</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-gray-400" />
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Database className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">{datasetsFiles.length}</div>
          <div className="text-xs text-gray-500">{t("data.stats.datasets")}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <FileText className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">2.4 TB</div>
          <div className="text-xs text-gray-500">{t("data.stats.totalSize")}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Download className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">15K+</div>
          <div className="text-xs text-gray-500">{t("data.stats.downloads")}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Dna className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">35,232</div>
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
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-2">{dataset.file_name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {dataset.version || "v1.0"}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {dataset.file_type}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
                        {dataset.file_size}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">
                        {dataset.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{dataset.description}</p>
                  </div>
                  <a href={dataset.download_url} target="_blank" rel="noopener noreferrer" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    {t("data.download")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-800 mb-1">{t("data.notice.title")}</h3>
        <p className="text-sm text-blue-700">
          {t("data.notice.content")}
        </p>
      </div>
    </div>
  );
}
