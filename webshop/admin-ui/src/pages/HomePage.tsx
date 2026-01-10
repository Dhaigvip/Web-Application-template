
export function HomePage() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Welcome</h1>
            <h1 className="text-red-500">Tailwind works</h1>
            <p>Select an area to continue:</p>

            <ul>
                <li>
                    <a href="/admin/products">Admin Products</a>
                </li>
                <li>
                    <a href="/admin/categories">Admin Categories</a>
                </li>
            </ul>
        </div>
    );
}
