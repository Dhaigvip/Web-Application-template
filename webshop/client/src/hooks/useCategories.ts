import { useEffect, useState } from "react";
import { fetchCategoryTree } from "../api/catalog.api";
import type { CatalogCategoryTreeNode } from "../api/catalog.types";

export function useCategories() {
    const [data, setData] = useState<CatalogCategoryTreeNode[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        //Starts the async work
        // Does not block render
        // Keeps React lifecycle correct
        // Allows cleanup logic (cancelled) to work
        // ✔ This is the canonical pattern.

        async function load() {
            try {
                setLoading(true);
                const res = await fetchCategoryTree();
                if (!cancelled) setData(res);
            } catch (err) {
                if (!cancelled) setError(err as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        // This is cleanup function
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading, error };
}
