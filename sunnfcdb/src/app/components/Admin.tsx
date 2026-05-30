import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  User, Plus, Edit, Trash2, X, Shield, LogOut,
  FileText, MapPin, Leaf, Dna, Building, Bell,
  Search, RefreshCw, Download, Beaker, Save, Loader2,
  AlertCircle, Image as ImageIcon, ChevronDown
} from "lucide-react";
import {
  fetchUsers, createUser, updateUser, deleteUser,
  fetchNews, createNews, updateNews, deleteNews,
  fetchChangelog, createChangelog, updateChangelog, deleteChangelog,
  fetchRegions, createRegion, updateRegion, deleteRegion,
  fetchVarieties, createVariety, updateVariety, deleteVariety,
  fetchGenes, createGene, updateGene, deleteGene,
  fetchGeneExpressions, createGeneExpression, updateGeneExpression, deleteGeneExpression,
  fetchEnvironmentalFactors, createEnvironmentalFactor, updateEnvironmentalFactor, deleteEnvironmentalFactor,
  fetchRegionalMapSites, createRegionalMapSite, updateRegionalMapSite, deleteRegionalMapSite,
  fetchRegionalEnvironmentValues, createRegionalEnvironmentValue, updateRegionalEnvironmentValue, deleteRegionalEnvironmentValue,
  fetchNutrition, createNutrition, updateNutrition, deleteNutrition,
  fetchInstitutions, createInstitution, updateInstitution, deleteInstitution,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  fetchDownloadFiles, createDownloadFile, updateDownloadFile, deleteDownloadFile,
  fetchSunflowerNutritionData,
  createSunflowerNutritionData,
  updateSunflowerNutritionData,
  deleteSunflowerNutritionData,
} from "../../apis/data_apis";
import { cropConfig } from "../cropConfig";

type DataType = "users" | "news" | "changelog" | "regions" | "varieties" | "genes" | "gene_expressions" | "environmental_factors" | "regional_map_sites" | "regional_environment_values" | "nutrition" | "institutions" | "announcements" | "downloads" | "nutrition_data";

const NEWS_CONTENT_MIN_WORDS = 600;
const countEnglishWords = (value: unknown) => String(value ?? "").match(/\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b/g)?.length ?? 0;
const countParagraphs = (value: unknown) => String(value ?? "").trim().split(/\r?\n\s*\r?\n/).filter(Boolean).length;
const readOnlyFormFields = new Set([
  "region_name", "region_code", "variety_name", "variety_names", "gene_name", "institution_name",
  "site_name", "factor_name", "factor_code", "factor_unit", "factor_category", "environment_values",
]);

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

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

interface AnnouncementData {
  id: number;
  title: string;
  content: string;
  announcement_type: string;
  author: string;
  institution: number | null;
  institution_name?: string;
  importance: string;
  is_published: boolean;
  publish_date: string;
}

interface GeneExpressionData {
  id: number;
  gene: number;
  gene_name?: string;
  variety: number;
  variety_name?: string;
  tissue: string;
  stage: string;
  expression_value: number;
  fpkm: number | null;
  tpm: number | null;
  sample_id: string;
}

interface EnvironmentalFactorData {
  id: number;
  name: string;
  code: string;
  unit: string;
  category: string;
  min_value: number | null;
  max_value: number | null;
}

interface NutritionData {
  id: number;
  name: string;
  desc: string;
}

interface DownloadFileData {
  id: number;
  title: string;
  description: string;
  size: number | null;
  format: string;
  version: string;
  downloads: number;
  file_url: string;
}

