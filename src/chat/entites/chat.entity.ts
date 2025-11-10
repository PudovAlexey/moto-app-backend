import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class CreateChatInput {
    @Field({ description: "user_id" })
    user_id: string

    @Field({ description: "participant_id" })
    participant_id: string
}

@ObjectType()
export class CreateChatResponse {
    @Field({ description: "id" })
    id: string
}

@InputType()
export class SendMessageInput {
    @Field({ description: 'id', nullable: true })
    chat_id: string

    @Field({ description: 'participant_id' })
    participant_id: string

    @Field({description: ""})
    message: string

    @Field(() => [String], {description: '', nullable: true})
    adds: string[]
}

@ObjectType()
export class SendMessageResponse {
    @Field({ description: "id" })
    id: string
}