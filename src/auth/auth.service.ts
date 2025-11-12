import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma.service';
import type { User } from '@prisma/client';
import { RegisterInput, RegisterResponse } from './entity/register.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInput, LoginResponse } from './entity/login.entity';
import { AccessTokenInput, RefreshTokenResponse } from './entity/refreshToken.entity';
import { JwtRepository } from './repository/jwt.repository';
import { JwtPayload } from './entity/jwtPayload';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { LogoutResponse } from './entity/logout.entity';

@Injectable()
export class AuthServise {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly jwtRepository: JwtRepository,
        @InjectRedis() private readonly redisService: Redis,
    ) { }

    async register({
        password,
        ...args
    }: RegisterInput): Promise<RegisterResponse> {
        const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);

        return this.prismaService.user.create({
            data: {
                ...args,
                password: hashedPassword,
            },
            select: {
                id: true,
            }
        })
    }

    async refreshAccessToken(
        { user_id }: AccessTokenInput,
        refreshToken: string
    ): Promise<RefreshTokenResponse> {
        const user = await this.prismaService.user.findUnique({
            where: { id: user_id },
        });

        if (!user) {
            throw new UnauthorizedException('User not found in system. Please register');
        }

        if (!refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        // Проверяем существует ли refreshToken в Redis
        const storedUserId = await this.redisService.get(`user:refresh_token:${refreshToken}`);

        if (!storedUserId) {
            throw new UnauthorizedException('Refresh token expired or invalid. Please login again.');
        }

        // Проверяем, что токен принадлежит правильному пользователю
        if (storedUserId !== user_id) {
            throw new ForbiddenException('Token mismatch');
        }

        // Удаляем старый refreshToken (optional: можно оставить для ротации)
        await this.redisService.del(`user:refresh_token:${refreshToken}`);

        const newTokens = await this.jwtRepository.generateTokens({
            userId: user.id,
            email: user.email,
        });

        return newTokens;
    }

    async login({
        email,
        password
    }: LoginInput): Promise<LoginResponse> {
        const user = await this.prismaService.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new UnauthorizedException('User not found in system. Please register');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException('your password is wrong');
        }

        const tokens = this.jwtRepository.generateTokens({
            userId: user.id,
            email: user.email,
        })

        return tokens
    }

    async logout({
        access_token,
        refresh_token
    }: {
        access_token: string
        refresh_token: string
    }): Promise<LogoutResponse> {
        await this.jwtRepository.removeTokens({
            accessToken: access_token,
            refreshToken: refresh_token,
        })
        
        return {
            detail: "ok"
        }
    }
}
