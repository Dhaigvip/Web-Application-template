type AuthState = {
    token: string | null;
};

const state: AuthState = {
    token: localStorage.getItem("admin_token")
};

export function setAuthToken(token: string) {
    state.token = token;
    localStorage.setItem("admin_token", token);
}

export function clearAuthToken() {
    state.token = null;
    localStorage.removeItem("admin_token");
}

export function getAuthToken() {
    return state.token;
}
