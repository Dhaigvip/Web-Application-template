import { Link, useSearchParams } from "react-router-dom";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { SplitSidebarLayout } from "../layout/SplitSidebarLayout";
import { CategoryPicker } from "../components/CategoryPicker";

export function AdminProductListPage() {
    const [params, setParams] = useSearchParams();

    const q = params.get("q") ?? "";
    const status = params.get("status");
    const page = Number(params.get("page") ?? 1);

    const isActive = status === "active" ? true : status === "draft" ? false : undefined;

    const { data, loading, error } = useAdminProducts({
        q: q || undefined,
        isActive,
        page,
        pageSize: 20
    });

    function updateParam(key: string, value?: string) {
        const next = new URLSearchParams(params);
        if (!value) next.delete(key);
        else next.set(key, value);
        next.set("page", "1");
        setParams(next);
    }

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <SplitSidebarLayout
            sidebar={
                <>
                    <h2 className="text-lg font-semibold mb-4">Categories</h2>

                    {/* optional: later we can wire this to filter by category */}
                    {/* For now it’s navigational context */}
                    <CategoryPicker nodes={[]} selectedPath={null} onSelect={() => {}} />
                </>
            }
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Products</h1>

                    <Link to="/admin/products/new">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Create Product
                        </button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded shadow flex gap-4">
                    <input
                        className="border rounded px-3 py-2 w-64"
                        placeholder="Search…"
                        value={q}
                        onChange={(e) => updateParam("q", e.target.value || undefined)}
                    />

                    <select
                        className="border rounded px-3 py-2"
                        value={status ?? ""}
                        onChange={(e) => updateParam("status", e.target.value || undefined)}
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white shadow rounded overflow-hidden">
                    {loading ? (
                        <p className="p-4">Loading products…</p>
                    ) : !data || data.items.length === 0 ? (
                        <p className="p-4">No products found.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Slug</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Primary Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((p) => (
                                    <tr key={p.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 text-blue-600 underline">
                                            <Link to={`/admin/products/${p.id}`}>{p.name}</Link>
                                        </td>
                                        <td className="p-3">{p.slug}</td>
                                        <td className="p-3">{p.isActive ? "Active" : "Draft"}</td>
                                        <td className="p-3">{p.primaryCategoryPath ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {data && (
                    <div className="flex items-center gap-4">
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            disabled={page <= 1}
                            onClick={() => updateParam("page", String(page - 1))}
                        >
                            Previous
                        </button>

                        <span>Page {page}</span>

                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            disabled={data.items.length < data.pageSize}
                            onClick={() => updateParam("page", String(page + 1))}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </SplitSidebarLayout>
    );
}
