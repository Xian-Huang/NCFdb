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

export const createSesameNews = async (data: any) => {
    const response = await fetchRequest("/news/", "POST", data);
    return await response.json();
};

export const updateSesameNews = async (id: number, data: any) => {
    const response = await fetchRequest(`/news/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameNews = async (id: number) => {
    const response = await fetchRequest(`/news/${id}/`, "DELETE");
    return await response.json();
};

export const createSesameChangelog = async (data: any) => {
    const response = await fetchRequest("/changelogs/", "POST", data);
    return await response.json();
};

export const updateSesameChangelog = async (id: number, data: any) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameChangelog = async (id: number) => {
    const response = await fetchRequest(`/changelogs/${id}/`, "DELETE");
    return await response.json();
};

export const createSesameRegion = async (data: any) => {
    const response = await fetchRequest("/regions/", "POST", data);
    return await response.json();
};

export const updateSesameRegion = async (id: number, data: any) => {
    const response = await fetchRequest(`/regions/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameRegion = async (id: number) => {
    const response = await fetchRequest(`/regions/${id}/`, "DELETE");
    return await response.json();
};

export const createSesameVariety = async (data: any) => {
    const response = await fetchRequest("/varieties/", "POST", data);
    return await response.json();
};

export const updateSesameVariety = async (id: number, data: any) => {
    const response = await fetchRequest(`/varieties/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameVariety = async (id: number) => {
    const response = await fetchRequest(`/varieties/${id}/`, "DELETE");
    return await response.json();
};

export const createSesameGene = async (data: any) => {
    const response = await fetchRequest("/genes/", "POST", data);
    return await response.json();
};

export const updateSesameGene = async (id: number, data: any) => {
    const response = await fetchRequest(`/genes/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameGene = async (id: number) => {
    const response = await fetchRequest(`/genes/${id}/`, "DELETE");
    return await response.json();
};

export const createSesameInstitution = async (data: any) => {
    const response = await fetchRequest("/institutions/", "POST", data);
    return await response.json();
};

export const updateSesameInstitution = async (id: number, data: any) => {
    const response = await fetchRequest(`/institutions/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameInstitution = async (id: number) => {
    const response = await fetchRequest(`/institutions/${id}/`, "DELETE");
    return await response.json();
};

export const createSesameAnnouncement = async (data: any) => {
    const response = await fetchRequest("/announcements/", "POST", data);
    return await response.json();
};

export const updateSesameAnnouncement = async (id: number, data: any) => {
    const response = await fetchRequest(`/announcements/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameAnnouncement = async (id: number) => {
    const response = await fetchRequest(`/announcements/${id}/`, "DELETE");
    return await response.json();
};

export const createSesameDownloadFile = async (data: any) => {
    const response = await fetchRequest("/download/files/", "POST", data);
    return await response.json();
};

export const updateSesameDownloadFile = async (id: number, data: any) => {
    const response = await fetchRequest(`/download/files/${id}/`, "PUT", data);
    return await response.json();
};

export const deleteSesameDownloadFile = async (id: number) => {
    const response = await fetchRequest(`/download/files/${id}/`, "DELETE");
    return await response.json();
};
