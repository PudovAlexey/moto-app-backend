import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import { JwtPayload } from "../entity/jwtPayload";

@Injectable()
export class JwtRepository {
    constructor(
        @InjectRedis() private readonly redisService: Redis,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }
    private async saveTokens({
        userId,
        accessToken,
        refreshToken
    }: {
        userId: string
        accessToken: string
        refreshToken: string
    }) {
        const multi = this.redisService.multi();
        const accessExpires = this.configService.get<number>('JWT_ACCESS_EXPIRES');
        const refreshExpires = this.configService.get<number>('JWT_REFRESH_EXPIRES');

        multi.set(`user:access_token:${accessToken}`, userId, 'PX', accessExpires)
        multi.set(`user:refresh_token:${refreshToken}`, userId, 'PX', refreshExpires);

        await multi.exec();
    }

    async generateTokens({
        userId,
        email
    }: {
        userId: string,
        email: string
    }) {
        const refreshPayload: JwtPayload = {
            sub: userId,
            email: email,
            type: "refresh"
        }

        const accessPayload: JwtPayload = {
            sub: userId,
            email: email,
            type: "access"
        }

        const access_token = this.jwtService.sign(accessPayload, {
            secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
            expiresIn: (this.configService.get<number>('JWT_ACCESS_EXPIRES') + 'Ms') as any, // конкатенация вместо шаблонной строки
        });

        const refresh_token = this.jwtService.sign(refreshPayload, {
            secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
            expiresIn: (this.configService.get<number>('JWT_REFRESH_EXPIRES') + 'Ms') as any, // 86400000ms
        });

        await this.saveTokens({
            userId,
            accessToken: access_token,
            refreshToken: refresh_token,
        });

        return { access_token, refresh_token };
    }

    // Проверка access token
    async validateAccessToken(token: string): Promise<string | null> {
        return this.redisService.get(`access_token:${token}`);
    }

    // Проверка refresh token
    async validateRefreshToken(token: string): Promise<string | null> {
        return this.redisService.get(`refresh_token:${token}`);
    }

    async removeTokens({
        refreshToken,
        accessToken,
    }: { refreshToken: string, accessToken: string }) {
        const multi = this.redisService.multi();

        multi.del(`user:refresh_token:${refreshToken}`);
        multi.del(`user:access_token:${accessToken}`);
        await multi.exec();
    }



}