import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { IsEmailUnique } from "src/utils/validators/isEmailUnique";
// import { IsEmailUnique } from './is-email-unique.validator';

@InputType()
export class RegisterInput {
  @Field({ description: 'User email (login)' })
  @IsEmail()
  @IsEmailUnique({ message: 'Email already exists' })
  email: string;

  @Field({ description: 'User password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field({ description: 'User name' })
  @IsNotEmpty()
  name: string;

  @Field({ description: 'User surname' })
  @IsNotEmpty()
  surname: string;

  @Field({ description: 'User patronymic', nullable: true })
  @IsOptional()
  patronymic?: string;

  @Field({ description: 'Avatar URL', nullable: true })
  @IsOptional()
  avatar_url?: string;
}

@ObjectType()
export class RegisterResponse {
    @Field({description: "description"})
    id: string
}