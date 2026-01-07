import { Body, Controller, Post } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";

@Controller("api/admin/auth")
export class AdminAuthController {
    constructor(private authService: AdminAuthService) {}

    @Post("login")
    login(@Body() dto: AdminLoginDto) {
        return this.authService.login(dto);
    }
}
