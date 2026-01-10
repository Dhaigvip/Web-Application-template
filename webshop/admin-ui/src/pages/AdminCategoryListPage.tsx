import { Link } from "react-router-dom";
import { useAdminCategories } from "../hooks/useAdminCategories";
import type { AdminCategoryTreeNodeDto } from "../api/adminCatalog.api";
import { SplitSidebarLayout } from "../layout/SplitSidebarLayout";
import { CategoryPicker } from "../components/CategoryPicker";

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
        <SplitSidebarLayout
            sidebar={
                <>
                    <h2 className="text-lg font-semibold mb-4">Categories</h2>

                    {loading && <p>Loading categories…</p>}
                    {error && <p className="text-red-600">{error}</p>}

                    {categories && <CategoryPicker nodes={categories} selectedPath={null} onSelect={() => {}} />}
                </>
            }
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Category List</h1>

                    <Link to="/admin/categories/new">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Create Category
                        </button>
                    </Link>
                </div>

                {categories && categories.length === 0 && <p>No categories yet.</p>}

                {categories && categories.length > 0 && <CategoryTree nodes={categories} />}
            </div>
        </SplitSidebarLayout>
    );
}
