// Data 页面的API接口
import { fetchRequest } from "./https";

type ListParams = { page?: number; pageSize?: number; search?: string; limit?: number };

const withListParams = (endpoint: string, params?: ListParams) => {
    if (!params) return endpoint;
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("page_size", String(params.pageSize));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search?.trim()) query.set("search", params.search.trim());
    Object.entries(params).forEach(([key, value]) => {
        if (["page", "pageSize", "search", "limit"].includes(key)) return;
        if (value !== undefined && value !== null && String(value).trim() !== "") query.set(key, String(value));
    });
    const qs = query.toString();
    if (!qs) return endpoint;
    return `${endpoint}${endpoint.includes("?") ? "&" : "?"}${qs}`;
};

const normalizeListResponse = <T = any,>(data: unknown): T[] => {
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === "object" && Array.isArray((data as { results?: unknown }).results)) {
        return (data as { results: T[] }).results;
    }
    return [];
};

export const fetchDownloadFiles = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/download/files/", params), "GET");
    const data = await response.json();
    return data;
}

export const fetchChangelog = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/changelog/", params), "GET");
    const data = await response.json();
    return data;
}

export const fetchNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/news/?limit=100", params), "GET");
    const data = await response.json();
    return params ? data : normalizeListResponse(data);
}

export const fetchNewsDetail = async (id: number) => {
    const response = await fetchRequest(`/api/news/${id}/`, "GET");
    const data = await response.json();
    return data;
}

export const fetchScrollingNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/news/scrolling/?limit=10", params), "GET");
    const data = await response.json();
    return params ? data : normalizeListResponse(data);
}

export const fetchChangelogDetail = async (id: number) => {
    const response = await fetchRequest(`/api/changelog/${id}/`, "GET");
    const data = await response.json();
    return data;
}

// ============ Admin APIs ============

export const fetchUsers = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/users/", params), "GET");
    return response.json();
}

export const createUser = async (data: any) => {
    const response = await fetchRequest("/api/users/", "POST", data);
    return response.json();
}

export const updateUser = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/users/${id}/`, "PUT", data);
    return response.json();
}

export const deleteUser = async (id: number) => {
    await fetchRequest(`/api/users/${id}/`, "DELETE");
}

export const createNews = async (data: any) => {
    const response = await fetchRequest("/api/news/", "POST", data);
    return response.json();
}

export const updateNews = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/news/${id}/`, "PUT", data);
    return response.json();
}

export const deleteNews = async (id: number) => {
    await fetchRequest(`/api/news/${id}/`, "DELETE");
}

// Changelog
export const createChangelog = async (data: any) => {
    const response = await fetchRequest("/api/changelog/", "POST", data);
    return response.json();
}

export const updateChangelog = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/changelog/${id}/`, "PUT", data);
    return response.json();
}

export const deleteChangelog = async (id: number) => {
    await fetchRequest(`/api/changelog/${id}/`, "DELETE");
}

// Regions
export const fetchRegions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/regions/", params), "GET");
    return response.json();
}

export const createRegion = async (data: any) => {
    const response = await fetchRequest("/api/regions/", "POST", data);
    return response.json();
}

export const updateRegion = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/regions/${id}/`, "PUT", data);
    return response.json();
}

export const deleteRegion = async (id: number) => {
    await fetchRequest(`/api/regions/${id}/`, "DELETE");
}

// Varieties
export const fetchVarieties = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/varieties/", params), "GET");
    return response.json();
}

export const createVariety = async (data: any) => {
    const response = await fetchRequest("/api/varieties/", "POST", data);
    return response.json();
}

export const updateVariety = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/varieties/${id}/`, "PUT", data);
    return response.json();
}

export const deleteVariety = async (id: number) => {
    await fetchRequest(`/api/varieties/${id}/`, "DELETE");
}

// Genes
export const fetchGenes = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/genes/", params), "GET");
    return response.json();
}

export const createGene = async (data: any) => {
    const response = await fetchRequest("/api/genes/", "POST", data);
    return response.json();
}

export const updateGene = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/genes/${id}/`, "PUT", data);
    return response.json();
}

export const deleteGene = async (id: number) => {
    await fetchRequest(`/api/genes/${id}/`, "DELETE");
}



// Gene Associations
export const fetchGeneAssociations = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/gene-associations/", params), "GET");
    return response.json();
}

