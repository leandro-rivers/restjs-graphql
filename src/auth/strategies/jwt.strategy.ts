import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { AuthJwtPayload } from "../types/auth-jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService, 
        private authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
            ignoreExpiration: false
        });
    }

    async validate(payload: AuthJwtPayload) {
        const { userId } = payload.sub;
        const jwtUser = await this.authService.validateJwtUser(userId);
        return jwtUser;
    }
}