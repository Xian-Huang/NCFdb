// Data 页面的API接口
import { fetchRequest } from "./https";

export const fetchDownloadFiles = async () => {
    const response = await fetchRequest("/api/download/files/", "GET");
    const data = await response.json();
    return data;
}

export const fetchChangelog = async () => {
    const response = await fetchRequest("/api/changelog/", "GET");
    const data = await response.json();
    return data;
}

export const fetchNews = async () => {
    const response = await fetchRequest("/api/news/", "GET");
    const data = await response.json();
    return data;
}

export const fetchNewsDetail = async (id: number) => {
    const response = await fetchRequest(`/api/news/${id}/`, "GET");
    const data = await response.json();
    return data;
}

export const fetchScrollingNews = async () => {
    const response = await fetchRequest("/api/news/scrolling/", "GET");
    return response.json();
}

export const fetchChangelogDetail = async (id: number) => {
    const response = await fetchRequest(`/api/changelog/${id}/`, "GET");
    const data = await response.json();
    return data;
}

// ============ Admin APIs ============

export const fetchUsers = async () => {
    const response = await fetchRequest("/api/users/", "GET");
    return response.json();
}

export const createUser = async (data: any) => {
    const response = await fetchRequest("/api/users/", "POST", data);
    return response.json();
}

export const updateUser = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/users/${id}/`, "PUT", data);
    return response.json();
}

export const deleteUser = async (id: number) => {
    await fetchRequest(`/api/users/${id}/`, "DELETE");
}

export const createNews = async (data: any) => {
    const response = await fetchRequest("/api/news/", "POST", data);
    return response.json();
}

export const updateNews = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/news/${id}/`, "PUT", data);
    return response.json();
}

export const deleteNews = async (id: number) => {
    await fetchRequest(`/api/news/${id}/`, "DELETE");
}

// Changelog
export const createChangelog = async (data: any) => {
    const response = await fetchRequest("/api/changelog/", "POST", data);
    return response.json();
}

export const updateChangelog = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/changelog/${id}/`, "PUT", data);
    return response.json();
}

export const deleteChangelog = async (id: number) => {
    await fetchRequest(`/api/changelog/${id}/`, "DELETE");
}

// Regions
export const fetchRegions = async () => {
    const response = await fetchRequest("/api/regions/", "GET");
    return response.json();
}

export const createRegion = async (data: any) => {
    const response = await fetchRequest("/api/regions/", "POST", data);
    return response.json();
}

export const updateRegion = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/regions/${id}/`, "PUT", data);
    return response.json();
}

export const deleteRegion = async (id: number) => {
    await fetchRequest(`/api/regions/${id}/`, "DELETE");
}

// Varieties
export const fetchVarieties = async () => {
    const response = await fetchRequest("/api/varieties/", "GET");
    return response.json();
}

export const createVariety = async (data: any) => {
    const response = await fetchRequest("/api/varieties/", "POST", data);
    return response.json();
}

export const updateVariety = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/varieties/${id}/`, "PUT", data);
    return response.json();
}

export const deleteVariety = async (id: number) => {
    await fetchRequest(`/api/varieties/${id}/`, "DELETE");
}

// Genes
export const fetchGenes = async () => {
    const response = await fetchRequest("/api/genes/", "GET");
    return response.json();
}

export const createGene = async (data: any) => {
    const response = await fetchRequest("/api/genes/", "POST", data);
    return response.json();
}

export const updateGene = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/genes/${id}/`, "PUT", data);
    return response.json();
}

export const deleteGene = async (id: number) => {
    await fetchRequest(`/api/genes/${id}/`, "DELETE");
}

// Gene Expressions
export const fetchGeneExpressions = async () => {
    const response = await fetchRequest("/api/gene-expressions/", "GET");
    return response.json();
}

export const createGeneExpression = async (data: any) => {
    const response = await fetchRequest("/api/gene-expressions/", "POST", data);
    return response.json();
}

export const updateGeneExpression = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/gene-expressions/${id}/`, "PUT", data);
    return response.json();
}

export const deleteGeneExpression = async (id: number) => {
    await fetchRequest(`/api/gene-expressions/${id}/`, "DELETE");
}

// Environmental Factors
export const fetchEnvironmentalFactors = async () => {
    const response = await fetchRequest("/api/environmental-factors/", "GET");
    return response.json();
}

export const createEnvironmentalFactor = async (data: any) => {
    const response = await fetchRequest("/api/environmental-factors/", "POST", data);
    return response.json();
}

export const updateEnvironmentalFactor = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/environmental-factors/${id}/`, "PUT", data);
    return response.json();
}

export const deleteEnvironmentalFactor = async (id: number) => {
    await fetchRequest(`/api/environmental-factors/${id}/`, "DELETE");
}

// Nutrition
export const fetchNutrition = async () => {
    const response = await fetchRequest("/api/nutrition/", "GET");
    return response.json();
}

export const createNutrition = async (data: any) => {
    const response = await fetchRequest("/api/nutrition/", "POST", data);
    return response.json();
}

export const updateNutrition = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/nutrition/${id}/`, "PUT", data);
    return response.json();
}

export const deleteNutrition = async (id: number) => {
    await fetchRequest(`/api/nutrition/${id}/`, "DELETE");
}

// Institutions
export const fetchInstitutions = async () => {
    const response = await fetchRequest("/api/institutions/", "GET");
    return response.json();
}

export const createInstitution = async (data: any) => {
    const response = await fetchRequest("/api/institutions/", "POST", data);
    return response.json();
}

export const updateInstitution = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/institutions/${id}/`, "PUT", data);
    return response.json();
}

export const deleteInstitution = async (id: number) => {
    await fetchRequest(`/api/institutions/${id}/`, "DELETE");
}

// Announcements
export const fetchAnnouncements = async () => {
    const response = await fetchRequest("/api/announcements/", "GET");
    return response.json();
}

export const createAnnouncement = async (data: any) => {
    const response = await fetchRequest("/api/announcements/", "POST", data);
    return response.json();
}

export const updateAnnouncement = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/announcements/${id}/`, "PUT", data);
    return response.json();
}

export const deleteAnnouncement = async (id: number) => {
    await fetchRequest(`/api/announcements/${id}/`, "DELETE");
}

// Download Files
export const createDownloadFile = async (data: any) => {
    const response = await fetchRequest("/api/download/files/", "POST", data);
    return response.json();
}

export const updateDownloadFile = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/download/files/${id}/`, "PUT", data);
    return response.json();
}

export const deleteDownloadFile = async (id: number) => {
    await fetchRequest(`/api/download/files/${id}/`, "DELETE");
}

export const fetchSunflowerNutritionData = async () => {
    const response = await fetchRequest("/api/nutrition-data/", "GET");
    return await response.json();
};

export const createSunflowerNutritionData = async (data: any) => {
    const response = await fetchRequest("/api/nutrition-data/", "POST", data);
    return await response.json();
};

export const updateSunflowerNutritionData = async (id: number, data: any) => {
    const response = await fetchRequest(`/api/nutrition-data/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSunflowerNutritionData = async (id: number) => {
    const response = await fetchRequest(`/api/nutrition-data/${id}/`, "DELETE");
    return await response.json();
};
