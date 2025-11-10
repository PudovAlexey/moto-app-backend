import { Field, InputType, ObjectType } from '@nestjs/graphql';
import type { User } from '@prisma/client';

@InputType()
export class GetMyContactInput {
  @Field({ description: 'is_success', nullable: true })
  search_field: string;
}

@ObjectType()
export class GetMyContactResponse {
  @Field({ description: 'id' })
  id: string;

  @Field({ description: 'name' })
  name: string;

  @Field({description: "", defaultValue: false})
  isMyContact: boolean

  constructor({ id, name, is_contact }: User & {
    is_contact: boolean
  }) {
    this.id = id;
    this.name = name;
    this.isMyContact = Boolean(is_contact);
  }
}

@InputType()
export class AddToContactInput {
    @Field({description: "user_id"})
    user_id: string
}

@ObjectType()
export class AddToContactResponse {
    @Field({description: "detail"})
    detail: string
}
