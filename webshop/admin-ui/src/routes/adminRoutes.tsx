import { Route } from "react-router-dom";
import { AdminProductListPage } from "../pages/AdminProductListPage";
import { AdminGuard } from "../layout/AdminGuard";
import { AdminProductEditPage } from "../pages/AdminProductEditPage";
import { AdminCreateProductPage } from "../pages/AdminCreateProductPage";
import { AdminCreateCategoryPage } from "../pages/AdminCreateCategoryPage";
import { AdminCategoryListPage } from "../pages/AdminCategoryListPage";
import { AdminCategoryManagerPage } from "../pages/AdminCategoryManagerPage";
import { HomePage } from "../pages/HomePage";
import { AdminLoginPage } from "../pages/AdminLoginPage";

export const adminRoutes = (
    <>
        <Route path="/" element={<HomePage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<AdminGuard />}>
            <Route path="/admin/products" element={<AdminProductListPage />} />
            <Route path="/admin/products/new" element={<AdminCreateProductPage />} />
            <Route path="/admin/products/:id" element={<AdminProductEditPage />} />

            <Route path="/admin/categories" element={<AdminCategoryListPage />} />
            <Route path="/admin/categories/new" element={<AdminCreateCategoryPage />} />
            <Route path="/admin/categories/edit/:path" element={<AdminCategoryManagerPage />} />
        </Route>
    </>
);
