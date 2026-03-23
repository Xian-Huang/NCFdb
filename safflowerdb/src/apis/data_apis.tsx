import { fetchRequest } from "./https";

export const fetchSafflowerDownloadFiles = async () => {
  const response = await fetchRequest("/api/safflower/download/files/", "GET");
  return await response.json();
};

export const fetchSafflowerRegions = async () => {
  const response = await fetchRequest("/api/safflower/regions/", "GET");
  return await response.json();
};

export const fetchSafflowerVarieties = async () => {
  const response = await fetchRequest("/api/safflower/varieties/", "GET");
  return await response.json();
};

export const fetchSafflowerGenes = async () => {
  const response = await fetchRequest("/api/safflower/genes/", "GET");
  return await response.json();
};

export const fetchSafflowerGeneExpressions = async () => {
  const response = await fetchRequest("/api/safflower/gene-expressions/", "GET");
  return await response.json();
};

export const fetchSafflowerEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/safflower/environmental-factors/", "GET");
  return await response.json();
};

export const fetchSafflowerInstitutions = async () => {
  const response = await fetchRequest("/api/safflower/institutions/", "GET");
  return await response.json();
};

export const fetchSafflowerAnnouncements = async () => {
  const response = await fetchRequest("/api/safflower/announcements/", "GET");
  return await response.json();
};

export const fetchSafflowerNews = async () => {
  const response = await fetchRequest("/api/safflower/news/", "GET");
  return await response.json();
};

export const fetchSafflowerNewsById = async (id: number) => {
  const response = await fetchRequest(`/api/safflower/news/${id}/`, "GET");
  return await response.json();
};

export const fetchSafflowerChangelogs = async () => {
  const response = await fetchRequest("/api/safflower/changelogs/", "GET");
  return await response.json();
};

export const fetchSafflowerChangelogById = async (id: number) => {
  const response = await fetchRequest(`/api/safflower/changelogs/${id}/`, "GET");
  return await response.json();
};
