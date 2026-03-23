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

export const fetchFlaxEnvironmentalFactors = async () => {
  const response = await fetchRequest("/api/environmental-factors/", "GET");
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