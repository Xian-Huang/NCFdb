import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { 
  User, Plus, Edit, Trash2, X, Shield, LogOut,
  FileText, MapPin, Leaf, Dna, Building, Bell,
  Search, RefreshCw, Download, Beaker
} from "lucide-react";
import {
  fetchFlaxNews,
  fetchFlaxChangelogs,
  fetchFlaxRegions,
  fetchFlaxVarieties,
  fetchFlaxGenes,
  fetchFlaxGeneExpressions,
  createFlaxGeneExpression,
  updateFlaxGeneExpression,
  deleteFlaxGeneExpression,
  fetchFlaxEnvironmentalFactors,
  createFlaxEnvironmentalFactor,
  updateFlaxEnvironmentalFactor,
  deleteFlaxEnvironmentalFactor,
  fetchFlaxInstitutions,
  fetchFlaxAnnouncements,
  fetchFlaxDownloadFiles,
  createFlaxNews,
  updateFlaxNews,
  deleteFlaxNews,
  createFlaxChangelog,
  updateFlaxChangelog,
  deleteFlaxChangelog,
  createFlaxRegion,
  updateFlaxRegion,
  deleteFlaxRegion,
  createFlaxVariety,
  updateFlaxVariety,
  deleteFlaxVariety,
  createFlaxGene,
  updateFlaxGene,
  deleteFlaxGene,
  createFlaxInstitution,
  updateFlaxInstitution,
  deleteFlaxInstitution,
  createFlaxAnnouncement,
  updateFlaxAnnouncement,
  deleteFlaxAnnouncement,
  createFlaxDownloadFile,
  updateFlaxDownloadFile,
  deleteFlaxDownloadFile,
  fetchFlaxNutritionData,
  createFlaxNutritionData,
  updateFlaxNutritionData,
  deleteFlaxNutritionData,
  fetchFlaxRegionalMapSites,
  createFlaxRegionalMapSite,
  updateFlaxRegionalMapSite,
  deleteFlaxRegionalMapSite,
  fetchFlaxRegionalEnvironmentValues,
  createFlaxRegionalEnvironmentValue,
  updateFlaxRegionalEnvironmentValue,
  deleteFlaxRegionalEnvironmentValue,
} from "../../apis/data_apis";

type DataType = "news" | "changelog" | "regions" | "varieties" | "genes" | "gene_expressions" | "environmental_factors" | "regional_map_sites" | "regional_environment_values" | "institutions" | "announcements" | "downloads" | "nutrition_data";

const NEWS_CONTENT_MIN_WORDS = 600;
const countEnglishWords = (value: unknown) => String(value ?? "").match(/\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b/g)?.length ?? 0;
const countParagraphs = (value: unknown) => String(value ?? "").trim().split(/\r?\n\s*\r?\n/).filter(Boolean).length;
const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};
const getTotalCount = (value: any, fallback = 0) => {
  if (typeof value?.count === "number") return value.count;
  if (typeof value?.total === "number") return value.total;
  return fallback;
};

interface NewsData {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  views: number;
  is_published: boolean;
  publish_time: string;
}

interface ChangelogData {
  id: number;
  version: string;
  title: string;
  release_date: string;
  is_published: boolean;
}

interface RegionData {
  id: number;
  name: string;
  code: string;
  country: string;
  climate: string;
}

interface VarietyData {
  id: number;
  name: string;
  variety_code: string;
  region: number | null;
  region_name?: string;
  seed_color: string;
  oil_content: number;
  maturity_days: number;
}

interface GeneData {
  id: number;
  gene_id: string;
  name: string;
  symbol: string;
  chromosome: string;
  gene_type: string;
  pathway: string;
}

interface InstitutionData {
  id: number;
  name: string;
  abbreviation: string;
  country: string;
  city: string;
  website: string;
  email: string;
  institution_type: string;
}

interface NutritionData {
  id: number;
  sample_code: string;
  variety: number | null;
  variety_name?: string;
  region_name?: string;
  oil_content: number | null;
  protein: number | null;
  fatty_acid: number | null;
  lignan: number | null;
  method: string;
  test_date: string;
}

