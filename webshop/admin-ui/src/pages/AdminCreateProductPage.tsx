import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminProduct, uploadAdminProductImage, updateAdminProduct } from "../api/adminCatalog.api";
import { SplitSidebarLayout } from "../layout/SplitSidebarLayout";

export function AdminCreateProductPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    function handleImageSelect(file: File) {
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
            return;
        }

        setImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    async function submit() {
        if (!name || !slug) return;

        setSaving(true);
        try {
            const product = await createAdminProduct({ name, slug });
            
            // If an image was selected, upload it and explicitly update the product
            if (imageFile) {
                const uploadResult = await uploadAdminProductImage(product.id, imageFile);
                // Explicitly save the imageUrl to the product
                await updateAdminProduct(product.id, { imageUrl: uploadResult.imageUrl });
            }
            
            navigate(`/admin/products/${product.id}`);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to create product");
        } finally {
            setSaving(false);
        }
    }

    return (
        <SplitSidebarLayout
            sidebar={
                <>
                    <h2 className="text-lg font-semibold mb-4">Products</h2>
                    <p className="text-sm text-gray-600">Create a new product and assign categories after saving.</p>
                </>
            }
        >
            <div className="space-y-6 max-w-xl">
                <h1 className="text-2xl font-semibold">Create Product</h1>

                <div className="bg-white p-6 rounded shadow space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            className="border rounded px-3 py-2 w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Slug</label>
                        <input
                            className="border rounded px-3 py-2 w-full"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Product Image (Optional)</label>
                        
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-40 h-40 object-cover border rounded mb-3"
                            />
                        )}

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageSelect(file);
                            }}
                            disabled={saving}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => navigate("/admin/products")}
                            disabled={saving}
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button onClick={submit} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
                            {saving ? "Creating…" : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </SplitSidebarLayout>
    );
}
