import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    updateAdminProduct,
    activateAdminProduct,
    deactivateAdminProduct,
    assignAdminProductCategory
} from "../api/adminCatalog.api";
import { useAdminProduct } from "../hooks/useAdminProduct";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { CategoryPicker } from "../components/CategoryPicker";

export function AdminProductEditPage() {
    // 🔒 1️⃣ ALL HOOKS — NO RETURNS ABOVE THIS LINE
    const { id } = useParams();
    const safeId = id ?? "";

    const { product, loading, error } = useAdminProduct(safeId);
    const { categories, loading: categoriesLoading, error: categoriesError } = useAdminCategories();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const [primaryCategoryPath, setPrimaryCategoryPath] = useState<string | null>(null);

    // sync fetched product → form state
    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description ?? "");
            const p = product.categories.find((c) => c.isPrimary)?.path ?? null;
            setPrimaryCategoryPath(p);
        }
    }, [product]);

    // 🧱 2️⃣ RENDER GUARDS — AFTER ALL HOOKS
    if (!id) {
        return <p>Invalid product id</p>;
    }

    if (loading) return <p>Loading product…</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!product) return <p>Product not found</p>;

    async function save() {
        if (!id) return;

        setSaving(true);
        try {
            await updateAdminProduct(id, { name, description });
        } finally {
            setSaving(false);
        }
    }

    async function toggleActive() {
        if (!id || !product) return;

        if (product.isActive) {
            await deactivateAdminProduct(id);
        } else {
            await activateAdminProduct(id);
        }
    }

    async function setPrimaryCategory(path: string) {
        if (!id) return;

        // optimistic UI update
        setPrimaryCategoryPath(path);

        try {
            await assignAdminProductCategory(id, {
                categoryPath: path,
                isPrimary: true
            });
        } catch {
            // revert if API fails
            const prev = product?.categories.find((c) => c.isPrimary)?.path ?? null;
            setPrimaryCategoryPath(prev);
        }
    }

    // const primaryCategoryPath = product.categories.find((c) => c.isPrimary)?.path ?? null;

    return (
        <div style={{ padding: 24 }}>
            <h1>Edit Product</h1>

            <div>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div style={{ marginTop: 16 }}>
                <button onClick={save} disabled={saving}>
                    Save
                </button>

                <button onClick={toggleActive} style={{ marginLeft: 12 }}>
                    {product.isActive ? "Deactivate" : "Activate"}
                </button>
            </div>

            <hr />

            <h2>Primary Category</h2>

            {categoriesLoading && <p>Loading categories…</p>}
            {categoriesError && <p>Error loading categories</p>}

            {categories && (
                <CategoryPicker nodes={categories} selectedPath={primaryCategoryPath} onSelect={setPrimaryCategory} />
            )}
        </div>
    );
}
