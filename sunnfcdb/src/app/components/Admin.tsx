import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Plus, Edit, Trash2, X, Shield, LogOut,
  FileText, MapPin, Leaf, Dna, Building, Bell,
  Search, RefreshCw, Download, Beaker
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
  fetchNutrition, createNutrition, updateNutrition, deleteNutrition,
  fetchInstitutions, createInstitution, updateInstitution, deleteInstitution,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  fetchDownloadFiles, createDownloadFile, updateDownloadFile, deleteDownloadFile,
} from "../../apis/data_apis";

type DataType = "users" | "news" | "changelog" | "regions" | "varieties" | "genes" | "gene_expressions" | "environmental_factors" | "nutrition" | "institutions" | "announcements" | "downloads";

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

const dataTypeConfig: Record<DataType, { title: string; icon: React.ElementType; endpoint: string }> = {
  users: { title: "Users", icon: User, endpoint: "users/" },
  news: { title: "News", icon: FileText, endpoint: "news/" },
  changelog: { title: "Updates", icon: RefreshCw, endpoint: "changelog/" },
  regions: { title: "Regions", icon: MapPin, endpoint: "regions/" },
  varieties: { title: "Varieties", icon: Leaf, endpoint: "varieties/" },
  genes: { title: "Genes", icon: Dna, endpoint: "genes/" },
  gene_expressions: { title: "Gene Expressions", icon: Dna, endpoint: "gene-expressions/" },
  environmental_factors: { title: "Environmental Factors", icon: Beaker, endpoint: "environmental-factors/" },
  nutrition: { title: "Nutrition", icon: Beaker, endpoint: "nutrition/" },
  institutions: { title: "Institutions", icon: Building, endpoint: "institutions/" },
  announcements: { title: "Announcements", icon: Bell, endpoint: "announcements/" },
  downloads: { title: "Downloads", icon: Download, endpoint: "download/files/" },
};

