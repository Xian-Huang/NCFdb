import { fetchRequest } from "./https";


// 登录接口
export const fetchloginPerillaRegions = async ({username, password}: {username: string, password: string }) => {
    return await fetchRequest("/api/users/login/", "POST", { username, password }, false);
}
