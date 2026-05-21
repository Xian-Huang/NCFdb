import { fetchRequest } from "./https";

export const fetchSafflowerDownloadFiles = async () => {
  const response = await fetchRequest("/api/download/files/", "GET");
  return await response.json();
};

export const fetchSafflowerRegions = async () => {
  const response = await fetchRequest("/api/regions/", "GET");
  return await response.json();
};

export const fetchSafflowerVarieties = async () => {
  const response = await fetchRequest("/api/varieties/", "GET");
  return await response.json();
};

export const fetchSafflowerGenes = async () => {
  const response = await fetchRequest("/api/genes/", "GET");
  return await response.json();
};

export const fetchSafflowerGeneExpressions = async () => {
  const response = await fetchRequest("/api/gene-expressions/", "GET");
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

export const fetchSafflowerEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/environmental-factors/", "GET");
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

export const fetchSafflowerInstitutions = async () => {
  const response = await fetchRequest("/api/institutions/", "GET");
  return await response.json();
};

export const fetchSafflowerAnnouncements = async () => {
  const response = await fetchRequest("/api/announcements/", "GET");
  return await response.json();
};

export const fetchSafflowerNews = async () => {
  const response = await fetchRequest("/api/news/", "GET");
  return await response.json();
};

export const fetchSafflowerScrollingNews = async () => {
  const response = await fetchRequest("/api/news/scrolling/", "GET");
  return await response.json();
};

export const fetchSafflowerNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "GET");
  return await response.json();
};

export const fetchSafflowerChangelogs = async () => {
  const response = await fetchRequest("/api/changelogs/", "GET");
  return await response.json();
};

export const fetchSafflowerChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "GET");
  return await response.json();
};

export const fetchSafflowerChangelog = async () => {
  const response = await fetchRequest("/api/changelogs/", "GET");
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


export const fetchSafflowerNutritionData = async () => {
    const response = await fetchRequest("/nutrition-data/", "GET", undefined, true);
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
