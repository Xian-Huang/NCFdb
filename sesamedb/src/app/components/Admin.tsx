import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  User, Plus, Edit, Trash2, X, Shield, LogOut,
  FileText, MapPin, Leaf, Dna, Building, Bell,
  Search, RefreshCw, Download, Beaker
} from "lucide-react";
import {
  fetchSesameNews,
  fetchSesameChangelogs,
  fetchSesameRegions,
  fetchSesameVarieties,
  fetchSesameGenes,
  fetchSesameGeneExpressions,
  fetchSesameEnvironmentalFactors,
  fetchSesameInstitutions,
  fetchSesameAnnouncements,
  fetchSesameDownloadFiles,
  createSesameNews,
  updateSesameNews,
  deleteSesameNews,
  createSesameChangelog,
  updateSesameChangelog,
  deleteSesameChangelog,
  createSesameRegion,
  updateSesameRegion,
  deleteSesameRegion,
  createSesameVariety,
  updateSesameVariety,
  deleteSesameVariety,
  createSesameGene,
  updateSesameGene,
  deleteSesameGene,
  createSesameGeneExpression,
  updateSesameGeneExpression,
  deleteSesameGeneExpression,
  createSesameEnvironmentalFactor,
  updateSesameEnvironmentalFactor,
  deleteSesameEnvironmentalFactor,
  createSesameInstitution,
  updateSesameInstitution,
  deleteSesameInstitution,
  createSesameAnnouncement,
  updateSesameAnnouncement,
  deleteSesameAnnouncement,
  createSesameDownloadFile,
  updateSesameDownloadFile,
  deleteSesameDownloadFile,
  fetchSesameNutritionData,
  createSesameNutritionData,
  updateSesameNutritionData,
  deleteSesameNutritionData,
  fetchSesameRegionalMapSites,
  createSesameRegionalMapSite,
  updateSesameRegionalMapSite,
  deleteSesameRegionalMapSite,
  fetchSesameRegionalEnvironmentValues,
  createSesameRegionalEnvironmentValue,
  updateSesameRegionalEnvironmentValue,
  deleteSesameRegionalEnvironmentValue,
} from "../../apis/data_apis";

type DataType = "news" | "changelog" | "regions" | "varieties" | "genes" | "gene_expressions" | "environmental_factors" | "regional_map_sites" | "regional_environment_values" | "institutions" | "announcements" | "downloads" | "nutrition_data";

const NEWS_CONTENT_MIN_WORDS = 600;
const countEnglishWords = (value: unknown) => String(value ?? "").match(/\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b/g)?.length ?? 0;
const countParagraphs = (value: unknown) => String(value ?? "").trim().split(/\r?\n\s*\r?\n/).filter(Boolean).length;

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
  oil_content: number | null;
  maturity_days: number | null;
  yield_per_hectare: number | null;
  height: number | null;
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
  institution: number | null;
  importance: string;
  attachment_url: string;
  is_published: boolean;
  publish_date: string;
  expire_date: string;
}

