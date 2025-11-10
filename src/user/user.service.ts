import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { AddToContactInput, AddToContactResponse, GetMyContactInput, GetMyContactResponse } from './entities/contact.entity';
import type { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

async getAllContacts(params: GetMyContactInput, userId: string): Promise<GetMyContactResponse[]> {
    let users: any[] = [];

    if (params.search_field) {
        users = await this.prismaService.$queryRaw`
            SELECT 
                u.*,
                CASE WHEN c.id IS NOT NULL THEN true ELSE false END as is_contact
            FROM users u
            LEFT JOIN contact c ON u.id = c.contact_id AND c.owner_id = ${userId}
            WHERE 
                u.id != ${userId}
                AND (
                    u.name ILIKE ${`%${params.search_field}%`} 
                    OR u.email ILIKE ${`%${params.search_field}%`}
                )
            ORDER BY 
                is_contact DESC,
                u.name ASC
        `;
    } else {
        // Для случая без search_field тоже нужно добавить is_contact
        users = await this.prismaService.$queryRaw`
            SELECT 
                u.*,
                CASE WHEN c.id IS NOT NULL THEN true ELSE false END as is_contact
            FROM users u
            LEFT JOIN contact c ON u.id = c.contact_id AND c.owner_id = ${userId}
            WHERE u.id != ${userId}
            ORDER BY 
                is_contact DESC,
                u.name ASC
        `;
    }

    return users.map((user: any) => new GetMyContactResponse(user));
}

    async addToContacts(
        params: AddToContactInput,
        userId: string
    ): Promise<AddToContactResponse> {
      try {
          await this.prismaService.contact.create({
            data: {
                owner_id: userId,
                contact_id: params.user_id,
            }
        })

        return {
            detail: "ok"
        }
      } catch(error) {
        return {
            detail: "false"
        }
      }
    }
}