const dataTypeConfig: Record<DataType, { title: string; icon: React.ElementType; endpoint: string }> = {
  users: { title: "Users", icon: User, endpoint: "users/" },
  news: { title: "News", icon: FileText, endpoint: "news/" },
  changelog: { title: "Updates", icon: RefreshCw, endpoint: "changelog/" },
  regions: { title: "Regions", icon: MapPin, endpoint: "regions/" },
  varieties: { title: "Varieties", icon: Leaf, endpoint: "varieties/" },
  genes: { title: "Genes", icon: Dna, endpoint: "genes/" },
  gene_expressions: { title: "Gene Expressions", icon: Dna, endpoint: "gene-expressions/" },
  environmental_factors: { title: "Environmental Factors", icon: Beaker, endpoint: "environmental-factors/" },
  regional_map_sites: { title: "Regional Map Sites", icon: MapPin, endpoint: "regional-map-sites/" },
  regional_environment_values: { title: "Regional Environment Values", icon: Beaker, endpoint: "regional-environment-values/" },
  nutrition: { title: "Nutrition", icon: Beaker, endpoint: "nutrition/" },
  institutions: { title: "Institutions", icon: Building, endpoint: "institutions/" },
  announcements: { title: "Announcements", icon: Bell, endpoint: "announcements/" },
  nutrition_data: {
    title: "Nutrition Data",
    icon: Beaker,
    fetchFn: fetchSunflowerNutritionData,
    createFn: createSunflowerNutritionData,
    updateFn: updateSunflowerNutritionData,
    deleteFn: deleteSunflowerNutritionData,
  },
  downloads: { title: "Downloads", icon: Download, endpoint: "download/files/" },
};

