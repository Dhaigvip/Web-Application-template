import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

export interface VersionedRequest extends Request {
    version?: string;
}

@Injectable()
export class VersionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<VersionedRequest>();
        
        // Extract API version from URL (/v1/... or /v2/...)
        const versionMatch = request.url.match(/^\/v(\d+)\//);
        request.version = versionMatch ? versionMatch[1] : "1";
        
        return next.handle();
    }
}
