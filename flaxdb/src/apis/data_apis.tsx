import { fetchRequest } from "./https";

export const fetchFlaxDownloadFiles = async () => {
  const response = await fetchRequest("/api/download/files/", "GET");
  return await response.json();
};

export const fetchFlaxRegions = async () => {
  const response = await fetchRequest("/api/regions/", "GET");
  return await response.json();
};

export const fetchFlaxVarieties = async () => {
  const response = await fetchRequest("/api/varieties/", "GET");
  return await response.json();
};

export const fetchFlaxGenes = async () => {
  const response = await fetchRequest("/api/genes/", "GET");
  return await response.json();
};

export const fetchFlaxGeneExpressions = async () => {
  const response = await fetchRequest("/api/gene-expressions/", "GET");
  return await response.json();
};

export const createFlaxGeneExpression = async (data: any) => {
  const response = await fetchRequest("/api/gene-expressions/", "POST", data);
  return await response.json();
};

export const updateFlaxGeneExpression = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/gene-expressions/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxGeneExpression = async (id: number) => {
  const response = await fetchRequest(`/api/gene-expressions/${id}/`, "DELETE");
  return await response.json();
};

export const fetchFlaxEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/environmental-factors/", "GET");
  return await response.json();
};

export const createFlaxEnvironmentalFactor = async (data: any) => {
  const response = await fetchRequest("/api/environmental-factors/", "POST", data);
  return await response.json();
};

export const updateFlaxEnvironmentalFactor = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/environmental-factors/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxEnvironmentalFactor = async (id: number) => {
  const response = await fetchRequest(`/api/environmental-factors/${id}/`, "DELETE");
  return await response.json();
};

export const fetchFlaxInstitutions = async () => {
  const response = await fetchRequest("/api/institutions/", "GET");
  return await response.json();
};

export const fetchFlaxAnnouncements = async () => {
  const response = await fetchRequest("/api/announcements/", "GET");
  return await response.json();
};

export const fetchFlaxNews = async () => {
  const response = await fetchRequest("/api/news/", "GET");
  return await response.json();
};

export const fetchFlaxScrollingNews = async () => {
  const response = await fetchRequest("/api/news/scrolling/", "GET");
  return await response.json();
};

export const fetchFlaxNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "GET");
  return await response.json();
};

export const fetchFlaxChangelogs = async () => {
  const response = await fetchRequest("/api/changelogs/", "GET");
  return await response.json();
};

export const fetchFlaxChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "GET");
  return await response.json();
};

export const fetchChangelog = async () => {
  const response = await fetchRequest("/api/changelogs/", "GET");
  return await response.json();
};

export const createFlaxNews = async (data: any) => {
  const response = await fetchRequest("/api/news/", "POST", data);
  return await response.json();
};

export const updateFlaxNews = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/news/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxNews = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "DELETE");
  return await response.json();
};

export const createFlaxChangelog = async (data: any) => {
  const response = await fetchRequest("/api/changelogs/", "POST", data);
  return await response.json();
};

export const updateFlaxChangelog = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxChangelog = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "DELETE");
  return await response.json();
};

export const createFlaxRegion = async (data: any) => {
  const response = await fetchRequest("/api/regions/", "POST", data);
  return await response.json();
};

export const updateFlaxRegion = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regions/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxRegion = async (id: number) => {
  const response = await fetchRequest(`/api/regions/${id}/`, "DELETE");
  return await response.json();
};

export const createFlaxVariety = async (data: any) => {
  const response = await fetchRequest("/api/varieties/", "POST", data);
  return await response.json();
};

export const updateFlaxVariety = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/varieties/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxVariety = async (id: number) => {
  const response = await fetchRequest(`/api/varieties/${id}/`, "DELETE");
  return await response.json();
};

export const createFlaxGene = async (data: any) => {
  const response = await fetchRequest("/api/genes/", "POST", data);
  return await response.json();
};

export const updateFlaxGene = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/genes/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxGene = async (id: number) => {
  const response = await fetchRequest(`/api/genes/${id}/`, "DELETE");
  return await response.json();
};

export const createFlaxInstitution = async (data: any) => {
  const response = await fetchRequest("/api/institutions/", "POST", data);
  return await response.json();
};

export const updateFlaxInstitution = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/institutions/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxInstitution = async (id: number) => {
  const response = await fetchRequest(`/api/institutions/${id}/`, "DELETE");
  return await response.json();
};

export const createFlaxAnnouncement = async (data: any) => {
  const response = await fetchRequest("/api/announcements/", "POST", data);
  return await response.json();
};

export const updateFlaxAnnouncement = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/announcements/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxAnnouncement = async (id: number) => {
  const response = await fetchRequest(`/api/announcements/${id}/`, "DELETE");
  return await response.json();
};

export const createFlaxDownloadFile = async (data: any) => {
  const response = await fetchRequest("/api/download/files/", "POST", data);
  return await response.json();
};

export const updateFlaxDownloadFile = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/download/files/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxDownloadFile = async (id: number) => {
  const response = await fetchRequest(`/api/download/files/${id}/`, "DELETE");
  return await response.json();
};


export const fetchFlaxNutritionData = async () => {
    const response = await fetchRequest("/nutrition-data/", "GET", undefined, true);
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

export const fetchDownloadFiles = async () => {
  const response = await fetch("/api/download/files/");
  if (!response.ok) throw new Error("download files");
  return response.json();
};

export const fetchNews = async () => {
  const response = await fetch("/api/news/");
  if (!response.ok) throw new Error("news");
  return response.json();
};

export const fetchNewsDetail = async (id: number) => {
  const response = await fetch(`/api/news/${id}/`);
  if (!response.ok) throw new Error("news detail");
  return response.json();
};

export const fetchScrollingNews = async () => {
  const response = await fetch("/api/news/scrolling/");
  if (!response.ok) throw new Error("scrolling news");
  return response.json();
};

export const fetchChangelogDetail = fetchFlaxChangelogById;


export const fetchFlaxRegionalMapSites = async () => {
  const response = await fetchRequest("/api/regional-map-sites/", "GET");
  return await response.json();
};

export const createFlaxRegionalMapSite = async (data: any) => {
  const response = await fetchRequest("/api/regional-map-sites/", "POST", data);
  return await response.json();
};

export const updateFlaxRegionalMapSite = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regional-map-sites/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxRegionalMapSite = async (id: number) => {
  const response = await fetchRequest(`/api/regional-map-sites/${id}/`, "DELETE");
  return await response.json();
};

export const fetchFlaxRegionalEnvironmentValues = async () => {
  const response = await fetchRequest("/api/regional-environment-values/", "GET");
  return await response.json();
};

export const createFlaxRegionalEnvironmentValue = async (data: any) => {
  const response = await fetchRequest("/api/regional-environment-values/", "POST", data);
  return await response.json();
};

export const updateFlaxRegionalEnvironmentValue = async (id: number, data: any) => {
  const response = await fetchRequest(`/api/regional-environment-values/${id}/`, "PUT", data);
  return await response.json();
};

export const deleteFlaxRegionalEnvironmentValue = async (id: number) => {
  const response = await fetchRequest(`/api/regional-environment-values/${id}/`, "DELETE");
  return await response.json();
};
