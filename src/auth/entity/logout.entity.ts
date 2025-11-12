import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LogoutResponse {
    @Field({description: ""})
    detail: string
}