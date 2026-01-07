import { useEffect, useState } from "react";
import { fetchProductBySlug } from "../api/catalog.api";
import type { CatalogProductPdpResponse } from "../api/catalog.types";

export function useProduct(slug?: string) {
    const [data, setData] = useState<CatalogProductPdpResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (typeof slug !== "string" || slug.length === 0) {
            return;
        }

        let cancelled = false;

        async function load(validSlug: string) {
            try {
                setLoading(true);
                const res = await fetchProductBySlug(validSlug);
                if (!cancelled) setData(res);
            } catch (err) {
                if (!cancelled) setError(err as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load(slug);

        return () => {
            cancelled = true;
        };
    }, [slug]);

    return { data, loading, error };
}
