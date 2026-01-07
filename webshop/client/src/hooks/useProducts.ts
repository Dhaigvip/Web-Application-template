import { useEffect, useMemo, useRef, useState } from "react";
import { fetchProducts } from "../api/catalog.api";
import type { CatalogProductsQuery } from "../api/catalog.api";
import type { CatalogProductListResponse } from "../api/catalog.types";

export function useProducts(query: CatalogProductsQuery) {
    const [data, setData] = useState<CatalogProductListResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Store the latest query in a ref so useEffect
     * does not need to depend on the object itself.
     */
    const queryRef = useRef<CatalogProductsQuery>(query);

    useEffect(() => {
        queryRef.current = query;
    }, [query]);

    /**
     * Stable dependency key representing the *meaning*
     * of the query, not its object identity.
     */
    const queryKey = useMemo(() => {
        return JSON.stringify({
            category: query.category,
            q: query.q,
            attributes: query.attributes ?? {},
            priceMin: query.priceMin,
            priceMax: query.priceMax,
            sort: query.sort,
            page: query.page,
            pageSize: query.pageSize
        });
    }, [
        query.category,
        query.q,
        query.attributes,
        query.priceMin,
        query.priceMax,
        query.sort,
        query.page,
        query.pageSize
    ]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res = await fetchProducts(queryRef.current);
                if (!cancelled) setData(res);
            } catch (err) {
                if (!cancelled) setError(err as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [queryKey]);

    return { data, loading, error };
}
