import { fetchRequest } from "./https";


type ListParams = { page?: number; pageSize?: number; search?: string; limit?: number };

const withListParams = (endpoint: string, params?: ListParams) => {
  if (!params) return endpoint;
  const [path, existingQuery = ""] = endpoint.split("?");
  const query = new URLSearchParams(existingQuery);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("page_size", String(params.pageSize));
  if (params.limit) query.set("limit", String(params.limit));
  const search = params.search?.trim();
  if (search) query.set("search", search);
  const queryString = query.toString();
  return queryString ? path + "?" + queryString : path;
};
export const fetchSesameDownloadFiles = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/download/files/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameRegions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameVarieties = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/varieties/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameGenes = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/genes/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameGeneExpressions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/gene-expressions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createSesameGeneExpression = async (data: any) => {
    const response = await fetchRequest("/gene-expressions/", "POST", data, true);
    return await response.json();
};

export const updateSesameGeneExpression = async (id: number, data: any) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameGeneExpression = async (id: number) => {
    const response = await fetchRequest(`/gene-expressions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSesameEnvironmentalFactors = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/environmental-factors/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createSesameEnvironmentalFactor = async (data: any) => {
    const response = await fetchRequest("/environmental-factors/", "POST", data, true);
    return await response.json();
};

export const updateSesameEnvironmentalFactor = async (id: number, data: any) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameEnvironmentalFactor = async (id: number) => {
    const response = await fetchRequest(`/environmental-factors/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSesameInstitutions = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/institutions/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameAnnouncements = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/announcements/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameScrollingNews = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/news/scrolling/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameNewsById = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameChangelogs = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/changelogs/", params), "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const fetchSesameChangelogById = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "GET", undefined, true);
    const data = await response.json();
    return data;
}

export const createSesameNews = async (data: any) => {
    const response = await fetchRequest("/news/", "POST", data, true);
    return await response.json();
};

export const updateSesameNews = async (id: number, data: any) => {
    const response = await fetchRequest(`/news/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameNews = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSesameChangelog = async (data: any) => {
    const response = await fetchRequest("/changelogs/", "POST", data, true);
    return await response.json();
};

export const updateSesameChangelog = async (id: number, data: any) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameChangelog = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSesameRegion = async (data: any) => {
    const response = await fetchRequest("/regions/", "POST", data, true);
    return await response.json();
};

export const updateSesameRegion = async (id: number, data: any) => {
    const response = await fetchRequest(`/regions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameRegion = async (id: number) => {
    const response = await fetchRequest(`/regions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSesameVariety = async (data: any) => {
    const response = await fetchRequest("/varieties/", "POST", data, true);
    return await response.json();
};

export const updateSesameVariety = async (id: number, data: any) => {
    const response = await fetchRequest(`/varieties/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameVariety = async (id: number) => {
    const response = await fetchRequest(`/varieties/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSesameGene = async (data: any) => {
    const response = await fetchRequest("/genes/", "POST", data, true);
    return await response.json();
};

export const updateSesameGene = async (id: number, data: any) => {
    const response = await fetchRequest(`/genes/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameGene = async (id: number) => {
    const response = await fetchRequest(`/genes/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSesameInstitution = async (data: any) => {
    const response = await fetchRequest("/institutions/", "POST", data, true);
    return await response.json();
};

export const updateSesameInstitution = async (id: number, data: any) => {
    const response = await fetchRequest(`/institutions/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameInstitution = async (id: number) => {
    const response = await fetchRequest(`/institutions/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSesameAnnouncement = async (data: any) => {
    const response = await fetchRequest("/announcements/", "POST", data, true);
    return await response.json();
};

export const updateSesameAnnouncement = async (id: number, data: any) => {
    const response = await fetchRequest(`/announcements/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameAnnouncement = async (id: number) => {
    const response = await fetchRequest(`/announcements/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const createSesameDownloadFile = async (data: any) => {
    const response = await fetchRequest("/download/files/", "POST", data, true);
    return await response.json();
};

export const updateSesameDownloadFile = async (id: number, data: any) => {
    const response = await fetchRequest(`/download/files/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameDownloadFile = async (id: number) => {
    const response = await fetchRequest(`/download/files/${id}/`, "DELETE", undefined, true);
    return await response.json();
};


export const fetchSesameNutritionData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/nutrition-data/", params), "GET", undefined, true);
    return await response.json();
};

export const createSesameNutritionData = async (data: any) => {
    const response = await fetchRequest("/nutrition-data/", "POST", data, true);
    return await response.json();
};

export const updateSesameNutritionData = async (id: number, data: any) => {
    const response = await fetchRequest(`/nutrition-data/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameNutritionData = async (id: number) => {
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

export const fetchChangelog = fetchSesameChangelogs;
export const fetchChangelogDetail = fetchSesameChangelogById;


export const fetchSesameRegionalMapSites = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-map-sites/", params), "GET", undefined, true);
    return await response.json();
};

export const createSesameRegionalMapSite = async (data: any) => {
    const response = await fetchRequest("/regional-map-sites/", "POST", data, true);
    return await response.json();
};

export const updateSesameRegionalMapSite = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameRegionalMapSite = async (id: number) => {
    const response = await fetchRequest(`/regional-map-sites/${id}/`, "DELETE", undefined, true);
    return await response.json();
};

export const fetchSesameRegionalEnvironmentValues = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/regional-environment-values/", params), "GET", undefined, true);
    return await response.json();
};

export const createSesameRegionalEnvironmentValue = async (data: any) => {
    const response = await fetchRequest("/regional-environment-values/", "POST", data, true);
    return await response.json();
};

export const updateSesameRegionalEnvironmentValue = async (id: number, data: any) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "PUT", data, true);
    return await response.json();
};

export const deleteSesameRegionalEnvironmentValue = async (id: number) => {
    const response = await fetchRequest(`/regional-environment-values/${id}/`, "DELETE", undefined, true);
    return await response.json();
};
