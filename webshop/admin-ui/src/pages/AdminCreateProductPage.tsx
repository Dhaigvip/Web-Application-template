import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminProduct } from "../api/adminCatalog.api";

export function AdminCreateProductPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [saving, setSaving] = useState(false);

    async function submit() {
        if (!name || !slug) return;

        setSaving(true);
        try {
            const product = await createAdminProduct({ name, slug });
            navigate(`/admin/products/${product.id}`);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>Create Product</h1>

            <div>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <label>Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>

            <button onClick={submit} disabled={saving}>
                Create
            </button>
        </div>
    );
}
