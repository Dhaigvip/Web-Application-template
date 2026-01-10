const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = "v2";

export async function http<T>(input: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("admin_token");

    const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers as Record<string, string> ?? {})
    };

    // Only set Content-Type for non-FormData requests
    if (!(init.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}/${API_VERSION}${input}`, {
        ...init,
        headers
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Request failed");
    }

    return res.json() as Promise<T>;
}