export function Admin() {
  const [activeType, setActiveType] = useState<DataType>("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchData();
  }, [activeType]);

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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const getEmptyForm = () => {
    switch (activeType) {
      case "users":
        return { username: "", email: "", password: "", first_name: "", last_name: "", is_active: true, is_staff: false };
      case "news":
        return { title: "", content: "", author: "", category: "", image: "", tags: "", is_published: true };
      case "changelog":
        return { version: "", title: "", content: "", changes: [], release_date: "", is_published: true };
      case "regions":
        return { name: "", code: "", country: "", climate: "", description: "" };
      case "varieties":
        return { name: "", variety_code: "", region: null, seed_color: "", oil_content: 0, maturity_days: 0, yield_per_hectare: 0, height: 0, description: "" };
      case "genes":
        return { gene_id: "", name: "", symbol: "", chromosome: "", start_position: 0, end_position: 0, strand: "", gene_type: "", description: "", function: "", pathway: "" };
      case "institutions":
        return { name: "", abbreviation: "", country: "", city: "", address: "", website: "", email: "", phone: "", contact_person: "", description: "", institution_type: "" };
      case "announcements":
        return { title: "", content: "", announcement_type: "", author: "", institution: null, importance: "normal", is_published: true, publish_date: "" };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!editingItem) {
      if (activeType === 'changelog' && !formData.release_date) {
        alert('Release Date is required');
        return;
      }
    }
    
    try {
      switch (activeType) {
        case "users":
          if (editingItem) {
            await updateUser(editingItem.id, formData);
          } else {
            await createUser(formData);
          }
          break;
        case "news":
          // Handle file upload for news images
          let newsData = { ...formData };
          
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
        case "changelog":
          if (editingItem) {
            await updateChangelog(editingItem.id, formData);
          } else {
            await createChangelog(formData);
          }
          break;
        case "regions":
          if (editingItem) {
            await updateRegion(editingItem.id, formData);
          } else {
            await createRegion(formData);
          }
          break;
        case "varieties":
          if (editingItem) {
            await updateVariety(editingItem.id, formData);
          } else {
            await createVariety(formData);
          }
          break;
        case "genes":
          if (editingItem) {
            await updateGene(editingItem.id, formData);
          } else {
            await createGene(formData);
          }
          break;
        case "gene_expressions":
          if (editingItem) {
            await updateGeneExpression(editingItem.id, formData);
          } else {
            await createGeneExpression(formData);
          }
          break;
        case "environmental_factors":
          if (editingItem) {
            await updateEnvironmentalFactor(editingItem.id, formData);
          } else {
            await createEnvironmentalFactor(formData);
          }
          break;
        case "nutrition":
          if (editingItem) {
            await updateNutrition(editingItem.id, formData);
          } else {
            await createNutrition(formData);
          }
          break;
        case "institutions":
          if (editingItem) {
            await updateInstitution(editingItem.id, formData);
          } else {
            await createInstitution(formData);
          }
          break;
        case "announcements":
          if (editingItem) {
            await updateAnnouncement(editingItem.id, formData);
          } else {
            await createAnnouncement(formData);
          }
          break;
        case "downloads":
          if (editingItem) {
            await updateDownloadFile(editingItem.id, formData);
          } else {
            await createDownloadFile(formData);
          }
          break;
      }
      fetchData();
      closeModal();
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      switch (activeType) {
        case "users":
          await deleteUser(id);
          break;
        case "news":
          await deleteNews(id);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as UserData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-amber-600" />
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
                      {item.is_staff && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Admin</span>}
                      {item.is_active ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span> : <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Inactive</span>}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as NewsData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Published</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Draft</span>}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Climate</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oil Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity Days</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as VarietyData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.variety_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.region_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.oil_content}%</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.maturity_days} days</td>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gene ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chromosome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
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
      case "institutions":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Abbreviation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Importance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Published</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Draft</span>}
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
      case "changelog":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Release Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredData as ChangelogData[]).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.version}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.release_date}</td>
                  <td className="px-6 py-4">
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Published</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Draft</span>}
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
        return <p className="text-gray-500">No data available</p>;
    }
  };

  const renderForm = () => {
    const formFields = Object.keys(formData).filter(k => k !== 'id' && k !== 'create_time' && k !== 'update_time' && k !== 'date_joined');
    
    // Define options for select fields
    const importanceOptions = [
      { value: 'low', label: 'Low' },
      { value: 'normal', label: 'Normal' },
      { value: 'high', label: 'High' },
    ];
    
    const institutionTypeOptions = [
      { value: 'university', label: 'University' },
      { value: 'research', label: 'Research Institute' },
      { value: 'company', label: 'Company' },
      { value: 'other', label: 'Other' },
    ];
    
    const announcementTypeOptions = [
      { value: 'event', label: 'Event' },
      { value: 'news', label: 'News' },
      { value: 'alert', label: 'Alert' },
      { value: 'other', label: 'Other' },
    ];
    
    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formFields.map((key) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor={key} 
                  className="block text-sm font-medium text-gray-700"
                >
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                {/* Required field indicator */}
                {['title', 'name', 'username', 'email'].includes(key) && (
                  <span className="text-red-500 font-medium">*</span>
                )}
              </div>
              
              {(() => {
                if (key === 'content' || key === 'description' || key === 'function') {
                  return (
                    <div className="relative">
                      <textarea
                        id={key}
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm"
                        rows={5}
                        placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}`}
                      />
                    </div>
                  );
                } else if (key === 'image' && activeType === 'news') {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        🖼️
                      </span>
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                      />
                      {formData[key] && typeof formData[key] === 'string' && (
                        <div className="mt-2 text-sm text-gray-600">
                          Current image: {formData[key].split('/').pop()}
                        </div>
                      )}
                      {formData[key] && typeof formData[key] === 'object' && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected image: {formData[key].name}
                        </div>
                      )}
                    </div>
                  );
                } else if (key === 'is_active' || key === 'is_published') {
                  return (
                    <div className="flex items-center space-x-3">
                      <label 
                        htmlFor={key} 
                        className="text-sm text-gray-600 cursor-pointer flex-1"
                      >
                        {key === 'is_active' ? 'Active' : 'Published'}
                      </label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                          id={key}
                          type="checkbox"
                          checked={formData[key] || false}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                          className="sr-only"
                        />
                        <span 
                          className={`inline-block w-12 h-6 rounded-full transition duration-200 ease-in-out ${formData[key] ? 'bg-amber-500' : 'bg-gray-200'}`}
                        >
                          <span 
                            className={`inline-block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white transition duration-200 ease-in-out transform ${formData[key] ? 'translate-x-6' : 'translate-x-0'}`}
                          />
                        </span>
                      </div>
                    </div>
                  );
                } else if (key === 'region' || key === 'institution') {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        #
                      </span>
                      <input
                        id={key}
                        type="number"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) || null })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        placeholder={`${key.replace(/_/g, ' ').toLowerCase()} ID`}
                      />
                    </div>
                  );
                } else if (key.includes('password')) {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        ••••
                      </span>
                      <input
                        id={key}
                        type="password"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        placeholder="Enter password"
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        placeholder="Enter email address"
                      />
                    </div>
                  );
                } else if (key.includes('date')) {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        📅
                      </span>
                      <input
                        id={key}
                        type="date"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                      />
                    </div>
                  );
                } else if (key.includes('url') || key.includes('website')) {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        🔗
                      </span>
                      <input
                        id={key}
                        type="url"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        placeholder="Enter URL"
                      />
                    </div>
                  );
                } else if (key === 'importance') {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        ⭐
                      </span>
                      <select
                        id={key}
                        value={formData[key] || 'normal'}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm appearance-none bg-white"
                      >
                        {importanceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        ▼
                      </span>
                    </div>
                  );
                } else if (key === 'institution_type') {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        🏢
                      </span>
                      <select
                        id={key}
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm appearance-none bg-white"
                      >
                        <option value="">Select institution type</option>
                        {institutionTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        ▼
                      </span>
                    </div>
                  );
                } else if (key === 'announcement_type') {
                  return (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                        📢
                      </span>
                      <select
                        id={key}
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm appearance-none bg-white"
                      >
                        <option value="">Select announcement type</option>
                        {announcementTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        ▼
                      </span>
                    </div>
                  );
                } else if (key.includes('content') || key.includes('value') || key.includes('days') || key.includes('size') || key.includes('height') || key.includes('yield')) {
                  return (
                    <div className="relative">
                      <input
                        id={key}
                        type="number"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}`}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}`}
                      />
                    </div>
                  );
                }
              })()}
            </div>
          ))}
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={closeModal} 
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex-1 sm:flex-none font-medium shadow-sm hover:shadow"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 flex-1 sm:flex-none font-medium shadow-sm hover:shadow"
          >
            {editingItem ? 'Save Changes' : 'Add'}
          </button>
        </div>
      </form>
    );
  };

  return (
      <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-amber-600 to-amber-800 text-white flex-shrink-0 flex flex-col h-screen absolute">
        <div className="p-4 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">SunNCFdb</h1>
              <p className="text-xs text-amber-200">Admin Panel</p>
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
                    : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                {config.title}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-amber-500/30">
          <div className="text-sm text-amber-200 mb-2">Welcome, {currentUser?.username || 'Admin'}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 ml-64">
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{dataTypeConfig[activeType].title} Management</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                <Plus className="h-5 w-5" /> Add {dataTypeConfig[activeType].title.slice(0, -1)}
              </button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : filteredData.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No data available</div>
              ) : (
                renderTable()
              )}
            </div>
          </div>
        
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit' : 'Add'} {dataTypeConfig[activeType].title.slice(0, -1)}
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
