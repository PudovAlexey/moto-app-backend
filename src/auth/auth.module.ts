import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prismaModule/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthServise } from './auth.service';

@Module({
  imports: [PrismaModule],
  providers: [AuthResolver, AuthServise],
  exports: [],
})
export class AuthModule {}
