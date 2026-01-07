import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function AdminGuard() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