export const createGeneAssociation = async (data: any) => {
    const response = await fetchRequest("/api/gene-associations/", "POST", data);
    return response.json();
}

export const updateGeneAssociation = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/gene-associations/${id}/`, "PUT", data);
    return response.json();
}

export const deleteGeneAssociation = async (id: number) => {
    await fetchRequest(`/api/gene-associations/${id}/`, "DELETE");
}

// Gene Expressions
export const fetchGeneExpressions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/gene-expressions/", params), "GET");
    return response.json();
}

export const createGeneExpression = async (data: any) => {
    const response = await fetchRequest("/api/gene-expressions/", "POST", data);
    return response.json();
}

export const updateGeneExpression = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/gene-expressions/${id}/`, "PUT", data);
    return response.json();
}

export const deleteGeneExpression = async (id: number) => {
    await fetchRequest(`/api/gene-expressions/${id}/`, "DELETE");
}

// Environmental Factors
export const fetchEnvironmentalFactors = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/environmental-factors/", params), "GET");
    return response.json();
}

export const createEnvironmentalFactor = async (data: any) => {
    const response = await fetchRequest("/api/environmental-factors/", "POST", data);
    return response.json();
}

export const updateEnvironmentalFactor = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/environmental-factors/${id}/`, "PUT", data);
    return response.json();
}

export const deleteEnvironmentalFactor = async (id: number) => {
    await fetchRequest(`/api/environmental-factors/${id}/`, "DELETE");
}

// Regional Map Sites
export const fetchRegionalMapSites = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/regional-map-sites/?limit=500", params), "GET");
    const data = await response.json();
    return params ? data : normalizeListResponse(data);
}

export const createRegionalMapSite = async (data: any) => {
    const response = await fetchRequest("/api/regional-map-sites/", "POST", data);
    return response.json();
}

export const updateRegionalMapSite = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/regional-map-sites/${id}/`, "PUT", data);
    return response.json();
}

export const deleteRegionalMapSite = async (id: number) => {
    await fetchRequest(`/api/regional-map-sites/${id}/`, "DELETE");
}

// Regional Environment Values
export const fetchRegionalEnvironmentValues = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/regional-environment-values/?limit=500", params), "GET");
    const data = await response.json();
    return params ? data : normalizeListResponse(data);
}

export const createRegionalEnvironmentValue = async (data: any) => {
    const response = await fetchRequest("/api/regional-environment-values/", "POST", data);
    return response.json();
}

export const updateRegionalEnvironmentValue = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/regional-environment-values/${id}/`, "PUT", data);
    return response.json();
}

export const deleteRegionalEnvironmentValue = async (id: number) => {
    await fetchRequest(`/api/regional-environment-values/${id}/`, "DELETE");
}

// Nutrition
export const fetchNutrition = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/nutrition/", params), "GET");
    return response.json();
}

export const createNutrition = async (data: any) => {
    const response = await fetchRequest("/api/nutrition/", "POST", data);
    return response.json();
}

export const updateNutrition = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/nutrition/${id}/`, "PUT", data);
    return response.json();
}

export const deleteNutrition = async (id: number) => {
    await fetchRequest(`/api/nutrition/${id}/`, "DELETE");
}

// Institutions
export const fetchInstitutions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/institutions/", params), "GET");
    return response.json();
}

export const createInstitution = async (data: any) => {
    const response = await fetchRequest("/api/institutions/", "POST", data);
    return response.json();
}

export const updateInstitution = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/institutions/${id}/`, "PUT", data);
    return response.json();
}

export const deleteInstitution = async (id: number) => {
    await fetchRequest(`/api/institutions/${id}/`, "DELETE");
}

// Announcements
export const fetchAnnouncements = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/announcements/", params), "GET");
    return response.json();
}

export const createAnnouncement = async (data: any) => {
    const response = await fetchRequest("/api/announcements/", "POST", data);
    return response.json();
}

export const updateAnnouncement = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/announcements/${id}/`, "PUT", data);
    return response.json();
}

export const deleteAnnouncement = async (id: number) => {
    await fetchRequest(`/api/announcements/${id}/`, "DELETE");
}

// Download Files
export const createDownloadFile = async (data: any) => {
    const response = await fetchRequest("/api/download/files/", "POST", data);
    return response.json();
}

