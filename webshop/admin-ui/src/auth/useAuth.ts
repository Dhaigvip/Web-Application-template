import { setAuthToken, clearAuthToken, getAuthToken } from "./authStore";

export function useAuth() {
    return {
        isAuthenticated: Boolean(getAuthToken()),
        login(token: string) {
            setAuthToken(token);
        },
        logout() {
            clearAuthToken();
        }
    };
}
