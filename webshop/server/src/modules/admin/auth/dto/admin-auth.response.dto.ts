export class AdminAuthResponseDto {
    declare accessToken: string;
    declare user: {
        id: string;
        email: string;
        role: string;
    };
}
