import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthServise } from './auth.service';
import { RegisterInput, RegisterResponse } from './entity/register.entity';
import { LoginInput, LoginResponse } from './entity/login.entity';
import { RefreshTokenResponse } from './entity/refreshToken.entity';
import { LogoutResponse } from './entity/logout.entity';
import { Public } from './guards/publicGuard';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthServise,
    private readonly configService: ConfigService,
  ) { }

  @Mutation(() => RegisterResponse)
  @Public()
  async register(
    @Args('input', { type: () => RegisterInput }) input: RegisterInput,
        @Context() context: any
  ): Promise<RegisterResponse> {
    const result = await this.authService.register(input);

    // После регистрации сразу логиним пользователя
    const tokens = await this.authService.login({
      email: input.email,
      password: input.password
    });

    // Устанавливаем куки
    this.setCookies(context, tokens);

    return result;
  }

  @Mutation(() => LoginResponse)
  @Public()
  async login(
    @Args('input', { type: () => LoginInput }) input: LoginInput,
    @Context() context: { res: Response }
  ): Promise<LoginResponse> {
    const tokens = await this.authService.login(input);

    // Устанавливаем куки
    this.setCookies(context, tokens);

    return tokens;
  }

  @Mutation(() => RefreshTokenResponse)
  @Public() // Refresh token доступен без авторизации
  async refreshAccessToken(
    @Context() context: any
  ): Promise<RefreshTokenResponse> {
    const refreshToken = context.req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new Error('Refresh token not found in cookies');
    }

    const newTokens = await this.authService.refreshAccessToken({
      user_id: "",
    }, refreshToken);

    // Устанавливаем новые куки
    this.setCookies(context, newTokens);

    return newTokens;
  }

  @Mutation(() => LogoutResponse)
  async logout(
    @Context() context: any
  ): Promise<LogoutResponse> {
    // Очищаем куки
    this.clearCookies(context.res);
    const accessToken = context.req.cookies?.access_token;
    const refreshToken = context.req.cookies?.refresh_token;

    return this.authService.logout({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  private setCookies(context: any, tokens: { access_token: string; refresh_token: string }) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Получаем значения из environment variables
    const accessExpires = this.configService.get<number>('JWT_ACCESS_EXPIRES') || 9000000; // 150 минут по умолчанию
    const refreshExpires = this.configService.get<number>('JWT_REFRESH_EXPIRES') || 86400000; // 24 часа по умолчанию

    // Access token cookie
    context.res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: accessExpires, // 9000000 ms = 150 минут
    });

    // Refresh token cookie
    context.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: refreshExpires, // 86400000 ms = 24 часа
    });
  }

  private clearCookies(context: any) {
    const isProduction = process.env.NODE_ENV === 'production';

    context.res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
    });

    context.res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
    });
  }
}