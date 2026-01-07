import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryTree } from "../components/CategoryTree";
import { FacetFilters } from "../components/FacetFilters";
import { useProducts } from "../hooks/useProducts";
import type { CatalogProductsQuery } from "../api/catalog.api";

export type ProductListPageProps = {
    /**
     * Category path from routing, e.g. "electronics/phones"
     */
    categoryPath?: string;
};

export function ProductListPage({ categoryPath }: ProductListPageProps) {
    const navigate = useNavigate();

    // ---------------------------
    // STATE (only user-controlled)
    // ---------------------------

    const [page, setPage] = useState<number>(1);
    const [attributes, setAttributes] = useState<Record<string, string[]>>({});

    // ---------------------------
    // HANDLERS
    // ---------------------------

    const handleCategorySelect = useCallback(
        (path: string) => {
            // Reset local state at the SOURCE of change
            setPage(1);
            setAttributes({});

            navigate(`/category/${path}`);
        },
        [navigate]
    );

    const handleFacetChange = useCallback((next: Record<string, string[]>) => {
        setAttributes(next);
        setPage(1);
    }, []);

    // ---------------------------
    // QUERY (derived, not state)
    // ---------------------------

    const query: CatalogProductsQuery = {
        category: categoryPath,
        page,
        pageSize: 24,
        sort: "name_asc",
        attributes
    };

    const { data, loading, error } = useProducts(query);

    // ---------------------------
    // RENDER
    // ---------------------------

    return (
        <div style={{ display: "flex", gap: "1rem" }}>
            {/* Sidebar */}
            <aside style={{ width: "250px" }}>
                <CategoryTree selectedPath={categoryPath} onSelect={handleCategorySelect} />

                {data && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <h3>Filters</h3>
                        <FacetFilters facets={data.facets.attributes} value={attributes} onChange={handleFacetChange} />
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main style={{ flex: 1 }}>
                {loading && <div>Loading products…</div>}
                {error && <div>Failed to load products.</div>}

                {!loading && !error && data && (
                    <>
                        {data.data.length === 0 ? (
                            <div>No products found.</div>
                        ) : (
                            <ul>
                                {data.data.map((product) => (
                                    <li key={product.id}>
                                        <Link to={`/product/${product.slug}`}>
                                            <strong>{product.name}</strong>
                                        </Link>
                                        {product.description && (
                                            <div style={{ fontSize: "0.9em", color: "#666" }}>
                                                {product.description}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div style={{ marginTop: "1rem" }}>
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>

                            <span style={{ margin: "0 0.5rem" }}>
                                Page {data.pagination.page} of {data.pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page >= data.pagination.totalPages}
                                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
