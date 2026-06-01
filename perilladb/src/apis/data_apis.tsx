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
export const fetchPerillaDownloadFiles = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/download/files/", params), "GET");
  return await response.json();
};

export const fetchPerillaRegions = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/regions/", params), "GET");
  return await response.json();
};

export const fetchPerillaVarieties = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/varieties/", params), "GET");
  return await response.json();
};

export const fetchPerillaGenes = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/genes/", params), "GET");
  return await response.json();
};

export const fetchPerillaGeneExpressions = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/gene-expressions/", params), "GET");
  return await response.json();
};

export const createPerillaGeneExpression = async (data: any) => {
  const response = await fetchRequest("/api/gene-expressions/", "POST", data);
  return await response.json();
};

export const updatePerillaGeneExpression = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/gene-expressions/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaGeneExpression = async (id: number) => {
  const response = await fetchRequest(`/api/gene-expressions/${id}/`, "DELETE");
  return await response.json();
};

export const fetchPerillaEnvironmentalFactors = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/environmental-factors/", params), "GET");
  return await response.json();
};

export const createPerillaEnvironmentalFactor = async (data: any) => {
  const response = await fetchRequest("/api/environmental-factors/", "POST", data);
  return await response.json();
};

export const updatePerillaEnvironmentalFactor = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/environmental-factors/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaEnvironmentalFactor = async (id: number) => {
  const response = await fetchRequest(`/api/environmental-factors/${id}/`, "DELETE");
  return await response.json();
};

export const fetchPerillaInstitutions = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/institutions/", params), "GET");
  return await response.json();
};

export const fetchPerillaAnnouncements = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/announcements/", params), "GET");
  return await response.json();
};

export const fetchPerillaNews = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/news/", params), "GET");
  return await response.json();
};

export const fetchPerillaScrollingNews = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/news/scrolling/", params), "GET");
  return await response.json();
};

export const fetchPerillaNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "GET");
  return await response.json();
};

export const fetchPerillaChangelogs = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/changelogs/", params), "GET");
  return await response.json();
};

export const fetchPerillaChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "GET");
  return await response.json();
};

export const fetchChangelog = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/changelogs/", params), "GET");
  return await response.json();
};

export const fetchChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "GET");
  return await response.json();
};

export const createPerillaNews = async (data: any) => {
  const response = await fetchRequest("/api/news/", "POST", data);
  return await response.json();
};

export const updatePerillaNews = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/news/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaNews = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "DELETE");
  return await response.json();
};

export const createPerillaChangelog = async (data: any) => {
  const response = await fetchRequest("/api/changelogs/", "POST", data);
  return await response.json();
};

export const updatePerillaChangelog = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaChangelog = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "DELETE");
  return await response.json();
};

export const createPerillaRegion = async (data: any) => {
  const response = await fetchRequest("/api/regions/", "POST", data);
  return await response.json();
};

export const updatePerillaRegion = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regions/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaRegion = async (id: number) => {
  const response = await fetchRequest(`/api/regions/${id}/`, "DELETE");
  return await response.json();
};

export const createPerillaVariety = async (data: any) => {
  const response = await fetchRequest("/api/varieties/", "POST", data);
  return await response.json();
};

export const updatePerillaVariety = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/varieties/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaVariety = async (id: number) => {
  const response = await fetchRequest(`/api/varieties/${id}/`, "DELETE");
  return await response.json();
};

export const createPerillaGene = async (data: any) => {
  const response = await fetchRequest("/api/genes/", "POST", data);
  return await response.json();
};

export const updatePerillaGene = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/genes/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaGene = async (id: number) => {
  const response = await fetchRequest(`/api/genes/${id}/`, "DELETE");
  return await response.json();
};

export const createPerillaInstitution = async (data: any) => {
  const response = await fetchRequest("/api/institutions/", "POST", data);
  return await response.json();
};

export const updatePerillaInstitution = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/institutions/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaInstitution = async (id: number) => {
  const response = await fetchRequest(`/api/institutions/${id}/`, "DELETE");
  return await response.json();
};

export const createPerillaAnnouncement = async (data: any) => {
  const response = await fetchRequest("/api/announcements/", "POST", data);
  return await response.json();
};

export const updatePerillaAnnouncement = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/announcements/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaAnnouncement = async (id: number) => {
  const response = await fetchRequest(`/api/announcements/${id}/`, "DELETE");
  return await response.json();
};

export const createPerillaDownloadFile = async (data: any) => {
  const response = await fetchRequest("/api/download/files/", "POST", data);
  return await response.json();
};

export const updatePerillaDownloadFile = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/download/files/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaDownloadFile = async (id: number) => {
  const response = await fetchRequest(`/api/download/files/${id}/`, "DELETE");
  return await response.json();
};


export const fetchPerillaNutritionData = async (params?: ListParams) => {
    const response = await fetchRequest(withListParams("/nutrition-data/", params), "GET", undefined, true);
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

export const fetchChangelogDetail = fetchPerillaChangelogById;


export const fetchPerillaRegionalMapSites = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/regional-map-sites/", params), "GET");
  return await response.json();
};

export const createPerillaRegionalMapSite = async (data: any) => {
  const response = await fetchRequest("/api/regional-map-sites/", "POST", data);
  return await response.json();
};

export const updatePerillaRegionalMapSite = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regional-map-sites/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaRegionalMapSite = async (id: number) => {
  const response = await fetchRequest(`/api/regional-map-sites/${id}/`, "DELETE");
  return await response.json();
};

export const fetchPerillaRegionalEnvironmentValues = async (params?: ListParams) => {
  const response = await fetchRequest(withListParams("/api/regional-environment-values/", params), "GET");
  return await response.json();
};

export const createPerillaRegionalEnvironmentValue = async (data: any) => {
  const response = await fetchRequest("/api/regional-environment-values/", "POST", data);
  return await response.json();
};

export const updatePerillaRegionalEnvironmentValue = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regional-environment-values/${id}/`, "PUT", data);
  return await response.json();
};

export const deletePerillaRegionalEnvironmentValue = async (id: number) => {
  const response = await fetchRequest(`/api/regional-environment-values/${id}/`, "DELETE");
  return await response.json();
};
