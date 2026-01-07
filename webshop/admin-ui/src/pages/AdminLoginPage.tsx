import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminAuth.api";
import { useAuth } from "../auth/useAuth";

export function AdminLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await adminLogin({ email, password });
            login(res.accessToken);
            navigate("/admin/products", { replace: true });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 360, margin: "80px auto" }}>
            <h1>Admin Login</h1>

            <form onSubmit={onSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in…" : "Login"}
                </button>
            </form>
        </div>
    );
}
