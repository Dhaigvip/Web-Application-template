const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function http<T>(input: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API_BASE}${input}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init.headers ?? {})
        }
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Request failed");
    }

    return res.json() as Promise<T>;
}