const dataTypeConfig: Record<DataType, { title: string; icon: React.ElementType; fetchFn: () => Promise<any[]>; createFn: (data: any) => Promise<any>; updateFn: (id: number, data: any) => Promise<any>; deleteFn: (id: number) => Promise<any> }> = {
  news: { 
    title: "News", 
    icon: FileText, 
    fetchFn: fetchSesameNews,
    createFn: createSesameNews,
    updateFn: updateSesameNews,
    deleteFn: deleteSesameNews,
  },
  changelog: { 
    title: "Updates", 
    icon: RefreshCw, 
    fetchFn: fetchSesameChangelogs,
    createFn: createSesameChangelog,
    updateFn: updateSesameChangelog,
    deleteFn: deleteSesameChangelog,
  },
  regions: { 
    title: "Regions", 
    icon: MapPin, 
    fetchFn: fetchSesameRegions,
    createFn: createSesameRegion,
    updateFn: updateSesameRegion,
    deleteFn: deleteSesameRegion,
  },
  varieties: { 
    title: "Varieties", 
    icon: Leaf, 
    fetchFn: fetchSesameVarieties,
    createFn: createSesameVariety,
    updateFn: updateSesameVariety,
    deleteFn: deleteSesameVariety,
  },
  genes: { 
    title: "Genes", 
    icon: Dna, 
    fetchFn: fetchSesameGenes,
    createFn: createSesameGene,
    updateFn: updateSesameGene,
    deleteFn: deleteSesameGene,
  },
  gene_expressions: {
    title: "Gene Expressions",
    icon: Dna,
    fetchFn: fetchSesameGeneExpressions,
    createFn: createSesameGeneExpression,
    updateFn: updateSesameGeneExpression,
    deleteFn: deleteSesameGeneExpression,
  },
  environmental_factors: {
    title: "Environmental Factors",
    icon: Beaker,
    fetchFn: fetchSesameEnvironmentalFactors,
    createFn: createSesameEnvironmentalFactor,
    updateFn: updateSesameEnvironmentalFactor,
    deleteFn: deleteSesameEnvironmentalFactor,
  },
  regional_map_sites: {
    title: "Regional Map Sites",
    icon: MapPin,
    fetchFn: fetchSesameRegionalMapSites,
    createFn: createSesameRegionalMapSite,
    updateFn: updateSesameRegionalMapSite,
    deleteFn: deleteSesameRegionalMapSite,
  },
  regional_environment_values: {
    title: "Regional Environment Values",
    icon: Beaker,
    fetchFn: fetchSesameRegionalEnvironmentValues,
    createFn: createSesameRegionalEnvironmentValue,
    updateFn: updateSesameRegionalEnvironmentValue,
    deleteFn: deleteSesameRegionalEnvironmentValue,
  },
  institutions: { 
    title: "Institutions", 
    icon: Building, 
    fetchFn: fetchSesameInstitutions,
    createFn: createSesameInstitution,
    updateFn: updateSesameInstitution,
    deleteFn: deleteSesameInstitution,
  },
  announcements: { 
    title: "Announcements", 
    icon: Bell, 
    fetchFn: fetchSesameAnnouncements,
    createFn: createSesameAnnouncement,
    updateFn: updateSesameAnnouncement,
    deleteFn: deleteSesameAnnouncement,
  },
  nutrition_data: {
    title: "Nutrition Data",
    icon: Beaker,
    fetchFn: fetchSesameNutritionData,
    createFn: createSesameNutritionData,
    updateFn: updateSesameNutritionData,
    deleteFn: deleteSesameNutritionData,
  },
  downloads: { 
    title: "Downloads", 
    icon: Download, 
    fetchFn: fetchSesameDownloadFiles,
    createFn: createSesameDownloadFile,
    updateFn: updateSesameDownloadFile,
    deleteFn: deleteSesameDownloadFile,
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
  // Foreign key data
  const [regions, setRegions] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [genes, setGenes] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const typeTitle = (type: string) => t(`admin.types.${type}`);
  const column = (key: string) => t(`admin.columns.${key}`);
  const statusText = (key: string) => t(`admin.status.${key}`);

  useEffect(() => {
    fetchData();
    fetchForeignKeyData();
  }, [activeType]);

  const fetchForeignKeyData = async () => {
    try {
      const [regionsData, varietiesData, genesData, institutionsData] = await Promise.all([
        fetchSesameRegions(),
        fetchSesameVarieties(),
        fetchSesameGenes(),
        fetchSesameInstitutions(),
      ]);
      setRegions(regionsData);
      setVarieties(varietiesData);
      setGenes(genesData);
      setInstitutions(institutionsData);
    } catch (err) {
      console.error("Failed to fetch foreign key data:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await dataTypeConfig[activeType].fetchFn();
      setData(result);
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
        return { title: "", content: "", author: "", category: "", image: "", tags: "", views: 0, is_published: true, publish_time: "" };
      case "nutrition_data":
        return { variety: null, sample_code: "", oil_content: null, protein: null, fatty_acid: null, lignan: null, moisture: null, method: "HPLC/NIR", test_date: "" };
      case "changelog":
        return { version: "", title: "", content: "", changes: [], release_date: "", is_published: true };
      case "regions":
        return { name: "", code: "", country: "", climate: "", description: "" };
      case "varieties":
        return { name: "", variety_code: "", region: null, seed_color: "", oil_content: null, maturity_days: null, yield_per_hectare: null, height: null, description: "" };
      case "genes":
        return { gene_id: "", name: "", symbol: "", chromosome: "", start_position: null, end_position: null, strand: "", gene_type: "", description: "", function: "", pathway: "" };
      case "gene_expressions":
        return { gene: null, variety: null, tissue: "", stage: "", expression_value: null, fpkm: null, tpm: null, sample_id: "" };
      case "environmental_factors":
        return { name: "", code: "", unit: "", category: "", description: "", min_value: null, max_value: null };
      case "regional_map_sites":
        return { region: null, name: "", code: "", province: "", longitude: null, latitude: null, varieties: [], trait: "", component: "", soil: "", display_order: 0, is_active: true, description: "" };
      case "regional_environment_values":
        return { site: null, factor: null, value_min: null, value_max: null, display_value: "", note: "" };
      case "institutions":
        return { name: "", abbreviation: "", country: "", city: "", address: "", website: "", email: "", phone: "", contact_person: "", description: "", institution_type: "" };
      case "announcements":
        return { title: "", content: "", announcement_type: "", author: "", institution: null, importance: "normal", attachment_url: "", views: 0, is_published: true, publish_date: "", expire_date: "" };
      case "downloads":
        return { file_name: "", file_type: "", file_size: "", description: "", download_url: "", category: "", version: "", is_published: true };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data based on data type
    const errors: string[] = [];

    // Common validation for all types
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      // Validate max length for string fields
      if (typeof value === 'string' && value.length > 0) {
        const maxLengths: Record<string, number> = {
          gene_id: 50, name: 200, symbol: 50, chromosome: 20, strand: 10,
          gene_type: 50, pathway: 200, tissue: 100, stage: 100, sample_id: 100,
          unit: 50, version: 50, file_name: 200, file_type: 50, file_size: 50,
          climate: 100, seed_color: 50, title: 200, author: 100, phone: 50,
          contact_person: 100, abbreviation: 50, country: 100, city: 100,
          announcement_type: 50, code: 50, variety_code: 50, description: 500,
          category: 50, tags: 200, content: 10000, importance: 20, address: 500
        };
        if (maxLengths[key] && value.length > maxLengths[key]) {
          errors.push(`${key.replace(/_/g, ' ')} exceeds maximum length of ${maxLengths[key]} characters`);
        }
      }

      // Validate numeric ranges
      if (typeof value === 'number' || (!isNaN(parseFloat(value)) && value !== '')) {
        const numValue = parseFloat(value);
        
        // Decimal(10,4) fields: 0-999999.9999
        if (['expression_value', 'fpkm', 'tpm', 'min_value', 'max_value', 'protein', 'fatty_acid', 'lignan', 'moisture'].includes(key)) {
          if (numValue < 0 || numValue > 999999.9999) {
            errors.push(`${key.replace(/_/g, ' ')} must be between 0 and 999999.9999`);
          }
        }
        
        // Decimal(5,2) fields: 0-999.99
        if (key === 'oil_content') {
          if (numValue < 0 || numValue > 999.99) {
            errors.push(`${key.replace(/_/g, ' ')} must be between 0 and 999.99`);
          }
        }
        
        // Decimal(6,2) fields: 0-9999.99
        if (key === 'height') {
          if (numValue < 0 || numValue > 9999.99) {
            errors.push(`${key.replace(/_/g, ' ')} must be between 0 and 9999.99`);
          }
        }
        
        // Decimal(10,2) fields: 0-99999999.99
        if (key === 'yield_per_hectare') {
          if (numValue < 0 || numValue > 99999999.99) {
            errors.push(`${key.replace(/_/g, ' ')} must be between 0 and 99999999.99`);
          }
        }
        
        // Integer fields
        if (key === 'maturity_days') {
          if (numValue < -2147483648 || numValue > 2147483647) {
            errors.push(`${key.replace(/_/g, ' ')} must be between -2,147,483,648 and 2,147,483,647`);
          }
        }
        
        // BigInteger fields
        if (['start_position', 'end_position'].includes(key)) {
          if (numValue < 0 || numValue > 9223372036854775807) {
            errors.push(`${key.replace(/_/g, ' ')} must be between 0 and 9,223,372,036,854,775,807`);
          }
        }
      }

      // Validate email format
      if (key === 'email' && value && value.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push('Please enter a valid email address');
        }
      }

      // Validate URL format
      if ((key.includes('_url') || key === 'website') && value && value.length > 0) {
        try {
          new URL(value);
        } catch {
          errors.push('Please enter a valid URL (e.g., https://example.com)');
        }
      }
    });

    // Type-specific required field validation
    const requiredFields: Record<string, string[]> = {
      news: ['title'],
      changelog: ['version', 'title', 'release_date'],
      regions: ['name', 'code', 'country'],
      varieties: ['name', 'variety_code'],
      genes: ['gene_id', 'name'],
      gene_expressions: ['gene', 'variety', 'tissue', 'expression_value'],
      nutrition_data: ['variety', 'sample_code'],
      environmental_factors: ['name', 'code', 'unit'],
      institutions: ['name', 'country'],
      announcements: ['title', 'content', 'announcement_type'],
      downloads: ['file_name', 'file_type', 'file_size', 'download_url', 'category']
    };

    if (requiredFields[activeType]) {
      requiredFields[activeType].forEach(field => {
        if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
          errors.push(`${field.replace(/_/g, ' ')} is required`);
        }
      });
    }

    if (activeType === 'news') {
      const wordCount = countEnglishWords(formData.content);
      if (wordCount < NEWS_CONTENT_MIN_WORDS) {
        errors.push(`content must contain at least ${NEWS_CONTENT_MIN_WORDS} English words (currently ${wordCount})`);
      }
      if (countParagraphs(formData.content) < 2) {
        errors.push('content must contain multiple paragraphs separated by a blank line');
      }
    }

    // Show validation errors
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    // Filter out null and empty string values before submitting
    const submitData = { ...formData };
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === null || submitData[key] === '') {
        delete submitData[key];
      }
    });

    const config = dataTypeConfig[activeType];
    try {
      if (editingItem) {
        // For editing, only include image if it's a File object (new image selected)
        if (activeType === 'news' && formData.image instanceof File) {
          await config.updateFn(editingItem.id, submitData);
        } else if (activeType === 'news' && editingItem.image) {
          // Keep existing image, don't send image field
          delete submitData.image;
          await config.updateFn(editingItem.id, submitData);
        } else {
          await config.updateFn(editingItem.id, submitData);
        }
      } else {
        await config.createFn(submitData);
      }
      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save: " + (err as Error).message);
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

  const filteredData = data.filter((item: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return Object.values(item).some((val: any) => 
      val && String(val).toLowerCase().includes(search)
    );
  });

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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as NewsData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as RegionData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.climate}</td>
                  <td className="px-6 py-4 text-right">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
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
                  <td className="px-6 py-4 text-right">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
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
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "gene_expressions":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("gene")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("variety")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("tissue")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("stage")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("expressionValue")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as any[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.gene}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.variety}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.tissue}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.stage || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.expression_value}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "environmental_factors":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("code")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("unit")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("category")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("minValue")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("maxValue")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as any[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.min_value ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.max_value ?? "-"}</td>
                  <td className="px-6 py-4 text-right">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
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
                  <td className="px-6 py-4 text-right">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
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
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
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
                  <td className="px-6 py-4 text-right">
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}<div className="text-xs text-gray-400">{item.code}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.region_name || item.region || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.province}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Array.isArray(item.variety_names) && item.variety_names.length ? item.variety_names.join("、") : "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.longitude}, {item.latitude}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button></td>
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.site_name || item.site || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.factor_name || item.factor || "-"}<div className="text-xs text-gray-400">{item.factor_code || ""}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.value_min ?? "-"} - {item.value_max ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.display_value || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.note || "-"}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button></td>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as ChangelogData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.version}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.release_date}</td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
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
    // Helper function to get placeholder with max length hint
    const getPlaceholder = (key: string, basePlaceholder: string, maxLength?: number) => {
      if (maxLength) {
        return `${basePlaceholder} (max ${maxLength} characters)`;
      }
      return basePlaceholder;
    };

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
                  placeholder={t("admin.placeholders.genericField", { field: getFieldLabel(key) })}
                />
                {activeType === 'news' && key === 'content' && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.wordsRequired", { count: countEnglishWords(formData[key]), min: NEWS_CONTENT_MIN_WORDS })}</p>
                )}
                {key === 'description' && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.maxChars", { count: 500 })}</p>
                )}
              </div>
            ) : key === 'is_active' || key === 'is_published' ? (
              <input
                type="checkbox"
                checked={formData[key] || false}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="h-4 w-4 text-orange-500"
              />
            ) : key === 'image' && activeType === 'news' ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, image: file });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                {editingItem && formData.image && typeof formData.image === 'string' && (
                  <div className="text-sm text-gray-600">
                    {t("admin.placeholders.currentImage", { name: formData.image.split('/').pop() })}
                  </div>
                )}
                {formData.image && typeof formData.image === 'object' && (
                  <div className="text-sm text-orange-600">
                    {t("admin.placeholders.selectedImage", { name: (formData.image as File).name })}
                  </div>
                )}
              </div>
            ) : key === 'category' && activeType === 'news' ? (
              <select
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">{t("admin.placeholders.selectCategory")}</option>
                <option value="research">{t("news.categories.research")}</option>
                <option value="breeding">{t("news.categories.breeding")}</option>
                <option value="events">{t("news.categories.events")}</option>
                <option value="publications">{t("news.categories.publications")}</option>
              </select>
            ) : key === 'tags' && activeType === 'news' ? (
              <input
                type="text"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={t("admin.placeholders.emailTags")}
              />
            ) : key === 'region' || key === 'institution' || key === 'gene' || key === 'variety' ? (
              <select
                value={formData[key] ?? ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">{t("admin.placeholders.selectRelation", { field: getFieldLabel(key) })}</option>
                {key === 'region' && regions && regions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} ({item.code})</option>
                ))}
                {key === 'variety' && varieties && varieties.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} ({item.variety_code})</option>
                ))}
                {key === 'gene' && genes && genes.map((item) => (
                  <option key={item.id} value={item.id}>{item.gene_id} - {item.name}</option>
                ))}
                {key === 'institution' && institutions && institutions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            ) : key === 'importance' ? (
              <select
                value={formData[key] || 'normal'}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="low">{t("admin.options.low")}</option>
                <option value="normal">{t("admin.options.normal")}</option>
                <option value="high">{t("admin.options.high")}</option>
              </select>
            ) : key === 'email' ? (
              <input
                type="email"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={t("admin.placeholders.email")}
              />
            ) : key.includes('_url') || key === 'website' ? (
              <input
                type="url"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={t("admin.placeholders.url")}
              />
            ) : key.includes('_date') ? (
              <input
                type="date"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            ) : key.includes('value') || key.includes('position') ? (
              <div>
                <input
                  type="number"
                  value={formData[key] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder={t("admin.placeholders.genericField", { field: getFieldLabel(key) })}
                />
                {key.includes('expression_value') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.decimalRange")}</p>
                )}
                {key.includes('fpkm') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.decimalRange")}</p>
                )}
                {key.includes('tpm') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.decimalRange")}</p>
                )}
                {key.includes('min_value') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.decimalRange")}</p>
                )}
                {key.includes('max_value') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.decimalRange")}</p>
                )}
                {key.includes('start_position') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.bigIntegerRange")}</p>
                )}
                {key.includes('end_position') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.bigIntegerRange")}</p>
                )}
              </div>
            ) : key.includes('days') ? (
              <div>
                <input
                  type="number"
                  value={formData[key] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder={t("admin.placeholders.genericField", { field: getFieldLabel(key) })}
                />
                {key.includes('maturity_days') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.integerDaysRange")}</p>
                )}
              </div>
            ) : key.includes('oil_content') || key.includes('height') || key.includes('yield') || key.includes('file_size') ? (
              <div>
                <input
                  type="number"
                  value={formData[key] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder={t("admin.placeholders.genericField", { field: getFieldLabel(key) })}
                />
                {key.includes('oil_content') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.percentRange")}</p>
                )}
                {key.includes('yield_per_hectare') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.yieldRange")}</p>
                )}
                {key.includes('height') && (
                  <p className="text-xs text-gray-500 mt-1">{t("admin.validation.heightRange")}</p>
                )}
              </div>
            ) : (
              <input
                type="text"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={t("admin.placeholders.genericField", { field: getFieldLabel(key) })}
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">{t("admin.cancel")}</button>
          <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            {editingItem ? t("admin.saveChanges") : t("admin.add")}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-orange-600 to-orange-900 text-white flex-shrink-0 flex flex-col h-screen absolute">
        <div className="p-4 border-b border-orange-500/30">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">SesameDB</h1>
              <p className="text-xs text-orange-200">{t("admin.panel")}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {Object.entries(dataTypeConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveType(key as DataType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeType === key
                    ? 'bg-white/20 text-white'
                    : 'text-orange-100 hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                {typeTitle(key)}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-orange-500/30">
          <div className="text-sm text-orange-200 mb-2">{t("admin.welcome", { name: currentUser?.username || statusText("admin") })}</div>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
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
              renderTable()
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
