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
export const fetchSafflowerDownloadFiles = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/download/files/", params), "GET");
  return await response.json();
};

export const fetchSafflowerRegions = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/regions/", params), "GET");
  return await response.json();
};

export const fetchSafflowerVarieties = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/varieties/", params), "GET");
  return await response.json();
};

export const fetchSafflowerGenes = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/genes/", params), "GET");
  return await response.json();
};

export const fetchSafflowerGeneExpressions = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/gene-expressions/", params), "GET");
  return await response.json();
};

export const createSafflowerGeneExpression = async (data: any) => {
  const response = await fetchRequest("/api/gene-expressions/", "POST", data);
  return await response.json();
};

export const updateSafflowerGeneExpression = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/gene-expressions/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerGeneExpression = async (id: number) => {
  const response = await fetchRequest(`/api/gene-expressions/${id}/`, "DELETE");
  return await response.json();
};

export const fetchSafflowerEnvironmentalFactors = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/environmental-factors/", params), "GET");
  return await response.json();
};

export const createSafflowerEnvironmentalFactor = async (data: any) => {
  const response = await fetchRequest("/api/environmental-factors/", "POST", data);
  return await response.json();
};

export const updateSafflowerEnvironmentalFactor = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/environmental-factors/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerEnvironmentalFactor = async (id: number) => {
  const response = await fetchRequest(`/api/environmental-factors/${id}/`, "DELETE");
  return await response.json();
};

export const fetchSafflowerInstitutions = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/institutions/", params), "GET");
  return await response.json();
};

export const fetchSafflowerAnnouncements = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/announcements/", params), "GET");
  return await response.json();
};

export const fetchSafflowerNews = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/news/", params), "GET");
  return await response.json();
};

export const fetchSafflowerScrollingNews = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/news/scrolling/", params), "GET");
  return await response.json();
};

export const fetchSafflowerNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "GET");
  return await response.json();
};

export const fetchSafflowerChangelogs = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/changelogs/", params), "GET");
  return await response.json();
};

export const fetchSafflowerChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "GET");
  return await response.json();
};

export const fetchSafflowerChangelog = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/changelogs/", params), "GET");
  return await response.json();
};

export const createSafflowerNews = async (data: any) => {
  const response = await fetchRequest("/api/news/", "POST", data);
  return await response.json();
};

export const updateSafflowerNews = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/news/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerNews = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "DELETE");
  return await response.json();
};

export const createSafflowerChangelog = async (data: any) => {
  const response = await fetchRequest("/api/changelogs/", "POST", data);
  return await response.json();
};

export const updateSafflowerChangelog = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerChangelog = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "DELETE");
  return await response.json();
};

export const createSafflowerRegion = async (data: any) => {
  const response = await fetchRequest("/api/regions/", "POST", data);
  return await response.json();
};

export const updateSafflowerRegion = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regions/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerRegion = async (id: number) => {
  const response = await fetchRequest(`/api/regions/${id}/`, "DELETE");
  return await response.json();
};

export const createSafflowerVariety = async (data: any) => {
  const response = await fetchRequest("/api/varieties/", "POST", data);
  return await response.json();
};

export const updateSafflowerVariety = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/varieties/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerVariety = async (id: number) => {
  const response = await fetchRequest(`/api/varieties/${id}/`, "DELETE");
  return await response.json();
};

export const createSafflowerGene = async (data: any) => {
  const response = await fetchRequest("/api/genes/", "POST", data);
  return await response.json();
};

export const updateSafflowerGene = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/genes/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerGene = async (id: number) => {
  const response = await fetchRequest(`/api/genes/${id}/`, "DELETE");
  return await response.json();
};

export const createSafflowerInstitution = async (data: any) => {
  const response = await fetchRequest("/api/institutions/", "POST", data);
  return await response.json();
};

export const updateSafflowerInstitution = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/institutions/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerInstitution = async (id: number) => {
  const response = await fetchRequest(`/api/institutions/${id}/`, "DELETE");
  return await response.json();
};

export const createSafflowerAnnouncement = async (data: any) => {
  const response = await fetchRequest("/api/announcements/", "POST", data);
  return await response.json();
};

export const updateSafflowerAnnouncement = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/announcements/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerAnnouncement = async (id: number) => {
  const response = await fetchRequest(`/api/announcements/${id}/`, "DELETE");
  return await response.json();
};

export const createSafflowerDownloadFile = async (data: any) => {
  const response = await fetchRequest("/api/download/files/", "POST", data);
  return await response.json();
};

export const updateSafflowerDownloadFile = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/download/files/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerDownloadFile = async (id: number) => {
  const response = await fetchRequest(`/api/download/files/${id}/`, "DELETE");
  return await response.json();
};


export const fetchSafflowerNutritionData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/nutrition-data/", params), "GET", undefined, true);
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

export const fetchChangelog = fetchSafflowerChangelog;
export const fetchChangelogDetail = fetchSafflowerChangelogById;


export const fetchSafflowerRegionalMapSites = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/regional-map-sites/", params), "GET");
  return await response.json();
};

export const createSafflowerRegionalMapSite = async (data: any) => {
  const response = await fetchRequest("/api/regional-map-sites/", "POST", data);
  return await response.json();
};

export const updateSafflowerRegionalMapSite = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regional-map-sites/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerRegionalMapSite = async (id: number) => {
  const response = await fetchRequest(`/api/regional-map-sites/${id}/`, "DELETE");
  return await response.json();
};

export const fetchSafflowerRegionalEnvironmentValues = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/regional-environment-values/", params), "GET");
  return await response.json();
};

export const createSafflowerRegionalEnvironmentValue = async (data: any) => {
  const response = await fetchRequest("/api/regional-environment-values/", "POST", data);
  return await response.json();
};

export const updateSafflowerRegionalEnvironmentValue = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regional-environment-values/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteSafflowerRegionalEnvironmentValue = async (id: number) => {
  const response = await fetchRequest(`/api/regional-environment-values/${id}/`, "DELETE");
  return await response.json();
};
