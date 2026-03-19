//封装fetch,携带csrftoken,不做相应处理，直接返回json数据
// get和post 请求区分，get请求不携带body，post请求携带body

export const fetchRequest = async (url: string, method: string, body?: any) => {
    if (method === "GET") {
        return fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (method === "POST") {
        return fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    throw new Error("不支持的请求方法");
}