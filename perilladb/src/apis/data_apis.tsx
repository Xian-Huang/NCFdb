import { fetchRequest } from "./https";

export const fetchPerillaDownloadFiles = async () => {
  const response = await fetchRequest("/api/perilla/download/files/", "GET");
  return await response.json();
};

export const fetchPerillaRegions = async () => {
  const response = await fetchRequest("/api/perilla/regions/", "GET");
  return await response.json();
};

export const fetchPerillaVarieties = async () => {
  const response = await fetchRequest("/api/perilla/varieties/", "GET");
  return await response.json();
};

export const fetchPerillaGenes = async () => {
  const response = await fetchRequest("/api/perilla/genes/", "GET");
  return await response.json();
};

export const fetchPerillaGeneExpressions = async () => {
  const response = await fetchRequest("/api/perilla/gene-expressions/", "GET");
  return await response.json();
};

export const fetchPerillaEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/perilla/environmental-factors/", "GET");
  return await response.json();
};

export const fetchPerillaInstitutions = async () => {
  const response = await fetchRequest("/api/perilla/institutions/", "GET");
  return await response.json();
};

export const fetchPerillaAnnouncements = async () => {
  const response = await fetchRequest("/api/perilla/announcements/", "GET");
  return await response.json();
};

export const fetchPerillaNews = async () => {
  const response = await fetchRequest("/api/perilla/news/", "GET");
  return await response.json();
};

export const fetchPerillaNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/perilla/news/${id}/`, "GET");
  return await response.json();
};

export const fetchPerillaChangelogs = async () => {
  const response = await fetchRequest("/api/perilla/changelogs/", "GET");
  return await response.json();
};

export const fetchPerillaChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/perilla/changelogs/${id}/`, "GET");
  return await response.json();
};
