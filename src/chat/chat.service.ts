import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma.service';
import type { User } from '@prisma/client';
import { CreateChatInput, SendMessageInput } from './entites/chat.entity';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) { }

createChat(chat: CreateChatInput) {

}

sendMessage(message_data: SendMessageInput) {
    
}
}
