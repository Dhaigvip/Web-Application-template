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
        <div className="flex gap-4 p-6 min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 shrink-0">
                <CategoryTree selectedPath={categoryPath} onSelect={handleCategorySelect} />

                {data && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Filters</h3>
                        <FacetFilters facets={data.facets.attributes} value={attributes} onChange={handleFacetChange} />
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main className="flex-1">
                {loading && <div className="text-gray-600">Loading products…</div>}
                {error && <div className="text-red-600">Failed to load products.</div>}

                {!loading && !error && data && (
                    <>
                        {data.data.length === 0 ? (
                            <div className="text-gray-600">No products found.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {data.data.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
                                        <Link to={`/product/${product.slug}`} className="block">
                                            <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">{product.name}</h3>
                                            {product.description && (
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {product.description}
                                                </p>
                                            )}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-center gap-4">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            <span className="text-gray-700">
                                Page {data.pagination.page} of {data.pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page >= data.pagination.totalPages}
                                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
