import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GetMyContactResponse,
  GetMyContactInput,
  AddToContactResponse,
  AddToContactInput,
} from './entities/contact.entity';
import { Param } from '@nestjs/common';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [GetMyContactResponse])
  getContact(@Args('search') params: GetMyContactInput) {
    const userId = 'b7e4224e-e19f-45c0-9c39-cabb918474b6';
    return this.userService.getAllContacts(params, userId);
  }

  @Mutation(() => AddToContactResponse)
  addToContacts(
    @Args('contact') params: AddToContactInput
  ) {
    const userId = 'b7e4224e-e19f-45c0-9c39-cabb918474b6';
    return this.userService.addToContacts(params, userId)
  }
}
