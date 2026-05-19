//封装fetch,携带csrftoken,不做相应处理，直接返回json数据
// 支持所有常用的HTTP方法

export const fetchRequest = async (url: string, method: string, body?: any) => {
    const options: RequestInit = {
        method,
    };
    
    // 对于需要携带body的方法，添加body
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
        // 检查是否包含文件
        const hasFile = Object.values(body).some(value => value instanceof File);
        
        if (hasFile) {
            // 使用FormData处理文件上传
            const formData = new FormData();
            Object.entries(body).forEach(([key, value]) => {
                formData.append(key, value);
            });
            options.body = formData;
            // 不设置Content-Type，让浏览器自动设置
        } else {
            // 普通JSON数据
            options.headers = {
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(body);
        }
    }
    
    const response = await fetch(url, options);
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
    }
    return response;
}
