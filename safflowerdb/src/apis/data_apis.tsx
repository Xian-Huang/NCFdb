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

export const fetchSafflowerEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/environmental-factors/", "GET");
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

