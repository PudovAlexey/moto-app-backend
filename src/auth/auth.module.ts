import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prismaModule/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthServise } from './auth.service';
import { JwtRepository } from './repository/jwt.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [JwtRepository, AuthResolver, AuthServise],
  exports: [],
})
export class AuthModule {}
