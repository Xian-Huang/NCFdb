import { fetchRequest } from "./https";

export const fetchSesameDownloadFiles = async () => {
    const response = await fetchRequest("/download/files/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameRegions = async () => {
    const response = await fetchRequest("/regions/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameVarieties = async () => {
    const response = await fetchRequest("/varieties/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameGenes = async () => {
    const response = await fetchRequest("/genes/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameGeneExpressions = async () => {
    const response = await fetchRequest("/gene-expressions/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameEnvironmentalFactors = async () => {
    const response = await fetchRequest("/environmental-factors/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameInstitutions = async () => {
    const response = await fetchRequest("/institutions/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameAnnouncements = async () => {
    const response = await fetchRequest("/announcements/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameNews = async () => {
    const response = await fetchRequest("/news/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameNewsById = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameChangelogs = async () => {
    const response = await fetchRequest("/changelogs/", "GET");
    const data = await response.json();
    return data;
}

export const fetchSesameChangelogById = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "GET");
    const data = await response.json();
    return data;
}
