//  Data 页面的API接口
import { fetchRequest } from "./https";

export const fetchDownloadFiles = async () => {
    const response = await fetchRequest("/api/sunflower/download/files/", "GET");
    const data = await response.json();
    return data;
}