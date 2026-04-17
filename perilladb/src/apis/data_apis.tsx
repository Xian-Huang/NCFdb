import { fetchRequest } from "./https";

export const fetchPerillaDownloadFiles = async () => {
  const response = await fetchRequest("/api/download/files/", "GET");
  return await response.json();
};

export const fetchPerillaRegions = async () => {
  const response = await fetchRequest("/api/regions/", "GET");
  return await response.json();
};

export const fetchPerillaVarieties = async () => {
  const response = await fetchRequest("/api/varieties/", "GET");
  return await response.json();
};

export const fetchPerillaGenes = async () => {
  const response = await fetchRequest("/api/genes/", "GET");
  return await response.json();
};

export const fetchPerillaGeneExpressions = async () => {
  const response = await fetchRequest("/api/gene-expressions/", "GET");
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

export const fetchPerillaEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/environmental-factors/", "GET");
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

export const fetchPerillaInstitutions = async () => {
  const response = await fetchRequest("/api/institutions/", "GET");
  return await response.json();
};

export const fetchPerillaAnnouncements = async () => {
  const response = await fetchRequest("/api/announcements/", "GET");
  return await response.json();
};

export const fetchPerillaNews = async () => {
  const response = await fetchRequest("/api/news/", "GET");
  return await response.json();
};

export const fetchPerillaScrollingNews = async () => {
  const response = await fetchRequest("/api/news/scrolling/", "GET");
  return await response.json();
};

export const fetchPerillaNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/news/${id}/`, "GET");
  return await response.json();
};

export const fetchPerillaChangelogs = async () => {
  const response = await fetchRequest("/api/changelogs/", "GET");
  return await response.json();
};

export const fetchPerillaChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/changelogs/${id}/`, "GET");
  return await response.json();
};

export const fetchChangelog = async () => {
  const response = await fetchRequest("/api/changelogs/", "GET");
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
