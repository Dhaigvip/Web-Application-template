import { useProduct } from "../hooks/useProduct";

export type ProductDetailPageProps = {
    /**
     * Product slug (public identifier).
     * In a router later, this will come from params.
     */
    slug: string | undefined;
};

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
    const { data, loading, error } = useProduct(slug);

    if (!slug) {
        return <div>No product selected.</div>;
    }

    if (loading) {
        return <div>Loading product…</div>;
    }

    if (error) {
        return <div>Failed to load product.</div>;
    }

    if (!data) {
        return <div>Product not found.</div>;
    }

    const { product, breadcrumbs, attributes } = data;

    return (
        <div>
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol style={{ listStyle: "none", padding: 0, display: "flex", gap: "0.5rem" }}>
                    {breadcrumbs.map((bc, index) => (
                        <li key={bc.path}>
                            <span>{bc.name}</span>
                            {index < breadcrumbs.length - 1 && <span> / </span>}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Product header */}
            <h1>{product.name}</h1>

            {product.description && (
                <p style={{ maxWidth: "600px" }}>{product.description}</p>
            )}

            {/* Attributes */}
            {Object.keys(attributes).length > 0 && (
                <section>
                    <h2>Specifications</h2>
                    <dl>
                        {Object.entries(attributes).map(([code, attr]) => (
                            <div key={code} style={{ marginBottom: "0.75rem" }}>
                                <dt style={{ fontWeight: "bold" }}>{attr.label}</dt>
                                <dd>
                                    {attr.values.map((v) => v.label).join(", ")}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
        </div>
    );
}
