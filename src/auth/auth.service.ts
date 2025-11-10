import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma.service';
import type { User } from '@prisma/client';
import { RegisterInput, RegisterResponse } from './entity/register.entity';

@Injectable()
export class AuthServise {
    constructor(private readonly prismaService: PrismaService) { }

   async register(args: RegisterInput): Promise<RegisterResponse> {
        return this.prismaService.user.create({
            data: args,
            select: {
                id: true,
            }
        })
    }
}
