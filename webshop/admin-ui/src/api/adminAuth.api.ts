import { http } from "./http";

export interface AdminLoginDto {
    email: string;
    password: string;
}

export interface AdminAuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export function adminLogin(dto: AdminLoginDto) {
    return http<AdminAuthResponseDto>("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}
