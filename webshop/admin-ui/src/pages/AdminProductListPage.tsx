import { Link, useSearchParams } from "react-router-dom";
import { useAdminProducts } from "../hooks/useAdminProducts";

export function AdminProductListPage() {
    const [params, setParams] = useSearchParams();

    const q = params.get("q") ?? "";
    const status = params.get("status"); // "active" | "draft" | null
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
        next.set("page", "1"); // reset paging on filter
        setParams(next);
    }

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h1>Products</h1>

                <Link to="/admin/products/new">
                    <button>Create Product</button>
                </Link>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <input
                    placeholder="Search…"
                    value={q}
                    onChange={(e) => updateParam("q", e.target.value || undefined)}
                />

                <select value={status ?? ""} onChange={(e) => updateParam("status", e.target.value || undefined)}>
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading products…</p>
            ) : !data || data.items.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <table width="100%" cellPadding={8}>
                    <thead>
                        <tr>
                            <th align="left">Name</th>
                            <th align="left">Slug</th>
                            <th>Status</th>
                            <th>Primary Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <Link to={`/admin/products/${p.id}`}>{p.name}</Link>
                                </td>
                                <td>{p.slug}</td>
                                <td>{p.isActive ? "Active" : "Draft"}</td>
                                <td>{p.primaryCategoryPath ?? "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            {data && (
                <div style={{ marginTop: 16 }}>
                    <button disabled={page <= 1} onClick={() => updateParam("page", String(page - 1))}>
                        Previous
                    </button>

                    <span style={{ margin: "0 12px" }}>Page {page}</span>

                    <button
                        disabled={data.items.length < data.pageSize}
                        onClick={() => updateParam("page", String(page + 1))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
