import { useProduct } from "../hooks/useProduct";

export type ProductDetailPageProps = {
    /**
     * Product slug (public identifier).
     * In a router later, this will come from params.
     */
    slug: string | undefined;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function getImageUrl(imageUrl: string | null): string | null {
    if (!imageUrl) return null;
    // If it's already a full URL, return as-is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
    }
    // Otherwise, prepend the API base URL
    return `${API_BASE}${imageUrl}`;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
    const { data, loading, error } = useProduct(slug);

    if (!slug) {
        return <div className="p-6 text-gray-600">No product selected.</div>;
    }

    if (loading) {
        return <div className="p-6 text-gray-600">Loading product…</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Failed to load product.</div>;
    }

    if (!data) {
        return <div className="p-6 text-gray-600">Product not found.</div>;
    }

    const { product, breadcrumbs, attributes } = data;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex gap-2 text-sm text-gray-600">
                        {breadcrumbs.map((bc, index) => (
                            <li key={bc.path} className="flex items-center">
                                <span className="hover:text-blue-600">{bc.name}</span>
                                {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Product header */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                {product.imageUrl && (
                    <img
                        src={
                            product.imageUrl.startsWith("http")
                                ? product.imageUrl
                                : `${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`
                        }
                        alt="Product"
                        className="w-40 h-40 object-cover border rounded mb-3"
                    />
                )}

                {product.description && (
                    <p className="text-gray-700 leading-relaxed max-w-2xl mb-8">{product.description}</p>
                )}

                {/* Attributes */}
                {Object.keys(attributes).length > 0 && (
                    <section className="border-t border-gray-200 pt-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Specifications</h2>
                        <dl className="space-y-3">
                            {Object.entries(attributes).map(([code, attr]) => (
                                <div key={code} className="grid grid-cols-3 gap-4">
                                    <dt className="font-semibold text-gray-700">{attr.label}</dt>
                                    <dd className="col-span-2 text-gray-600">
                                        {attr.values.map((v) => v.label).join(", ")}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}
            </div>
        </div>
    );
}
