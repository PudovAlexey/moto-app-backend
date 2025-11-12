import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class AccessTokenInput {
    @Field({ description: "user_id" })
    user_id: string
}

@ObjectType()
export class RefreshTokenResponse {
    @Field({ description: "access_token" })
    access_token: string

    @Field({ description: "refresh_token" })
    refresh_token: string
}