export const updateDownloadFile = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/download/files/${id}/`, "PUT", data);
    return response.json();
}

export const deleteDownloadFile = async (id: number) => {
    await fetchRequest(`/api/download/files/${id}/`, "DELETE");
}

export const fetchSunflowerNutritionData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/nutrition-data/", params), "GET");
    return await response.json();
};

export const createSunflowerNutritionData = async (data: any) => {
    const response = await fetchRequest("/api/nutrition-data/", "POST", data);
    return await response.json();
};

export const updateSunflowerNutritionData = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/nutrition-data/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSunflowerNutritionData = async (id: number) => {
    await fetchRequest(`/api/nutrition-data/${id}/`, "DELETE");
};

export const submitEventRegistration = async (data: any) => {
    const response = await fetchRequest("/api/event-registrations/", "POST", data);
    return response.json();
}

// Molecular fingerprint, HPLC search and local batch import APIs
export const fetchSunflowerGlobalSearch = async (query: string) => {
    const response = await fetchRequest(`/api/search/?q=${encodeURIComponent(query)}`, "GET");
    return await response.json();
};

export const fetchSunflowerMarkerLoci = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/marker-loci/", params), "GET");
    return await response.json();
};

export const createSunflowerMarkerLocus = async (data: any) => {
    const response = await fetchRequest("/api/marker-loci/", "POST", data);
    return await response.json();
};

export const updateSunflowerMarkerLocus = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/marker-loci/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSunflowerMarkerLocus = async (id: number) => {
    const response = await fetchRequest(`/api/marker-loci/${id}/`, "DELETE");
    return response.ok ? { success: true } : await response.json();
};

export const fetchSunflowerMolecularFingerprints = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/molecular-fingerprints/", params), "GET");
    return await response.json();
};

export const createSunflowerMolecularFingerprint = async (data: any) => {
    const response = await fetchRequest("/api/molecular-fingerprints/", "POST", data);
    return await response.json();
};

export const updateSunflowerMolecularFingerprint = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/molecular-fingerprints/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSunflowerMolecularFingerprint = async (id: number) => {
    const response = await fetchRequest(`/api/molecular-fingerprints/${id}/`, "DELETE");
    return response.ok ? { success: true } : await response.json();
};

export const fetchSunflowerSequencingData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/sequencing-data/", params), "GET");
    return await response.json();
};

export const createSunflowerSequencingData = async (data: any) => {
    const response = await fetchRequest("/api/sequencing-data/", "POST", data);
    return await response.json();
};

export const updateSunflowerSequencingData = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/sequencing-data/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSunflowerSequencingData = async (id: number) => {
    const response = await fetchRequest(`/api/sequencing-data/${id}/`, "DELETE");
    return response.ok ? { success: true } : await response.json();
};

export const fetchSunflowerGermplasmResources = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/germplasm-resources/", params), "GET");
    return await response.json();
};

export const createSunflowerGermplasmResource = async (data: any) => {
    const response = await fetchRequest("/api/germplasm-resources/", "POST", data);
    return await response.json();
};

export const updateSunflowerGermplasmResource = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/germplasm-resources/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSunflowerGermplasmResource = async (id: number) => {
    const response = await fetchRequest(`/api/germplasm-resources/${id}/`, "DELETE");
    return response.ok ? { success: true } : await response.json();
};

export const fetchSunflowerGeneticDiversityAnalyses = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/api/genetic-diversity-analyses/", params), "GET");
    return await response.json();
};

export const createSunflowerGeneticDiversityAnalysis = async (data: any) => {
    const response = await fetchRequest("/api/genetic-diversity-analyses/", "POST", data);
    return await response.json();
};

export const updateSunflowerGeneticDiversityAnalysis = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/genetic-diversity-analyses/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSunflowerGeneticDiversityAnalysis = async (id: number) => {
    const response = await fetchRequest(`/api/genetic-diversity-analyses/${id}/`, "DELETE");
    return response.ok ? { success: true } : await response.json();
};

export const batchCreateSunflowerRecords = async (entity: string, rows: any[]) => {
    const response = await fetchRequest(`/api/batch/${entity}/`, "POST", { rows });
    return await response.json();
};

export const fetchSunflowerRegions = fetchRegions;
export const fetchSunflowerVarieties = fetchVarieties;
export const fetchSunflowerGenes = fetchGenes;
