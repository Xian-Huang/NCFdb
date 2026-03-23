const API_BASE_URL = '/api/sesame';

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
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };
  
  if (method.toUpperCase() === 'POST'&&body) {
    options.body = JSON.stringify(body);
  } else if (method.toUpperCase() === 'GET'&&body) {
     url = `${url}?${new URLSearchParams(body).toString()}`;
  }

  const response = await fetch(url, options);
  return response;
}
