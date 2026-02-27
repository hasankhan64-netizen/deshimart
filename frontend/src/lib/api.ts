const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiClient = {
  async get<T = any>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${API_BASE}${path}`);
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || "Request failed" };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  },

  async post<T = any>(path: string, body: any): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || "Request failed" };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  },
};
