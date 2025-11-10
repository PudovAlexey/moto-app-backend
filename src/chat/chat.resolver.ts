import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateChatInput, CreateChatResponse, SendMessageInput, SendMessageResponse } from './entites/chat.entity';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => CreateChatResponse)
  createChat(
    @Args('chat_data') args: CreateChatInput
  ) {
    return this.chatService.createChat(args);
  }

  @Mutation(() => SendMessageResponse)
  sendMessage(
    @Args('message_data') args: SendMessageInput
  ) {
    return this.chatService.sendMessage(args);
  }
}