const BASE_URL = "http://localhost:8000/api"

async function getAuthHeaders() {
  const token = localStorage.getItem("access_token")
  return {
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  }
}

export const api = {
  async get(endpoint: string) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers })
    if (!response.ok) throw new Error(`GET ${endpoint} failed`)
    return response.json()
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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `POST ${endpoint} failed`)
    }
    return response.json()
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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `PATCH ${endpoint} failed`)
    }
    return response.json()
  },

  async delete(endpoint: string) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    })
    if (!response.ok) throw new Error(`DELETE ${endpoint} failed`)
    return response.status === 204 ? null : response.json()
  },
}