interface AnnouncementData {
  id: number;
  title: string;
  content: string;
  announcement_type: string;
  author: string;
  importance: string;
  is_published: boolean;
  publish_date: string;
}

const dataTypeConfig: Record<DataType, { title: string; icon: React.ElementType; fetchFn: (params?: any) => Promise<any>; createFn: (data: any) => Promise<any>; updateFn: (id: number, data: any) => Promise<any>; deleteFn: (id: number) => Promise<any> }> = {
  news: { 
    title: "News", 
    icon: FileText, 
    fetchFn: fetchFlaxNews,
    createFn: createFlaxNews,
    updateFn: updateFlaxNews,
    deleteFn: deleteFlaxNews,
  },
  changelog: { 
    title: "Updates", 
    icon: RefreshCw, 
    fetchFn: fetchFlaxChangelogs,
    createFn: createFlaxChangelog,
    updateFn: updateFlaxChangelog,
    deleteFn: deleteFlaxChangelog,
  },
  regions: { 
    title: "Regions", 
    icon: MapPin, 
    fetchFn: fetchFlaxRegions,
    createFn: createFlaxRegion,
    updateFn: updateFlaxRegion,
    deleteFn: deleteFlaxRegion,
  },
  varieties: { 
    title: "Varieties", 
    icon: Leaf, 
    fetchFn: fetchFlaxVarieties,
    createFn: createFlaxVariety,
    updateFn: updateFlaxVariety,
    deleteFn: deleteFlaxVariety,
  },
  genes: { 
    title: "Genes", 
    icon: Dna, 
    fetchFn: fetchFlaxGenes,
    createFn: createFlaxGene,
    updateFn: updateFlaxGene,
    deleteFn: deleteFlaxGene,
  },
  gene_expressions: { 
    title: "Gene Expressions", 
    icon: Dna, 
    fetchFn: fetchFlaxGeneExpressions,
    createFn: createFlaxGeneExpression,
    updateFn: updateFlaxGeneExpression,
    deleteFn: deleteFlaxGeneExpression,
  },
  environmental_factors: { 
    title: "Environmental Factors", 
    icon: Beaker, 
    fetchFn: fetchFlaxEnvironmentalFactors,
    createFn: createFlaxEnvironmentalFactor,
    updateFn: updateFlaxEnvironmentalFactor,
    deleteFn: deleteFlaxEnvironmentalFactor,
  },
  regional_map_sites: {
    title: "Regional Map Sites",
    icon: MapPin,
    fetchFn: fetchFlaxRegionalMapSites,
    createFn: createFlaxRegionalMapSite,
    updateFn: updateFlaxRegionalMapSite,
    deleteFn: deleteFlaxRegionalMapSite,
  },
  regional_environment_values: {
    title: "Regional Environment Values",
    icon: Beaker,
    fetchFn: fetchFlaxRegionalEnvironmentValues,
    createFn: createFlaxRegionalEnvironmentValue,
    updateFn: updateFlaxRegionalEnvironmentValue,
    deleteFn: deleteFlaxRegionalEnvironmentValue,
  },
  institutions: { 
    title: "Institutions", 
    icon: Building, 
    fetchFn: fetchFlaxInstitutions,
    createFn: createFlaxInstitution,
    updateFn: updateFlaxInstitution,
    deleteFn: deleteFlaxInstitution,
  },
  announcements: { 
    title: "Announcements", 
    icon: Bell, 
    fetchFn: fetchFlaxAnnouncements,
    createFn: createFlaxAnnouncement,
    updateFn: updateFlaxAnnouncement,
    deleteFn: deleteFlaxAnnouncement,
  },
  nutrition_data: {
    title: "Nutrition Data",
    icon: Beaker,
    fetchFn: fetchFlaxNutritionData,
    createFn: createFlaxNutritionData,
    updateFn: updateFlaxNutritionData,
    deleteFn: deleteFlaxNutritionData,
  },
  downloads: { 
    title: "Downloads", 
    icon: Download, 
    fetchFn: fetchFlaxDownloadFiles,
    createFn: createFlaxDownloadFile,
    updateFn: updateFlaxDownloadFile,
    deleteFn: deleteFlaxDownloadFile,
  },
};

