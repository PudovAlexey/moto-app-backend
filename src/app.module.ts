import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prismaModule/prisma.module';
import { UserModule } from './user/user.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

// TODO Hello world








// Math operations

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET') || 'default-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRES') + 'ms' || '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
        options: {
          // Добавляем опции для стабильности
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      debug: true,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          includeCookies: true, // ✅ ВКЛЮЧАЕМ cookies для Apollo Studio
        }),
      ],
      context: ({ req, res }) => ({ req, res }), // ✅ ДОБАВЛЯЕМ res в контекст
      // cors: {
      //   origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      //   credentials: true, // ✅ ВКЛЮЧАЕМ credentials для cookies
      // },
    }),
    UserModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }