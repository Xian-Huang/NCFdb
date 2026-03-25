const API_BASE_URL = '/api/';

function getCSRFToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export async function fetchRequest(endpoint: string, method: string, body?: any, autoAddUrl?: boolean) {
  let url = autoAddUrl ? `${API_BASE_URL}${endpoint}` : `${endpoint}`;
  const csrfToken = getCSRFToken();
  
  const headers: HeadersInit = {};

  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
  };
  
  if (body) {
    if (method.toUpperCase() === 'GET') {
      url = `${url}?${new URLSearchParams(body).toString()}`;
    } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
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
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }
  }

  // 只有在不包含文件时才设置headers
  if (!options.body || !(options.body instanceof FormData)) {
    options.headers = headers;
  }

  const response = await fetch(url, options);
  return response;
}
