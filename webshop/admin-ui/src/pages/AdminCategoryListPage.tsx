import { Link } from "react-router-dom";
import { useAdminCategories } from "../hooks/useAdminCategories";
import type { AdminCategoryTreeNodeDto } from "../api/adminCatalog.api";

function CategoryTree({ nodes, level = 0 }: { nodes: AdminCategoryTreeNodeDto[]; level?: number }) {
    return (
        <ul style={{ paddingLeft: level * 16 }}>
            {nodes.map((cat) => (
                <li key={cat.path} style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ flex: 1 }}>{cat.name}</span>

                        <Link to={`/admin/categories/edit/${encodeURIComponent(cat.path)}`}>Edit</Link>
                    </div>

                    {cat.children && cat.children.length > 0 && <CategoryTree nodes={cat.children} level={level + 1} />}
                </li>
            ))}
        </ul>
    );
}

export function AdminCategoryListPage() {
    const { categories, loading, error } = useAdminCategories();

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h1>Categories</h1>

                <Link to="/admin/categories/new">
                    <button>Create Category</button>
                </Link>
            </div>

            {loading && <div>Loading categories…</div>}

            {error && <div style={{ color: "red" }}>{error}</div>}

            {categories && categories.length === 0 && <div>No categories yet.</div>}

            {categories && categories.length > 0 && <CategoryTree nodes={categories} />}
        </div>
    );
}
