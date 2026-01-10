import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    updateAdminProduct,
    activateAdminProduct,
    deactivateAdminProduct,
    assignAdminProductCategory,
    uploadAdminProductImage
} from "../api/adminCatalog.api";
import { useAdminProduct } from "../hooks/useAdminProduct";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { CategoryPicker } from "../components/CategoryPicker";
import { SplitSidebarLayout } from "../layout/SplitSidebarLayout";

export function AdminProductEditPage() {
    const { id } = useParams();
    const safeId = id ?? "";

    const { product, loading, error } = useAdminProduct(safeId);
    const { categories, loading: categoriesLoading, error: categoriesError } = useAdminCategories();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [primaryCategoryPath, setPrimaryCategoryPath] = useState<string | null>(null);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description ?? "");
            const p = product.categories.find((c) => c.isPrimary)?.path ?? null;
            setPrimaryCategoryPath(p);
            setImageUrl(product.imageUrl ?? null);
        }
    }, [product]);

    if (!id) return <p className="text-red-600">Invalid product id</p>;
    if (loading) return <p>Loading product…</p>;
    if (error) return <p className="text-red-600">{error}</p>;
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

        if (product.isActive) await deactivateAdminProduct(id);
        else await activateAdminProduct(id);
    }

    async function setPrimaryCategory(path: string) {
        if (!id) return;

        setPrimaryCategoryPath(path);

        try {
            await assignAdminProductCategory(id, {
                categoryPath: path,
                isPrimary: true
            });
        } catch {
            const prev = product?.categories.find((c) => c.isPrimary)?.path ?? null;
            setPrimaryCategoryPath(prev);
        }
    }

    async function handleImageUpload(file: File) {
        if (!id) return;

        setUploadingImage(true);
        try {
            const res = await uploadAdminProductImage(id, file);
            setImageUrl(res.imageUrl);
            // Update the product with the new image URL
            await updateAdminProduct(id, { imageUrl: res.imageUrl });
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    }

    return (
        <SplitSidebarLayout
            sidebar={
                <>
                    <h2 className="text-lg font-semibold mb-4">Primary Category</h2>

                    {categoriesLoading && <p>Loading categories…</p>}
                    {categoriesError && <p className="text-red-600">Error loading categories</p>}

                    {categories && (
                        <CategoryPicker
                            nodes={categories}
                            selectedPath={primaryCategoryPath}
                            onSelect={setPrimaryCategory}
                        />
                    )}
                </>
            }
        >
            {/* YOUR ORIGINAL PAGE CONTENT */}
            <div className="space-y-6 max-w-3xl">
                <div className="space-y-6 max-w-3xl flex-1">
                    <h1 className="text-2xl font-semibold">Edit Product</h1>

                    {/* Product Form */}
                    <div className="bg-white p-6 rounded shadow space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Name</label>
                            <input
                                className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-300"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Description</label>
                            <textarea
                                className="border rounded px-3 py-2 w-full h-24 focus:ring focus:ring-blue-300"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={save}
                                disabled={saving}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? "Saving…" : "Save"}
                            </button>

                            <button
                                onClick={toggleActive}
                                className={`px-4 py-2 rounded ${
                                    product.isActive
                                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                                {product.isActive ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                        <div>
                            <label className="block font-medium mb-2">Product Image</label>

                            {imageUrl && (
                                <img
                                    src={imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`}
                                    alt="Product"
                                    className="w-40 h-40 object-cover border rounded mb-3"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file);
                                }}
                                disabled={uploadingImage}
                            />

                            {uploadingImage && <p className="text-sm text-gray-500 mt-1">Uploading image…</p>}
                        </div>
                    </div>
                </div>
            </div>
        </SplitSidebarLayout>
    );
}
