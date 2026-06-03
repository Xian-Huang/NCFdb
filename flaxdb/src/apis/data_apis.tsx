import { fetchRequest } from "./https";


type ListParams = { page?: number; pageSize?: number; search?: string; limit?: number; [key: string]: any };

const withListParams = (endpoint: string, params?: ListParams) => {
  if (!params) return endpoint;
  const [path, existingQuery = ""] = endpoint.split("?");
  const query = new URLSearchParams(existingQuery);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("page_size", String(params.pageSize));
  if (params.limit) query.set("limit", String(params.limit));
  const search = params.search?.trim();
  if (search) query.set("search", search);
  Object.entries(params).forEach(([key, value]) => {
    if (["page", "pageSize", "search", "limit"].includes(key)) return;
    if (value !== undefined && value !== null && String(value).trim() !== "") query.set(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? path + "?" + queryString : path;
};
export const fetchFlaxDownloadFiles = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/download/files/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxRegions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxVarieties = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/varieties/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxGenes = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/genes/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxGeneAssociations = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/gene-associations/", params), "GET", undefined, true);
    return await response.json();
}

export const createFlaxGeneAssociation = async (data: any) => {
    const response = await fetchRequest("/gene-associations/", "POST", data, true);
    return await response.json();
};

export const updateFlaxGeneAssociation = async (id: number, data: any) => {
    const response = await fetchRequest(`/gene-associations/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxGeneAssociation = async (id: number) => {
    const response = await fetchRequest(`/gene-associations/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxGeneExpressions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/gene-expressions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createFlaxGeneExpression = async (data: any) => {
    const response = await fetchRequest("/gene-expressions/", "POST", data, true);
    return await response.json();
};

export const updateFlaxGeneExpression = async (id: number, data: any) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxGeneExpression = async (id: number) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxEnvironmentalFactors = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/environmental-factors/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createFlaxEnvironmentalFactor = async (data: any) => {
    const response = await fetchRequest("/environmental-factors/", "POST", data, true);
    return await response.json();
};

export const updateFlaxEnvironmentalFactor = async (id: number, data: any) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxEnvironmentalFactor = async (id: number) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxInstitutions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/institutions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxAnnouncements = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/announcements/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxScrollingNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/scrolling/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxNewsById = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxChangelogs = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/changelogs/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchFlaxChangelogById = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createFlaxNews = async (data: any) => {
    const response = await fetchRequest("/news/", "POST", data, true);
    return await response.json();
};

export const updateFlaxNews = async (id: number, data: any) => {
    const response = await fetchRequest(`/news/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxNews = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createFlaxChangelog = async (data: any) => {
    const response = await fetchRequest("/changelogs/", "POST", data, true);
    return await response.json();
};

export const updateFlaxChangelog = async (id: number, data: any) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxChangelog = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createFlaxRegion = async (data: any) => {
    const response = await fetchRequest("/regions/", "POST", data, true);
    return await response.json();
};

export const updateFlaxRegion = async (id: number, data: any) => {
    const response = await fetchRequest(`/regions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxRegion = async (id: number) => {
    const response = await fetchRequest(`/regions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createFlaxVariety = async (data: any) => {
    const response = await fetchRequest("/varieties/", "POST", data, true);
    return await response.json();
};

export const updateFlaxVariety = async (id: number, data: any) => {
    const response = await fetchRequest(`/varieties/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxVariety = async (id: number) => {
    const response = await fetchRequest(`/varieties/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createFlaxGene = async (data: any) => {
    const response = await fetchRequest("/genes/", "POST", data, true);
    return await response.json();
};

export const updateFlaxGene = async (id: number, data: any) => {
    const response = await fetchRequest(`/genes/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxGene = async (id: number) => {
    const response = await fetchRequest(`/genes/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createFlaxInstitution = async (data: any) => {
    const response = await fetchRequest("/institutions/", "POST", data, true);
    return await response.json();
};

export const updateFlaxInstitution = async (id: number, data: any) => {
    const response = await fetchRequest(`/institutions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxInstitution = async (id: number) => {
    const response = await fetchRequest(`/institutions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createFlaxAnnouncement = async (data: any) => {
    const response = await fetchRequest("/announcements/", "POST", data, true);
    return await response.json();
};

export const updateFlaxAnnouncement = async (id: number, data: any) => {
    const response = await fetchRequest(`/announcements/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxAnnouncement = async (id: number) => {
    const response = await fetchRequest(`/announcements/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createFlaxDownloadFile = async (data: any) => {
    const response = await fetchRequest("/download/files/", "POST", data, true);
    return await response.json();
};

export const updateFlaxDownloadFile = async (id: number, data: any) => {
    const response = await fetchRequest(`/download/files/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxDownloadFile = async (id: number) => {
    const response = await fetchRequest(`/download/files/${id}/`, "DELETE", undefined, true);
    return await response.json();
};


export const fetchFlaxNutritionData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/nutrition-data/", params), "GET", undefined, true);
    return await response.json();
};

export const fetchFlaxGlobalSearch = async (query: string) => {
    const response = await fetchRequest(`/search/?q=${encodeURIComponent(query)}`, "GET", undefined, true);
    return await response.json();
};

export const fetchFlaxMarkerLoci = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/marker-loci/", params), "GET", undefined, true);
    return await response.json();
};

export const createFlaxMarkerLocus = async (data: any) => {
    const response = await fetchRequest("/marker-loci/", "POST", data, true);
    return await response.json();
};

export const updateFlaxMarkerLocus = async (id: number, data: any) => {
    const response = await fetchRequest(`/marker-loci/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxMarkerLocus = async (id: number) => {
    const response = await fetchRequest(`/marker-loci/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxMolecularFingerprints = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/molecular-fingerprints/", params), "GET", undefined, true);
    return await response.json();
};

export const createFlaxMolecularFingerprint = async (data: any) => {
    const response = await fetchRequest("/molecular-fingerprints/", "POST", data, true);
    return await response.json();
};

export const updateFlaxMolecularFingerprint = async (id: number, data: any) => {
    const response = await fetchRequest(`/molecular-fingerprints/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxMolecularFingerprint = async (id: number) => {
    const response = await fetchRequest(`/molecular-fingerprints/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxSequencingData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/sequencing-data/", params), "GET", undefined, true);
    return await response.json();
};

export const createFlaxSequencingData = async (data: any) => {
    const response = await fetchRequest("/sequencing-data/", "POST", data, true);
    return await response.json();
};

export const updateFlaxSequencingData = async (id: number, data: any) => {
    const response = await fetchRequest(`/sequencing-data/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxSequencingData = async (id: number) => {
    const response = await fetchRequest(`/sequencing-data/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxGermplasmResources = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/germplasm-resources/", params), "GET", undefined, true);
    return await response.json();
};

export const createFlaxGermplasmResource = async (data: any) => {
    const response = await fetchRequest("/germplasm-resources/", "POST", data, true);
    return await response.json();
};

export const updateFlaxGermplasmResource = async (id: number, data: any) => {
    const response = await fetchRequest(`/germplasm-resources/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxGermplasmResource = async (id: number) => {
    const response = await fetchRequest(`/germplasm-resources/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxGeneticDiversityAnalyses = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/genetic-diversity-analyses/", params), "GET", undefined, true);
    return await response.json();
};

export const createFlaxGeneticDiversityAnalysis = async (data: any) => {
    const response = await fetchRequest("/genetic-diversity-analyses/", "POST", data, true);
    return await response.json();
};

export const updateFlaxGeneticDiversityAnalysis = async (id: number, data: any) => {
    const response = await fetchRequest(`/genetic-diversity-analyses/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxGeneticDiversityAnalysis = async (id: number) => {
    const response = await fetchRequest(`/genetic-diversity-analyses/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const batchCreateFlaxRecords = async (entity: string, rows: any[]) => {
    const response = await fetchRequest(`/batch/${entity}/`, "POST", rows, true);
    return await response.json();
};

export const createFlaxNutritionData = async (data: any) => {
    const response = await fetchRequest("/nutrition-data/", "POST", data, true);
    return await response.json();
};

export const updateFlaxNutritionData = async (id: number, data: any) => {
    const response = await fetchRequest(`/nutrition-data/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxNutritionData = async (id: number) => {
    const response = await fetchRequest(`/nutrition-data/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchDownloadFiles = async (params?: ListParams) => {
  const response = await fetch(`/api/download/files/${withListParams("", params)}`);
  if (!response.ok) throw new Error("download files");
  return response.json();
};

export const fetchNews = async (params?: ListParams) => {
  const response = await fetch(`/api/news/${withListParams("", params)}`);
  if (!response.ok) throw new Error("news");
  return response.json();
};

export const fetchNewsDetail = async (id: number) => {
  const response = await fetch(`/api/news/${id}/`);
  if (!response.ok) throw new Error("news detail");
  return response.json();
};

export const fetchScrollingNews = async (params?: ListParams) => {
  const response = await fetch(`/api/news/scrolling/${withListParams("", params)}`);
  if (!response.ok) throw new Error("scrolling news");
  return response.json();
};

export const fetchChangelog = fetchFlaxChangelogs;
export const fetchChangelogDetail = fetchFlaxChangelogById;


export const fetchFlaxRegionalMapSites = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-map-sites/", params), "GET", undefined, true);
    return await response.json();
};

export const createFlaxRegionalMapSite = async (data: any) => {
    const response = await fetchRequest("/regional-map-sites/", "POST", data, true);
    return await response.json();
};

export const updateFlaxRegionalMapSite = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxRegionalMapSite = async (id: number) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchFlaxRegionalEnvironmentValues = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-environment-values/", params), "GET", undefined, true);
    return await response.json();
};

export const createFlaxRegionalEnvironmentValue = async (data: any) => {
    const response = await fetchRequest("/regional-environment-values/", "POST", data, true);
    return await response.json();
};

export const updateFlaxRegionalEnvironmentValue = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteFlaxRegionalEnvironmentValue = async (id: number) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const submitEventRegistration = async (data: any) => {
    const response = await fetchRequest("/api/event-registrations/", "POST", data);
    return response.json();
}