export function Admin() {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState<DataType>("news");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const typeTitle = (type: string) => t(`admin.types.${type}`);
  const column = (key: string) => t(`admin.columns.${key}`);
  const statusText = (key: string) => t(`admin.status.${key}`);

  useEffect(() => {
    fetchData();
  }, [activeType, currentPage, pageSize, searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchTerm.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const handleTypeChange = (type: DataType) => {
    if (type === activeType) return;
    setActiveType(type);
    setCurrentPage(1);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await dataTypeConfig[activeType].fetchFn({ page: currentPage, pageSize, search: searchQuery });
      const rows = toArray(result);
      setData(rows);
      setTotalCount(getTotalCount(result, rows.length));
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData(getEmptyForm());
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const getEmptyForm = () => {
    switch (activeType) {
      case "news":
        return { title: "", content: "", author: "", category: "", image: "", tags: "", is_published: true };
      case "nutrition_data":
        return { variety: null, sample_code: "", oil_content: null, protein: null, fatty_acid: null, lignan: null, moisture: null, method: "HPLC/NIR", test_date: "" };
      case "changelog":
        return { version: "", title: "", content: "", changes: [], release_date: "", is_published: true };
      case "regions":
        return { name: "", code: "", country: "", climate: "", description: "" };
      case "varieties":
        return { name: "", variety_code: "", region: null, seed_color: "", oil_content: 0, maturity_days: 0, yield_per_hectare: 0, height: 0, description: "" };
      case "genes":
        return { gene_id: "", name: "", symbol: "", chromosome: "", start_position: 0, end_position: 0, strand: "", gene_type: "", description: "", function: "", pathway: "" };
      case "gene_expressions":
        return { gene: null, variety: null, tissue: "", stage: "", expression_value: 0, fpkm: 0, tpm: 0, sample_id: "" };
      case "environmental_factors":
        return { name: "", code: "", unit: "", category: "", description: "", min_value: 0, max_value: 0 };
      case "regional_map_sites":
        return { region: null, name: "", code: "", province: "", longitude: null, latitude: null, varieties: [], trait: "", component: "", soil: "", display_order: 0, is_active: true, description: "" };
      case "regional_environment_values":
        return { site: null, factor: null, value_min: null, value_max: null, display_value: "", note: "" };
      case "institutions":
        return { name: "", abbreviation: "", country: "", city: "", address: "", website: "", email: "", phone: "", contact_person: "", description: "", institution_type: "" };
      case "announcements":
        return { title: "", content: "", announcement_type: "", author: "", institution: null, importance: "normal", is_published: true, publish_date: "" };
      case "downloads":
        return { file_name: "", file_type: "", file_size: "", description: "", download_url: "", category: "", version: "", is_published: true };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === "news") {
      const wordCount = countEnglishWords(formData.content);
      if (wordCount < NEWS_CONTENT_MIN_WORDS || countParagraphs(formData.content) < 2) {
        alert(`News content requires at least ${NEWS_CONTENT_MIN_WORDS} English words and multiple paragraphs. Current count: ${wordCount}.`);
        return;
      }
    }
    const config = dataTypeConfig[activeType];
    const submitData = { ...formData };
    ["region_name", "region_code", "variety_names", "site_name", "factor_name", "factor_code", "factor_unit", "factor_category", "environment_values"].forEach((key) => delete submitData[key]);
    if (typeof submitData.varieties === "string") {
      submitData.varieties = submitData.varieties.split(",").map((id: string) => Number(id.trim())).filter(Boolean);
    }
    try {
      if (editingItem) {
        await config.updateFn(editingItem.id, submitData);
      } else {
        await config.createFn(submitData);
      }
      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await dataTypeConfig[activeType].deleteFn(id);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const filteredData = toArray(data);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const renderPagination = () => (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-gray-600">
      <div>
        第 {currentPage} / {totalPages} 页，共 {totalCount} 条
      </div>
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => {
            setCurrentPage(1);
            setPageSize(Number(e.target.value));
          }}
          className="rounded border border-gray-300 px-2 py-1"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>{size} / 页</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage <= 1 || loading}
          className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          上一页
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage >= totalPages || loading}
          className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );

  const renderTable = () => {
    switch (activeType) {
      case "news":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("title")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("author")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("category")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("status")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as NewsData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
                  </td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "regions":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("code")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("country")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("climate")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as RegionData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.climate}</td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "varieties":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("code")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("region")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("oilContent")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("maturityDays")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as VarietyData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.variety_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.region_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.oil_content}%</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.maturity_days} 天</td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "genes":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("geneId")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("symbol")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("chromosome")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("type")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as GeneData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.gene_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.symbol}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.chromosome}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.gene_type}</td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "institutions":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("abbreviation")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("country")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("city")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("type")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as InstitutionData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.abbreviation}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.institution_type}</td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "announcements":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("title")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("type")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("author")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("importance")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("status")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as AnnouncementData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.announcement_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.importance === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.importance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
                  </td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "nutrition_data":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("sample")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("variety")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("oil")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("protein")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("method")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as NutritionData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.sample_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.variety_name || item.variety || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.oil_content ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.protein ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.method}</td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "regional_map_sites":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("region")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("province")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("representativeVarieties")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("coordinate")}</th>
              <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}<div className="text-xs text-gray-400">{item.code}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.region_name || item.region || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.province}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Array.isArray(item.variety_names) && item.variety_names.length ? item.variety_names.join("、") : "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.longitude}, {item.latitude}</td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap"><button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "regional_environment_values":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("site")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("factor")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("range")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("display_value")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("note")}</th>
              <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.site_name || item.site || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.factor_name || item.factor || "-"}<div className="text-xs text-gray-400">{item.factor_code || ""}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.value_min ?? "-"} - {item.value_max ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.display_value || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.note || "-"}</td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap"><button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "changelog":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("version")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("title")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("releaseDate")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("status")}</th>
                <th className="w-28 min-w-28 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as ChangelogData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.version}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.release_date}</td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
                  </td>
                  <td className="w-28 min-w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <p className="text-gray-500">{t("admin.noData")}</p>;
    }
  };

  const renderForm = () => {
    const getFieldLabel = (key: string) => t(`admin.columns.${key}`, { defaultValue: key.replace(/_/g, " ") });
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).filter(k => k !== 'id' && k !== 'create_time' && k !== 'update_time').map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getFieldLabel(key)}
            </label>
            {key === 'content' || key === 'description' ? (
              <div>
                <textarea
                  value={formData[key] || ''}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  rows={activeType === 'news' && key === 'content' ? 14 : 4}
                />
                {activeType === 'news' && key === 'content' && (
                  <p className="mt-1 text-xs text-gray-500">{t("admin.validation.wordsRequired", { count: countEnglishWords(formData[key]), min: NEWS_CONTENT_MIN_WORDS })}</p>
                )}
              </div>
            ) : key === 'is_active' || key === 'is_published' ? (
              <input
                type="checkbox"
                checked={formData[key] || false}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="h-4 w-4 text-blue-500"
              />
            ) : key === 'region' || key === 'institution' || key === 'gene' || key === 'variety' ? (
              <input
                type="number"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type="text"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">{t("admin.cancel")}</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            {editingItem ? t("admin.saveChanges") : t("admin.add")}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex-shrink-0 flex flex-col h-screen absolute">
        <div className="p-4 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">FlaxDB</h1>
              <p className="text-xs text-blue-200">{t("admin.panel")}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {Object.entries(dataTypeConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => handleTypeChange(key as DataType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeType === key
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                {typeTitle(key)}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-500/30">
          <div className="text-sm text-blue-200 mb-2">{t("admin.welcome", { name: currentUser?.username || statusText("admin") })}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 w-full">
            <LogOut className="h-4 w-4" /> {t("admin.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 ml-64">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">{t("admin.management", { type: typeTitle(activeType) })}</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("admin.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="h-5 w-5" /> {t("admin.addType", { type: typeTitle(activeType) })}
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
            ) : filteredData.length === 0 ? (
              <div className="p-8 text-center text-gray-500">{t("admin.noData")}</div>
            ) : (
              <>
                {renderTable()}
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">
                {editingItem ? t("admin.editRecord") : t("admin.addRecord")}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">{renderForm()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
