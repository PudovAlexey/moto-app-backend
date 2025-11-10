import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Param } from '@nestjs/common';
import { AuthServise } from './auth.service';
import { RegisterInput, RegisterResponse } from './entity/register.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthServise) {}


@Mutation(() => RegisterResponse)
async register(
  @Args('input', { type: () => RegisterInput }) input: RegisterInput
): Promise<RegisterResponse> {
  return this.authService.register(input);
}
}
