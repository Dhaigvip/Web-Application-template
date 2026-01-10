import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home = all products */}
                <Route path="/" element={<ProductListPage />} />

                {/* Category listing (deep paths supported) */}
                <Route path="/category/:path*" element={<CategoryRoute />} />

                {/* Product PDP */}
                <Route path="/product/:slug" element={<ProductRoute />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

function CategoryRoute() {
    const params = useParams<{ "*"?: string }>();
    // The catch-all parameter is accessed as "*" not "path"
    return <ProductListPage categoryPath={params["*"]} />;
}

function ProductRoute() {
    const params = useParams<{ slug: string }>();
    return <ProductDetailPage slug={params.slug} />;
}
