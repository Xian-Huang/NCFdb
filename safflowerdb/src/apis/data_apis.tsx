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
export const fetchSafflowerDownloadFiles = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/download/files/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerRegions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerVarieties = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/varieties/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerGenes = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/genes/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerGeneAssociations = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/gene-associations/", params), "GET", undefined, true);
    return await response.json();
}

export const createSafflowerGeneAssociation = async (data: any) => {
    const response = await fetchRequest("/gene-associations/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerGeneAssociation = async (id: number, data: any) => {
    const response = await fetchRequest(`/gene-associations/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerGeneAssociation = async (id: number) => {
    const response = await fetchRequest(`/gene-associations/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerGeneExpressions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/gene-expressions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createSafflowerGeneExpression = async (data: any) => {
    const response = await fetchRequest("/gene-expressions/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerGeneExpression = async (id: number, data: any) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerGeneExpression = async (id: number) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerEnvironmentalFactors = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/environmental-factors/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createSafflowerEnvironmentalFactor = async (data: any) => {
    const response = await fetchRequest("/environmental-factors/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerEnvironmentalFactor = async (id: number, data: any) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerEnvironmentalFactor = async (id: number) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerInstitutions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/institutions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerAnnouncements = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/announcements/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerScrollingNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/scrolling/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerNewsById = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerChangelogs = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/changelogs/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSafflowerChangelogById = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createSafflowerNews = async (data: any) => {
    const response = await fetchRequest("/news/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerNews = async (id: number, data: any) => {
    const response = await fetchRequest(`/news/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerNews = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSafflowerChangelog = async (data: any) => {
    const response = await fetchRequest("/changelogs/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerChangelog = async (id: number, data: any) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerChangelog = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSafflowerRegion = async (data: any) => {
    const response = await fetchRequest("/regions/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerRegion = async (id: number, data: any) => {
    const response = await fetchRequest(`/regions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerRegion = async (id: number) => {
    const response = await fetchRequest(`/regions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSafflowerVariety = async (data: any) => {
    const response = await fetchRequest("/varieties/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerVariety = async (id: number, data: any) => {
    const response = await fetchRequest(`/varieties/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerVariety = async (id: number) => {
    const response = await fetchRequest(`/varieties/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSafflowerGene = async (data: any) => {
    const response = await fetchRequest("/genes/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerGene = async (id: number, data: any) => {
    const response = await fetchRequest(`/genes/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerGene = async (id: number) => {
    const response = await fetchRequest(`/genes/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSafflowerInstitution = async (data: any) => {
    const response = await fetchRequest("/institutions/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerInstitution = async (id: number, data: any) => {
    const response = await fetchRequest(`/institutions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerInstitution = async (id: number) => {
    const response = await fetchRequest(`/institutions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSafflowerAnnouncement = async (data: any) => {
    const response = await fetchRequest("/announcements/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerAnnouncement = async (id: number, data: any) => {
    const response = await fetchRequest(`/announcements/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerAnnouncement = async (id: number) => {
    const response = await fetchRequest(`/announcements/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSafflowerDownloadFile = async (data: any) => {
    const response = await fetchRequest("/download/files/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerDownloadFile = async (id: number, data: any) => {
    const response = await fetchRequest(`/download/files/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerDownloadFile = async (id: number) => {
    const response = await fetchRequest(`/download/files/${id}/`, "DELETE", undefined, true);
    return await response.json();
};


export const fetchSafflowerNutritionData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/nutrition-data/", params), "GET", undefined, true);
    return await response.json();
};

export const fetchSafflowerGlobalSearch = async (query: string) => {
    const response = await fetchRequest(`/search/?q=${encodeURIComponent(query)}`, "GET", undefined, true);
    return await response.json();
};

export const fetchSafflowerMarkerLoci = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/marker-loci/", params), "GET", undefined, true);
    return await response.json();
};

export const createSafflowerMarkerLocus = async (data: any) => {
    const response = await fetchRequest("/marker-loci/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerMarkerLocus = async (id: number, data: any) => {
    const response = await fetchRequest(`/marker-loci/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerMarkerLocus = async (id: number) => {
    const response = await fetchRequest(`/marker-loci/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerMolecularFingerprints = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/molecular-fingerprints/", params), "GET", undefined, true);
    return await response.json();
};

export const createSafflowerMolecularFingerprint = async (data: any) => {
    const response = await fetchRequest("/molecular-fingerprints/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerMolecularFingerprint = async (id: number, data: any) => {
    const response = await fetchRequest(`/molecular-fingerprints/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerMolecularFingerprint = async (id: number) => {
    const response = await fetchRequest(`/molecular-fingerprints/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerSequencingData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/sequencing-data/", params), "GET", undefined, true);
    return await response.json();
};

export const createSafflowerSequencingData = async (data: any) => {
    const response = await fetchRequest("/sequencing-data/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerSequencingData = async (id: number, data: any) => {
    const response = await fetchRequest(`/sequencing-data/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerSequencingData = async (id: number) => {
    const response = await fetchRequest(`/sequencing-data/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerGermplasmResources = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/germplasm-resources/", params), "GET", undefined, true);
    return await response.json();
};

export const createSafflowerGermplasmResource = async (data: any) => {
    const response = await fetchRequest("/germplasm-resources/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerGermplasmResource = async (id: number, data: any) => {
    const response = await fetchRequest(`/germplasm-resources/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerGermplasmResource = async (id: number) => {
    const response = await fetchRequest(`/germplasm-resources/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerGeneticDiversityAnalyses = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/genetic-diversity-analyses/", params), "GET", undefined, true);
    return await response.json();
};

export const createSafflowerGeneticDiversityAnalysis = async (data: any) => {
    const response = await fetchRequest("/genetic-diversity-analyses/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerGeneticDiversityAnalysis = async (id: number, data: any) => {
    const response = await fetchRequest(`/genetic-diversity-analyses/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerGeneticDiversityAnalysis = async (id: number) => {
    const response = await fetchRequest(`/genetic-diversity-analyses/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const batchCreateSafflowerRecords = async (entity: string, rows: any[]) => {
    const response = await fetchRequest(`/batch/${entity}/`, "POST", rows, true);
    return await response.json();
};

export const createSafflowerNutritionData = async (data: any) => {
    const response = await fetchRequest("/nutrition-data/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerNutritionData = async (id: number, data: any) => {
    const response = await fetchRequest(`/nutrition-data/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerNutritionData = async (id: number) => {
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

export const fetchChangelog = fetchSafflowerChangelogs;
export const fetchChangelogDetail = fetchSafflowerChangelogById;


export const fetchSafflowerRegionalMapSites = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-map-sites/", params), "GET", undefined, true);
    return await response.json();
};

export const createSafflowerRegionalMapSite = async (data: any) => {
    const response = await fetchRequest("/regional-map-sites/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerRegionalMapSite = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerRegionalMapSite = async (id: number) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSafflowerRegionalEnvironmentValues = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-environment-values/", params), "GET", undefined, true);
    return await response.json();
};

export const createSafflowerRegionalEnvironmentValue = async (data: any) => {
    const response = await fetchRequest("/regional-environment-values/", "POST", data, true);
    return await response.json();
};

export const updateSafflowerRegionalEnvironmentValue = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSafflowerRegionalEnvironmentValue = async (id: number) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const submitEventRegistration = async (data: any) => {
    const response = await fetchRequest("/api/event-registrations/", "POST", data);
    return response.json();
}

