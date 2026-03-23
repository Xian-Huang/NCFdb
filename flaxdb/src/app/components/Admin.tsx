import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
} from "../../apis/data_apis";

type DataType = "news" | "changelog" | "regions" | "varieties" | "genes" | "gene_expressions" | "environmental_factors" | "institutions" | "announcements" | "downloads";

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

const dataTypeConfig: Record<DataType, { title: string; icon: React.ElementType; fetchFn: () => Promise<any[]>; createFn: (data: any) => Promise<any>; updateFn: (id: number, data: any) => Promise<any>; deleteFn: (id: number) => Promise<any> }> = {
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
    fetchFn: async () => [],
    createFn: async () => {},
    updateFn: async () => {},
    deleteFn: async () => {},
  },
  environmental_factors: { 
    title: "Environmental Factors", 
    icon: Beaker, 
    fetchFn: async () => [],
    createFn: async () => {},
    updateFn: async () => {},
    deleteFn: async () => {},
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
  const [activeType, setActiveType] = useState<DataType>("news");
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
        return { title: "", content: "", author: "", category: "", image: "", tags: "", is_published: true };
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
    const config = dataTypeConfig[activeType];
    try {
      if (editingItem) {
        await config.updateFn(editingItem.id, formData);
      } else {
        await config.createFn(formData);
      }
      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
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
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Published</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Draft</span>}
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
                    {item.is_published ? <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Published</span> : <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Draft</span>}
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
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).filter(k => k !== 'id' && k !== 'create_time' && k !== 'update_time').map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            {key === 'content' || key === 'description' ? (
              <textarea
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                rows={4}
              />
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
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            {editingItem ? 'Save Changes' : 'Add'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex-shrink-0 flex flex-col h-screen fixed">
        <div className="p-4 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">FlaxDB</h1>
              <p className="text-xs text-blue-200">Admin Panel</p>
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
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                {config.title}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-500/30">
          <div className="text-sm text-blue-200 mb-2">Welcome, {currentUser?.username || 'Admin'}</div>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
