import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
    @Field({description: "email"})
    email: string

    @Field({description: "password"})
    password: string
}

@ObjectType()
export class LoginResponse {
    @Field({description: "access_token"})
    access_token: string

    @Field({description: "refresh_token"})
    refresh_token: string
}