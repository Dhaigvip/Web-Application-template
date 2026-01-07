import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { CategoryPicker } from "../components/CategoryPicker";
import { updateAdminCategory, deleteAdminCategory } from "../api/adminCatalog.api";
import type { AdminCategoryTreeNodeDto } from "../api/adminCatalog.api";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function findCategoryByPath(nodes: AdminCategoryTreeNodeDto[], path: string): AdminCategoryTreeNodeDto | null {
    for (const node of nodes) {
        if (node.path === path) return node;
        if (node.children) {
            const found = findCategoryByPath(node.children, path);
            if (found) return found;
        }
    }
    return null;
}

function getParentPath(path: string): string | null {
    const parts = path.split("/");
    if (parts.length <= 1) return null;
    return parts.slice(0, -1).join("/");
}

export function AdminCategoryManagerPage() {
    const navigate = useNavigate();
    const { path } = useParams();
    const { categories, loading, error: loadError } = useAdminCategories();

    const [category, setCategory] = useState<AdminCategoryTreeNodeDto | null>(null);
    const [name, setName] = useState("");
    const [slugValue, setSlugValue] = useState("");
    const [parentPath, setParentPath] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(true);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!path || !categories) return;

        const decodedPath = decodeURIComponent(path);
        const found = findCategoryByPath(categories, decodedPath);

        if (found) {
            setCategory(found);
            setName(found.name);
            setSlugValue(found.path.split("/").pop() || "");
            setParentPath(getParentPath(found.path));
            setIsActive(found.isActive);
        } else {
            setError("Category not found");
        }
    }, [path, categories]);

    async function submit() {
        if (!category) return;

        if (!name.trim() || !slugValue.trim()) {
            setError("Name and slug are required");
            return;
        }

        const newPath = parentPath ? `${parentPath}/${slugValue}` : slugValue;

        if (newPath === category.path) {
            setError("No changes detected");
            return;
        }

        if (parentPath === category.path || parentPath?.startsWith(category.path + "/")) {
            setError("Cannot move category under itself or its child");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await updateAdminCategory(category.id, {
                name: name.trim(),
                slug: slugValue.trim(),
                parentPath: parentPath ?? undefined,
                isActive
            });

            navigate("/admin/categories");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update category");
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!category) return;

        const ok = window.confirm(`Delete category "${category.name}"?\nThis cannot be undone.`);

        if (!ok) return;

        setSaving(true);
        setError(null);

        try {
            await deleteAdminCategory(category.id);
            navigate("/admin/categories");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to delete category");
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div style={{ padding: 24 }}>Loading…</div>;
    }

    if (!category) {
        return (
            <div style={{ padding: 24 }}>
                <div style={{ color: "red" }}>{error || "Category not found"}</div>
                <button onClick={() => navigate("/admin/categories")} style={{ marginTop: 12 }}>
                    Back to Categories
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: 24, maxWidth: 600 }}>
            <h1>Edit Category</h1>

            {(error || loadError) && <div style={{ color: "red", marginBottom: 12 }}>{error || loadError}</div>}

            <div style={{ marginBottom: 12 }}>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Slug (last segment)</label>
                <input
                    value={slugValue}
                    onChange={(e) => setSlugValue(slugify(e.target.value))}
                    style={{ width: "100%" }}
                />
                <small style={{ color: "#666" }}>
                    Full path: {parentPath ? `${parentPath}/` : ""}
                    {slugValue}
                </small>
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        style={{ marginRight: 8 }}
                    />
                    Active
                </label>
            </div>

            <h2>Parent Category</h2>

            {categories && <CategoryPicker nodes={categories} selectedPath={parentPath} onSelect={setParentPath} />}

            <div style={{ marginTop: 24 }}>
                <button onClick={handleDelete} disabled={saving} style={{ marginRight: 8, color: "red" }}>
                    Delete
                </button>

                <button onClick={() => navigate("/admin/categories")} disabled={saving} style={{ marginRight: 8 }}>
                    Cancel
                </button>

                <button onClick={submit} disabled={saving || !name.trim() || !slugValue.trim()}>
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
