const BASE_URL = "http://localhost:8000/api"

async function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse(response: Response, endpoint: string) {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    throw new Error("نشست شما منقضی شده است. لطفا دوباره وارد شوید.")
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || errorData.error || `${response.status} ${endpoint} failed`)
  }

  return response.status === 204 ? null : response.json()
}

export const api = {
  async get(endpoint: string) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers })
    return handleResponse(response, endpoint)
  },

  async post(endpoint: string, data: any) {
    const headers = await getAuthHeaders()
    const isFormData = data instanceof FormData
    
    const fetchOptions: RequestInit = {
      method: "POST",
      headers: isFormData ? { "Authorization": headers.Authorization } : headers,
      body: isFormData ? data : JSON.stringify(data),
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...fetchOptions })
    return handleResponse(response, endpoint)
  },

  async patch(endpoint: string, data: any) {
    const headers = await getAuthHeaders()
    const isFormData = data instanceof FormData

    const fetchOptions: RequestInit = {
      method: "PATCH",
      headers: isFormData ? { "Authorization": headers.Authorization } : headers,
      body: isFormData ? data : JSON.stringify(data),
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...fetchOptions })
    return handleResponse(response, endpoint)
  },

  async delete(endpoint: string) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    })
    return handleResponse(response, endpoint)
  },
}
