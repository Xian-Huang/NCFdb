import { fetchRequest } from "./https";

export const fetchFlaxDownloadFiles = async () => {
  const response = await fetchRequest("/api/flax/download/files/", "GET");
  return await response.json();
};

export const fetchFlaxRegions = async () => {
  const response = await fetchRequest("/api/flax/regions/", "GET");
  return await response.json();
};

export const fetchFlaxVarieties = async () => {
  const response = await fetchRequest("/api/flax/varieties/", "GET");
  return await response.json();
};

export const fetchFlaxGenes = async () => {
  const response = await fetchRequest("/api/flax/genes/", "GET");
  return await response.json();
};

export const fetchFlaxGeneExpressions = async () => {
  const response = await fetchRequest("/api/flax/gene-expressions/", "GET");
  return await response.json();
};

export const fetchFlaxEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/flax/environmental-factors/", "GET");
  return await response.json();
};

export const fetchFlaxInstitutions = async () => {
  const response = await fetchRequest("/api/flax/institutions/", "GET");
  return await response.json();
};

export const fetchFlaxAnnouncements = async () => {
  const response = await fetchRequest("/api/flax/announcements/", "GET");
  return await response.json();
};

export const fetchFlaxNews = async () => {
  const response = await fetchRequest("/api/flax/news/", "GET");
  return await response.json();
};

export const fetchFlaxNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/flax/news/${id}/`, "GET");
  return await response.json();
};

export const fetchFlaxChangelogs = async () => {
  const response = await fetchRequest("/api/flax/changelogs/", "GET");
  return await response.json();
};

export const fetchFlaxChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/flax/changelogs/${id}/`, "GET");
  return await response.json();
};