export function Admin() {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState<DataType>("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // Foreign key options
  const [regions, setRegions] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [genes, setGenes] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [environmentalFactors, setEnvironmentalFactors] = useState<any[]>([]);
  const [regionalMapSites, setRegionalMapSites] = useState<any[]>([]);
  const navigate = useNavigate();
  const typeTitle = (type: string) => t(`admin.types.${type}`);
  const column = (key: string) => t(`admin.columns.${key}`);
  const statusText = (key: string) => t(`admin.status.${key}`);

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchData();
    fetchForeignKeyOptions();
  }, [activeType]);

  const fetchForeignKeyOptions = async () => {
    try {
      const [regionsData, varietiesData, genesData, institutionsData, factorsData, mapSitesData] = await Promise.all([
        fetchRegions(),
        fetchVarieties(),
        fetchGenes(),
        fetchInstitutions(),
        fetchEnvironmentalFactors(),
        fetchRegionalMapSites(),
      ]);
      setRegions(regionsData);
      setVarieties(varietiesData);
      setGenes(genesData);
      setInstitutions(institutionsData);
      setEnvironmentalFactors(factorsData);
      setRegionalMapSites(mapSitesData);
    } catch (error) {
      console.error("Failed to fetch foreign key options:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let result: any[] = [];
      switch (activeType) {
        case "users":
          result = await fetchUsers();
          break;
        case "news":
          result = await fetchNews();
          break;
        case "nutrition_data":
          result = await fetchSunflowerNutritionData();
          break;
        case "changelog":
          result = await fetchChangelog();
          break;
        case "regions":
          result = await fetchRegions();
          break;
        case "varieties":
          result = await fetchVarieties();
          break;
        case "genes":
          result = await fetchGenes();
          break;
        case "gene_expressions":
          result = await fetchGeneExpressions();
          break;
        case "environmental_factors":
          result = await fetchEnvironmentalFactors();
          break;
        case "regional_map_sites":
          result = await fetchRegionalMapSites();
          break;
        case "regional_environment_values":
          result = await fetchRegionalEnvironmentValues();
          break;
        case "nutrition":
          result = await fetchNutrition();
          break;
        case "institutions":
          result = await fetchInstitutions();
          break;
        case "announcements":
          result = await fetchAnnouncements();
          break;
        case "downloads":
          result = await fetchDownloadFiles();
          break;
      }
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
    setFormError("");
    setIsSubmitting(false);
    setShowModal(true);
  };

  const closeModal = (force = false) => {
    if (isSubmitting && !force) return;
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setFormError("");
  };

  const getEmptyForm = () => {
    switch (activeType) {
      case "users":
        return { username: "", email: "", password: "", first_name: "", last_name: "", is_active: true, is_staff: false };
      case "news":
        return { title: "", content: "", author: "", category: "", image: "", tags: "", is_published: true, is_scrolling: false };
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
      case "nutrition":
        return { name: "", desc: "" };
      case "institutions":
        return { name: "", abbreviation: "", country: "", city: "", address: "", website: "", email: "", phone: "", contact_person: "", description: "", institution_type: "" };
      case "announcements":
        return { title: "", content: "", announcement_type: "", author: "", institution: null, importance: "normal", is_published: true, publish_date: "" };
      case "downloads":
        return { title: "", description: "", size: null, format: "", version: "", downloads: 0 };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError("");

    // Validate required fields
    if (!editingItem) {
      if (activeType === 'changelog' && !formData.release_date) {
        setFormError('Release Date is required');
        return;
      }
    }

    if (activeType === 'news') {
      const wordCount = countEnglishWords(formData.content);
      if (wordCount < NEWS_CONTENT_MIN_WORDS) {
        setFormError(`News content must contain at least ${NEWS_CONTENT_MIN_WORDS} English words. Current count: ${wordCount}.`);
        return;
      }
      if (countParagraphs(formData.content) < 2) {
        setFormError('News content must contain multiple paragraphs. Separate paragraphs with a blank line.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Filter out null values and empty strings before submitting (for optional fields)
      const submitData = { ...formData };
      readOnlyFormFields.forEach((key) => delete submitData[key]);
      Object.keys(submitData).forEach(key => {
        // Convert empty strings to null for optional fields
        if (submitData[key] === null || submitData[key] === '') {
          delete submitData[key];
        }
      });

      switch (activeType) {
        case "users":
          if (editingItem) {
            await updateUser(editingItem.id, submitData);
          } else {
            await createUser(submitData);
          }
          break;
        case "news":
          // Handle file upload for news images
          let newsData = { ...submitData };

          if (editingItem) {
            // For editing, only include image if it's a file object (user selected a new image)
            if (formData.image && typeof formData.image === 'object') {
              newsData.image = formData.image;
            } else {
              // If no new image selected, remove image field to keep existing one
              delete newsData.image;
            }
          } else {
            // For new news, include image field regardless
            if (formData.image && typeof formData.image === 'object') {
              newsData.image = formData.image;
            }
          }

          if (editingItem) {
            await updateNews(editingItem.id, newsData);
          } else {
            await createNews(newsData);
          }
          break;
        case "nutrition_data":
          if (editingItem) {
            await updateSunflowerNutritionData(editingItem.id, submitData);
          } else {
            await createSunflowerNutritionData(submitData);
          }
          break;
        case "changelog":
          if (editingItem) {
            await updateChangelog(editingItem.id, submitData);
          } else {
            await createChangelog(submitData);
          }
          break;
        case "regions":
          if (editingItem) {
            await updateRegion(editingItem.id, submitData);
          } else {
            await createRegion(submitData);
          }
          break;
        case "varieties":
          if (editingItem) {
            await updateVariety(editingItem.id, submitData);
          } else {
            await createVariety(submitData);
          }
          break;
        case "genes":
          if (editingItem) {
            await updateGene(editingItem.id, submitData);
          } else {
            await createGene(submitData);
          }
          break;
        case "gene_expressions":
          if (editingItem) {
            await updateGeneExpression(editingItem.id, submitData);
          } else {
            await createGeneExpression(submitData);
          }
          break;
        case "environmental_factors":
          if (editingItem) {
            await updateEnvironmentalFactor(editingItem.id, submitData);
          } else {
            await createEnvironmentalFactor(submitData);
          }
          break;
        case "regional_map_sites":
          if (editingItem) {
            await updateRegionalMapSite(editingItem.id, submitData);
          } else {
            await createRegionalMapSite(submitData);
          }
          break;
        case "regional_environment_values":
          if (editingItem) {
            await updateRegionalEnvironmentValue(editingItem.id, submitData);
          } else {
            await createRegionalEnvironmentValue(submitData);
          }
          break;
        case "nutrition":
          if (editingItem) {
            await updateNutrition(editingItem.id, submitData);
          } else {
            await createNutrition(submitData);
          }
          break;
        case "institutions":
          if (editingItem) {
            await updateInstitution(editingItem.id, submitData);
          } else {
            await createInstitution(submitData);
          }
          break;
        case "announcements":
          if (editingItem) {
            await updateAnnouncement(editingItem.id, submitData);
          } else {
            await createAnnouncement(submitData);
          }
          break;
        case "downloads":
          if (editingItem) {
            await updateDownloadFile(editingItem.id, submitData);
          } else {
            await createDownloadFile(submitData);
          }
          break;
      }
      fetchData();
      closeModal(true);
    } catch (err) {
      console.error("Failed to save:", err);
      setFormError(t("admin.saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      switch (activeType) {
        case "users":
          await deleteUser(id);
          break;
        case "news":
          await deleteNews(id);
          break;
        case "nutrition_data":
          await deleteSunflowerNutritionData(id);
          break;
        case "changelog":
          await deleteChangelog(id);
          break;
        case "regions":
          await deleteRegion(id);
          break;
        case "varieties":
          await deleteVariety(id);
          break;
        case "genes":
          await deleteGene(id);
          break;
        case "gene_expressions":
          await deleteGeneExpression(id);
          break;
        case "environmental_factors":
          await deleteEnvironmentalFactor(id);
          break;
        case "regional_map_sites":
          await deleteRegionalMapSite(id);
          break;
        case "regional_environment_values":
          await deleteRegionalEnvironmentValue(id);
          break;
        case "nutrition":
          await deleteNutrition(id);
          break;
        case "institutions":
          await deleteInstitution(id);
          break;
        case "announcements":
          await deleteAnnouncement(id);
          break;
        case "downloads":
          await deleteDownloadFile(id);
          break;
      }
      fetchData();
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
      case "users":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("user")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("email")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("status")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("joined")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as UserData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: cropConfig.accentSoft }}>
                        <User className="h-5 w-5" style={{ color: cropConfig.accent }} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{item.first_name || item.last_name || item.username}</div>
                        <div className="text-sm text-gray-500">@{item.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.email || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {item.is_staff && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">{statusText("admin")}</span>}
                      {item.is_active ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{statusText("active")}</span> : <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">{statusText("inactive")}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.date_joined).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
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
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
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
                  <td className="px-6 py-4 text-sm text-gray-500">{item.oil_content ?? "-"}{item.oil_content !== null && item.oil_content !== undefined ? '%' : ''}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.maturity_days ?? "-"}{item.maturity_days !== null && item.maturity_days !== undefined ? ' 天' : ''}</td>
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
                  <td className="px-6 py-4 text-sm text-gray-500">{item.symbol || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.chromosome || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.gene_type || "-"}</td>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("institution")}</th>
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
                  <td className="px-6 py-4 text-sm text-gray-500">{item.author || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.institution_name || institutions.find(i => i.id === item.institution)?.name || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.importance === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.importance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
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
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{statusText("published")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("draft")}</span>}
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
              {(filteredData as GeneExpressionData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.gene_name || genes.find(g => g.id === item.gene)?.gene_id || item.gene}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.variety_name || varieties.find(v => v.id === item.variety)?.name || item.variety}
                  </td>
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
              {(filteredData as EnvironmentalFactorData[]).map((item) => (
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
      case "regional_map_sites":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("region")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("province")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("representativeVarieties")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("coordinate")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("status")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}<div className="text-xs text-gray-400">{item.code}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.region_name || regions.find(r => r.id === item.region)?.name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.province}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Array.isArray(item.variety_names) && item.variety_names.length ? item.variety_names.join("、") : "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.longitude ?? item.lng}, {item.latitude ?? item.lat}</td>
                  <td className="px-6 py-4">
                    {item.is_active ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{statusText("visible")}</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{statusText("hidden")}</span>}
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
      case "regional_environment_values":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("site")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("factor")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("range")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("display_value")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("note")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.site_name || regionalMapSites.find(s => s.id === item.site)?.name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.factor_name || environmentalFactors.find(f => f.id === item.factor)?.name || "-"}<div className="text-xs text-gray-400">{item.factor_code || ""}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.value_min ?? "-"} - {item.value_max ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.display_value || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.note || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "nutrition":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("description")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as NutritionData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.desc || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "downloads":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("title")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("format")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("size")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("version")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{column("downloads")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{column("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as DownloadFileData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.format || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.size ? `${(item.size / 1024 / 1024).toFixed(2)} MB` : "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.version || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.downloads}</td>
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
    const formFields = Object.keys(formData).filter(k => k !== 'id' && k !== 'create_time' && k !== 'update_time' && k !== 'date_joined' && !readOnlyFormFields.has(k));

    // Define options for select fields
    const importanceOptions = [
      { value: 'low', label: t("admin.options.low") },
      { value: 'normal', label: t("admin.options.normal") },
      { value: 'high', label: t("admin.options.high") },
    ];

    const institutionTypeOptions = [
      { value: 'university', label: t("admin.options.university") },
      { value: 'research', label: t("admin.options.research") },
      { value: 'company', label: t("admin.options.company") },
      { value: 'other', label: t("admin.options.other") },
    ];

    const announcementTypeOptions = [
      { value: 'event', label: t("admin.options.event") },
      { value: 'news', label: t("admin.types.news") },
      { value: 'alert', label: t("admin.options.alert") },
      { value: 'other', label: t("admin.options.other") },
    ];

    const newsCategoryOptions = [
      { value: 'research', label: t("news.categories.research") },
      { value: 'publication', label: t("admin.options.publication") },
      { value: 'conference', label: t("admin.options.conference") },
      { value: 'update', label: t("common.update") },
      { value: 'other', label: t("admin.options.other") },
    ];

    const seedColorOptions = [
      { value: t("admin.seedColors.black"), color: "#111827" },
      { value: t("admin.seedColors.white"), color: "#f8fafc" },
      { value: t("admin.seedColors.gray"), color: "#94a3b8" },
      { value: t("admin.seedColors.brown"), color: "#92400e" },
      { value: t("admin.seedColors.striped"), color: "#facc15" },
      { value: t("admin.seedColors.other"), color: "#22c55e" },
    ];

    const newsTagsOptions = [
      { value: 'genomics', label: t("admin.options.genomics") },
      { value: 'breeding', label: t("admin.options.breeding") },
      { value: 'transcriptomics', label: t("admin.options.transcriptomics") },
      { value: 'metabolomics', label: t("admin.options.metabolomics") },
      { value: 'phenotyping', label: t("admin.options.phenotyping") },
      { value: 'genetic-diversity', label: t("admin.options.geneticDiversity") },
      { value: 'marker-development', label: t("admin.options.markerDevelopment") },
      { value: 'qtl-mapping', label: t("admin.options.qtlMapping") },
      { value: 'genome-editing', label: t("admin.options.genomeEditing") },
      { value: 'bioinformatics', label: t("admin.options.bioinformatics") },
    ];

    const getFieldLabel = (key: string) => t(`admin.columns.${key}`, { defaultValue: key.replace(/_/g, " ") });
    const wideFields = new Set(['content', 'description', 'function', 'tags', 'image', 'address', 'varieties']);
    const requiredFields = new Set(['title', 'name', 'username', 'email', 'sample_code', 'region', 'province', 'longitude', 'latitude', 'site', 'factor']);
    const fieldWrapperClass = (key: string) =>
      `space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors focus-within:border-green-300 focus-within:bg-green-50/30 ${
        wideFields.has(key) ? 'md:col-span-2' : ''
      }`;
    const inputClass = "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20";
    const paddedInputClass = "w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20";
    const selectClass = "w-full appearance-none rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20";

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {formFields.map((key) => (
            <div key={key} className={fieldWrapperClass(key)}>
              <div className="flex items-center justify-between">
                <label 
                  htmlFor={key} 
                  className="block text-sm font-semibold text-slate-700"
                >
                  {getFieldLabel(key)}
                </label>
                {requiredFields.has(key) && (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">{t("admin.required")}</span>
                )}
              </div>
              
              {(() => {
                if (key === 'content' || key === 'description' || key === 'function') {
                  const isNewsContent = activeType === 'news' && key === 'content';
                  const wordCount = isNewsContent ? countEnglishWords(formData[key]) : 0;
                  return (
                    <div className="relative">
                      <textarea
                        id={key}
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={`${inputClass} ${isNewsContent ? 'min-h-80' : 'min-h-32'} resize-y`}
                        rows={isNewsContent ? 14 : 5}
                        placeholder={t("admin.placeholders.text", { field: getFieldLabel(key) })}
                      />
                      {isNewsContent && (
                        <p className={`mt-2 text-xs font-medium ${wordCount >= NEWS_CONTENT_MIN_WORDS ? 'text-green-700' : 'text-slate-500'}`}>
                          {t("admin.validation.wordsRequired", { count: wordCount, min: NEWS_CONTENT_MIN_WORDS })}
                        </p>
                      )}
                    </div>
                  );
                } else if (key === 'image' && activeType === 'news') {
                  return (
                    <div className="relative">
                      <ImageIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        id={key}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, [key]: file });
                          }
                        }}
                        className="w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-green-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:border-green-300 hover:bg-green-50/50"
                      />
                      {formData[key] && typeof formData[key] === 'string' && (
                        <div className="mt-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
                          {t("admin.placeholders.currentImage", { name: formData[key].split('/').pop() })}
                        </div>
                      )}
                      {formData[key] && typeof formData[key] === 'object' && (
                        <div className="mt-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
                          {t("admin.placeholders.selectedImage", { name: formData[key].name })}
                        </div>
                      )}
                    </div>
                  );
                } else if (key === 'is_active' || key === 'is_published' || key === 'is_scrolling') {
                  const isChecked = formData[key] === true || formData[key] === 'true';
                  return (
                    <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                      <label
                        htmlFor={key}
                        className="cursor-pointer text-sm text-slate-600"
                      >
                        {key === 'is_active' ? t("admin.fields.is_active") : key === 'is_published' ? t("admin.fields.is_published") : t("admin.fields.is_scrolling")}
                      </label>
                      <label htmlFor={key} className="relative inline-block w-12 h-6 cursor-pointer">
                        <input
                          id={key}
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <span
                          className={`absolute inset-0 rounded-full transition duration-200 ease-in-out ${isChecked ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition duration-200 ease-in-out transform ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}
                          />
                        </span>
                      </label>
                    </div>
                  );
                } else if (key === 'seed_color') {
                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {seedColorOptions.map((option) => {
                          const selected = formData[key] === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, [key]: option.value })}
                              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                                selected
                                  ? "border-green-500 bg-green-50 text-green-800 shadow-sm"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-green-300"
                              }`}
                            >
                              <span className="h-4 w-4 rounded-full border border-slate-200" style={{ backgroundColor: option.color }} />
                              <span>{option.value}</span>
                            </button>
                          );
                        })}
                      </div>
                      <input
                        id={key}
                        type="text"
                        value={formData[key] || ""}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={inputClass}
                        placeholder={t("admin.placeholders.text", { field: getFieldLabel(key) })}
                      />
                    </div>
                  );
                } else if (key === 'region') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectRegion")}</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name} ({region.code})
                          </option>
                        ))}
                      </select>
                      <MapPin className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'varieties' && activeType === 'regional_map_sites') {
                  const selectedIds = Array.isArray(formData[key]) ? formData[key].map((id: any) => Number(id)) : [];
                  return (
                    <div className="space-y-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {varieties.map((variety) => {
                          const selected = selectedIds.includes(Number(variety.id));
                          return (
                            <button
                              key={variety.id}
                              type="button"
                              onClick={() => {
                                const next = selected
                                  ? selectedIds.filter((id: number) => id !== Number(variety.id))
                                  : [...selectedIds, Number(variety.id)];
                                setFormData({ ...formData, [key]: next });
                              }}
                              className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                                selected ? "border-green-500 bg-green-50 text-green-800" : "border-slate-200 bg-white text-slate-700 hover:border-green-300"
                              }`}
                            >
                              <div className="font-medium">{variety.name}</div>
                              <div className="text-xs text-slate-500">{variety.variety_code} · {variety.region_name || "-"}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else if (key === 'variety') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectVariety")}</option>
                        {varieties.map((variety) => (
                          <option key={variety.id} value={variety.id}>
                            {variety.name} ({variety.variety_code})
                          </option>
                        ))}
                      </select>
                      <Leaf className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'site') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectSite")}</option>
                        {regionalMapSites.map((site) => (
                          <option key={site.id} value={site.id}>
                            {site.province} - {site.name} ({site.code})
                          </option>
                        ))}
                      </select>
                      <MapPin className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'factor') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectFactor")}</option>
                        {environmentalFactors.map((factor) => (
                          <option key={factor.id} value={factor.id}>
                            {factor.name} ({factor.code}, {factor.unit})
                          </option>
                        ))}
                      </select>
                      <Beaker className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'gene') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectGene")}</option>
                        {genes.map((gene) => (
                          <option key={gene.id} value={gene.id}>
                            {gene.gene_id} - {gene.name}
                          </option>
                        ))}
                      </select>
                      <Dna className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'institution') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseInt(e.target.value) })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectInstitution")}</option>
                        {institutions.map((institution) => (
                          <option key={institution.id} value={institution.id}>
                            {institution.name} ({institution.abbreviation || institution.country})
                          </option>
                        ))}
                      </select>
                      <Building className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key.includes('password')) {
                  return (
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-2.5 text-sm font-semibold text-slate-400">•••</span>
                      <input
                        id={key}
                        type="password"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={paddedInputClass}
                        placeholder={t("admin.placeholders.password")}
                      />
                    </div>
                  );
                } else if (key.includes('email')) {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        @
                      </span>
                      <input
                        id={key}
                        type="email"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={paddedInputClass}
                        placeholder={t("admin.placeholders.email")}
                      />
                    </div>
                  );
                } else if (key.includes('date')) {
                  return (
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-slate-400">{column("releaseDate")}</span>
                      <input
                        id={key}
                        type="date"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-14 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                  );
                } else if (key.includes('url') || key.includes('website')) {
                  return (
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-2.5 text-sm font-medium text-slate-400">{column("url")}</span>
                      <input
                        id={key}
                        type="url"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={paddedInputClass}
                        placeholder={t("admin.placeholders.url")}
                      />
                    </div>
                  );
                } else if (key === 'importance') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] || 'normal'}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={selectClass}
                      >
                        {importanceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Bell className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'institution_type') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectInstitutionType")}</option>
                        {institutionTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Building className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'announcement_type') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectAnnouncementType")}</option>
                        {announcementTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Bell className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'category' && activeType === 'news') {
                  return (
                    <div className="relative">
                      <select
                        id={key}
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={selectClass}
                      >
                        <option value="">{t("admin.placeholders.selectCategory")}</option>
                        {newsCategoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <FileText className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  );
                } else if (key === 'tags' && activeType === 'news') {
                  // Parse existing tags from comma-separated string to array
                  const existingTags = formData[key] ? formData[key].split(',').map((t: string) => t.trim()).filter((t: string) => t) : [];
                  
                  const toggleTag = (tagValue: string) => {
                    const currentTags = formData[key] ? formData[key].split(',').map((t: string) => t.trim()).filter((t: string) => t) : [];
                    let newTags: string[];
                    if (currentTags.includes(tagValue)) {
                      newTags = currentTags.filter((t: string) => t !== tagValue);
                    } else {
                      newTags = [...currentTags, tagValue];
                    }
                    setFormData({ ...formData, [key]: newTags.join(',') });
                  };

                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {newsTagsOptions.map((option) => {
                          const isSelected = existingTags.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleTag(option.value)}
                              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-green-500 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                      {formData[key] && (
                        <div className="text-xs text-gray-500 mt-1">
                          {t("admin.placeholders.selected", { items: existingTags.join(', ') })}
                        </div>
                      )}
                    </div>
                  );
                } else if (key.includes('content') || key.includes('value') || key.includes('days') || key.includes('size') || key.includes('height') || key.includes('yield') || key.includes('position') || key === 'longitude' || key === 'latitude' || key === 'display_order') {
                  return (
                    <div className="relative">
                      <input
                        id={key}
                        type="number"
                        value={formData[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value === '' ? null : parseFloat(e.target.value) })}
                        className={inputClass}
                        placeholder={t("admin.placeholders.text", { field: getFieldLabel(key) })}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="relative">
                      <input
                        id={key}
                        type="text"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={inputClass}
                        placeholder={t("admin.placeholders.text", { field: getFieldLabel(key) })}
                      />
                    </div>
                  );
                }
              })()}
            </div>
          ))}
        </div>
        
        {/* Form Actions */}
        <div className="sticky bottom-0 -mx-1 flex flex-col gap-3 border-t border-slate-200 bg-white/95 px-1 pt-4 backdrop-blur sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={isSubmitting}
            className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("admin.cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSubmitting ? t("admin.saving") : editingItem ? t("admin.saveChanges") : t("admin.add")}
          </button>
        </div>
      </form>
    );
  };

  return (
      <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-600 to-green-800 text-white flex-shrink-0 flex flex-col h-screen absolute">
        <div className="p-4 border-b border-green-500/30">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">SunNCFdb</h1>
              <p className="text-xs text-green-200">{t("admin.panel")}</p>
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
                    : 'text-green-100 hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                {typeTitle(key)}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-green-500/30">
          <div className="text-sm text-green-200 mb-2">{t("admin.welcome", { name: currentUser?.username || statusText("admin") })}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 w-full">
            <LogOut className="h-4 w-4" /> {t("admin.logout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-slate-100 p-6 ml-64">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-slate-900">{t("admin.management", { type: typeTitle(activeType) })}</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t("admin.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-medium text-green-700">{typeTitle(activeType)}</p>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {editingItem ? t("admin.editRecord") : t("admin.addRecord")}
                </h2>
              </div>
              <button
                onClick={() => closeModal()}
                disabled={isSubmitting}
                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto bg-slate-50 p-6">{renderForm()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
