import { Injectable } from '@nestjs/common';
import { DatabaseService } from "src/services/database/database.service";
import { ClientDTO } from './clients.dto';
import { Client } from './clients.type';
import { InvalidOperationError } from 'src/common/errors/invalid.error';

@Injectable()
export class ClientsService {
    constructor(private readonly database: DatabaseService) { }

    async create(createClientDto: ClientDTO): Promise<Client> {
        return this.database.clients.create({
            data: createClientDto,
        });
    }

    async findAll(): Promise<Client[]> {
        return this.database.clients.findMany();
    }

    async findOne(clientId: number): Promise<Client | null> {
        return this.database.clients.findUnique({
            where: { clientId },
        });
    }

    async update(clientId: number, updateClientDto: ClientDTO): Promise<Client> {
        // Validate existence
        const client = await this.database.clients.findUnique({
            where: { clientId },
        });
    
        if (!client) {
            throw new InvalidOperationError('The client do not exists');
        }
        
        return this.database.clients.update({
            where: { clientId },
            data: updateClientDto,
        });
    }

    async remove(clientId: number): Promise<Client> {
        // Validate existence
        const client = await this.database.clients.findUnique({
            where: { clientId },
        });
    
        if (!client) {
            throw new InvalidOperationError('The client do not exists');
        }
    
        await this.database.clients.delete({
            where: { clientId },
        });

        return client;
  
    }
}