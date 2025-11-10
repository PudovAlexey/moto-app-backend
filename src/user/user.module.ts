import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prismaModule/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserResolver, UserService],
  exports: [],
})
export class UserModule {}
