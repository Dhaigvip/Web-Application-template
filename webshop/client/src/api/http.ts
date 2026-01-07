/**
 * Minimal fetch wrapper with:
 * - typed JSON responses
 * - query support via URLSearchParams (callers build params)
 * - predictable error handling
 *
 * Configure base URL with:
 *   VITE_API_URL=http://localhost:4200
 */
const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:4200";



export class ApiError extends Error {
    status: number;
    bodyText?: string;

    constructor(message: string, status: number, bodyText?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.bodyText = bodyText;
    }
}

type HttpOptions = RequestInit & {
    /**
     * Optional API key for B2B visibility, if you want to test it in dev.
     * This will set the `x-api-key` header when provided.
     */
    apiKey?: string;
};

export async function http<T>(path: string, options?: HttpOptions): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    const headers = new Headers(options?.headers ?? {});
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    if (options?.apiKey) {
        headers.set("x-api-key", options.apiKey);
    }

    const res = await fetch(url, {
        ...options,
        headers
    });

    if (!res.ok) {
        // Try to capture response body text for debugging (without assuming JSON)
        let bodyText: string | undefined;
        try {
            bodyText = await res.text();
        } catch {
            bodyText = undefined;
        }
        throw new ApiError(`Request failed: ${res.status} ${res.statusText}`, res.status, bodyText);
    }

    // Some endpoints might return 204 in future; handle it safely.
    if (res.status === 204) return undefined as unknown as T;

    return (await res.json()) as T;
}
