import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminCategory } from "../api/adminCatalog.api";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { CategoryPicker } from "../components/CategoryPicker";
import { SplitSidebarLayout } from "../layout/SplitSidebarLayout";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export function AdminCreateCategoryPage() {
    const navigate = useNavigate();
    const { categories, loading, error: loadError } = useAdminCategories();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [parentPath, setParentPath] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit() {
        if (!name.trim() || !slug.trim()) {
            setError("Name and slug are required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await createAdminCategory({
                name: name.trim(),
                slug: slug.trim(),
                parentPath: parentPath ?? undefined
            });

            navigate("/admin/categories");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to create category");
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <SplitSidebarLayout
            sidebar={
                <>
                    <h2 className="text-lg font-semibold mb-4">Categories</h2>

                    {loading && <p>Loading categories…</p>}
                    {loadError && <p className="text-red-600">{loadError}</p>}

                    {categories && (
                        <CategoryPicker nodes={categories} selectedPath={parentPath} onSelect={setParentPath} />
                    )}
                </>
            }
        >
            <div className="space-y-6 max-w-2xl">
                <h1 className="text-2xl font-semibold">Create Category</h1>

                {(error || loadError) && <div className="text-red-600">{error || loadError}</div>}

                <div className="bg-white p-6 rounded shadow space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            className="border rounded px-3 py-2 w-full"
                            value={name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setName(value);

                                if (!slug) {
                                    setSlug(slugify(value));
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Slug</label>
                        <input
                            className="border rounded px-3 py-2 w-full"
                            value={slug}
                            onChange={(e) => setSlug(slugify(e.target.value))}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => navigate("/admin/categories")}
                            disabled={saving}
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={submit}
                            disabled={saving || !name.trim() || !slug.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {saving ? "Creating…" : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </SplitSidebarLayout>
    );
}
