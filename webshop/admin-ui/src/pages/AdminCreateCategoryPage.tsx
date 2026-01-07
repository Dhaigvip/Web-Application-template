import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminCategory } from "../api/adminCatalog.api";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { CategoryPicker } from "../components/CategoryPicker";

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
        <div style={{ padding: 24, maxWidth: 600 }}>
            <h1>Create Category</h1>

            {(error || loadError) && <div style={{ color: "red", marginBottom: 12 }}>{error || loadError}</div>}

            <div style={{ marginBottom: 12 }}>
                <label>Name</label>
                <input
                    value={name}
                    onChange={(e) => {
                        const value = e.target.value;
                        setName(value);

                        if (!slug) {
                            setSlug(slugify(value));
                        }
                    }}
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Slug</label>
                <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} style={{ width: "100%" }} />
            </div>

            <h2>Parent Category</h2>

            {loading && <div>Loading categories…</div>}

            {categories && <CategoryPicker nodes={categories} selectedPath={parentPath} onSelect={setParentPath} />}

            <div style={{ marginTop: 24 }}>
                <button onClick={() => navigate("/admin/categories")} disabled={saving} style={{ marginRight: 8 }}>
                    Cancel
                </button>

                <button onClick={submit} disabled={saving || !name.trim() || !slug.trim()}>
                    {saving ? "Creating…" : "Create"}
                </button>
            </div>
        </div>
    );
}
