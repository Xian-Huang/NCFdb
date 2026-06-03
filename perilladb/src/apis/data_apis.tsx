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
export const fetchPerillaDownloadFiles = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/download/files/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaRegions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaVarieties = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/varieties/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaGenes = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/genes/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaGeneAssociations = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/gene-associations/", params), "GET", undefined, true);
    return await response.json();
}

export const createPerillaGeneAssociation = async (data: any) => {
    const response = await fetchRequest("/gene-associations/", "POST", data, true);
    return await response.json();
};

export const updatePerillaGeneAssociation = async (id: number, data: any) => {
    const response = await fetchRequest(`/gene-associations/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaGeneAssociation = async (id: number) => {
    const response = await fetchRequest(`/gene-associations/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaGeneExpressions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/gene-expressions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createPerillaGeneExpression = async (data: any) => {
    const response = await fetchRequest("/gene-expressions/", "POST", data, true);
    return await response.json();
};

export const updatePerillaGeneExpression = async (id: number, data: any) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaGeneExpression = async (id: number) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaEnvironmentalFactors = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/environmental-factors/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createPerillaEnvironmentalFactor = async (data: any) => {
    const response = await fetchRequest("/environmental-factors/", "POST", data, true);
    return await response.json();
};

export const updatePerillaEnvironmentalFactor = async (id: number, data: any) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaEnvironmentalFactor = async (id: number) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaInstitutions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/institutions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaAnnouncements = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/announcements/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaScrollingNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/scrolling/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaNewsById = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaChangelogs = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/changelogs/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchPerillaChangelogById = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createPerillaNews = async (data: any) => {
    const response = await fetchRequest("/news/", "POST", data, true);
    return await response.json();
};

export const updatePerillaNews = async (id: number, data: any) => {
    const response = await fetchRequest(`/news/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaNews = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createPerillaChangelog = async (data: any) => {
    const response = await fetchRequest("/changelogs/", "POST", data, true);
    return await response.json();
};

export const updatePerillaChangelog = async (id: number, data: any) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaChangelog = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createPerillaRegion = async (data: any) => {
    const response = await fetchRequest("/regions/", "POST", data, true);
    return await response.json();
};

export const updatePerillaRegion = async (id: number, data: any) => {
    const response = await fetchRequest(`/regions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaRegion = async (id: number) => {
    const response = await fetchRequest(`/regions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createPerillaVariety = async (data: any) => {
    const response = await fetchRequest("/varieties/", "POST", data, true);
    return await response.json();
};

export const updatePerillaVariety = async (id: number, data: any) => {
    const response = await fetchRequest(`/varieties/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaVariety = async (id: number) => {
    const response = await fetchRequest(`/varieties/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createPerillaGene = async (data: any) => {
    const response = await fetchRequest("/genes/", "POST", data, true);
    return await response.json();
};

export const updatePerillaGene = async (id: number, data: any) => {
    const response = await fetchRequest(`/genes/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaGene = async (id: number) => {
    const response = await fetchRequest(`/genes/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createPerillaInstitution = async (data: any) => {
    const response = await fetchRequest("/institutions/", "POST", data, true);
    return await response.json();
};

export const updatePerillaInstitution = async (id: number, data: any) => {
    const response = await fetchRequest(`/institutions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaInstitution = async (id: number) => {
    const response = await fetchRequest(`/institutions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createPerillaAnnouncement = async (data: any) => {
    const response = await fetchRequest("/announcements/", "POST", data, true);
    return await response.json();
};

export const updatePerillaAnnouncement = async (id: number, data: any) => {
    const response = await fetchRequest(`/announcements/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaAnnouncement = async (id: number) => {
    const response = await fetchRequest(`/announcements/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createPerillaDownloadFile = async (data: any) => {
    const response = await fetchRequest("/download/files/", "POST", data, true);
    return await response.json();
};

export const updatePerillaDownloadFile = async (id: number, data: any) => {
    const response = await fetchRequest(`/download/files/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaDownloadFile = async (id: number) => {
    const response = await fetchRequest(`/download/files/${id}/`, "DELETE", undefined, true);
    return await response.json();
};


export const fetchPerillaNutritionData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/nutrition-data/", params), "GET", undefined, true);
    return await response.json();
};

export const fetchPerillaGlobalSearch = async (query: string) => {
    const response = await fetchRequest(`/search/?q=${encodeURIComponent(query)}`, "GET", undefined, true);
    return await response.json();
};

export const fetchPerillaMarkerLoci = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/marker-loci/", params), "GET", undefined, true);
    return await response.json();
};

export const createPerillaMarkerLocus = async (data: any) => {
    const response = await fetchRequest("/marker-loci/", "POST", data, true);
    return await response.json();
};

export const updatePerillaMarkerLocus = async (id: number, data: any) => {
    const response = await fetchRequest(`/marker-loci/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaMarkerLocus = async (id: number) => {
    const response = await fetchRequest(`/marker-loci/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaMolecularFingerprints = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/molecular-fingerprints/", params), "GET", undefined, true);
    return await response.json();
};

export const createPerillaMolecularFingerprint = async (data: any) => {
    const response = await fetchRequest("/molecular-fingerprints/", "POST", data, true);
    return await response.json();
};

export const updatePerillaMolecularFingerprint = async (id: number, data: any) => {
    const response = await fetchRequest(`/molecular-fingerprints/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaMolecularFingerprint = async (id: number) => {
    const response = await fetchRequest(`/molecular-fingerprints/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaSequencingData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/sequencing-data/", params), "GET", undefined, true);
    return await response.json();
};

export const createPerillaSequencingData = async (data: any) => {
    const response = await fetchRequest("/sequencing-data/", "POST", data, true);
    return await response.json();
};

export const updatePerillaSequencingData = async (id: number, data: any) => {
    const response = await fetchRequest(`/sequencing-data/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaSequencingData = async (id: number) => {
    const response = await fetchRequest(`/sequencing-data/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaGermplasmResources = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/germplasm-resources/", params), "GET", undefined, true);
    return await response.json();
};

export const createPerillaGermplasmResource = async (data: any) => {
    const response = await fetchRequest("/germplasm-resources/", "POST", data, true);
    return await response.json();
};

export const updatePerillaGermplasmResource = async (id: number, data: any) => {
    const response = await fetchRequest(`/germplasm-resources/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaGermplasmResource = async (id: number) => {
    const response = await fetchRequest(`/germplasm-resources/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaGeneticDiversityAnalyses = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/genetic-diversity-analyses/", params), "GET", undefined, true);
    return await response.json();
};

export const createPerillaGeneticDiversityAnalysis = async (data: any) => {
    const response = await fetchRequest("/genetic-diversity-analyses/", "POST", data, true);
    return await response.json();
};

export const updatePerillaGeneticDiversityAnalysis = async (id: number, data: any) => {
    const response = await fetchRequest(`/genetic-diversity-analyses/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaGeneticDiversityAnalysis = async (id: number) => {
    const response = await fetchRequest(`/genetic-diversity-analyses/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const batchCreatePerillaRecords = async (entity: string, rows: any[]) => {
    const response = await fetchRequest(`/batch/${entity}/`, "POST", rows, true);
    return await response.json();
};

export const createPerillaNutritionData = async (data: any) => {
    const response = await fetchRequest("/nutrition-data/", "POST", data, true);
    return await response.json();
};

export const updatePerillaNutritionData = async (id: number, data: any) => {
    const response = await fetchRequest(`/nutrition-data/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaNutritionData = async (id: number) => {
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

export const fetchChangelog = fetchPerillaChangelogs;
export const fetchChangelogDetail = fetchPerillaChangelogById;


export const fetchPerillaRegionalMapSites = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-map-sites/", params), "GET", undefined, true);
    return await response.json();
};

export const createPerillaRegionalMapSite = async (data: any) => {
    const response = await fetchRequest("/regional-map-sites/", "POST", data, true);
    return await response.json();
};

export const updatePerillaRegionalMapSite = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaRegionalMapSite = async (id: number) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchPerillaRegionalEnvironmentValues = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-environment-values/", params), "GET", undefined, true);
    return await response.json();
};

export const createPerillaRegionalEnvironmentValue = async (data: any) => {
    const response = await fetchRequest("/regional-environment-values/", "POST", data, true);
    return await response.json();
};

export const updatePerillaRegionalEnvironmentValue = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deletePerillaRegionalEnvironmentValue = async (id: number) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const submitEventRegistration = async (data: any) => {
    const response = await fetchRequest("/api/event-registrations/", "POST", data);
    return response.json();
}

