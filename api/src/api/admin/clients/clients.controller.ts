import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './clients.type';
import { ClientDTO } from './clients.dto';
import { InvalidOperationError } from 'src/api/common/errors/invalid.error';

@Controller('api/clients')
export class ClientsController {
    constructor(private readonly manager: ClientsService) {}

    @Post()
    create(@Body() createClientDto: ClientDTO): Promise<Client> {
        return this.manager.create(createClientDto);
    }

    @Get()
    findAll(): Promise<Client[]> {
        return this.manager.findAll();
    }

    @Get(':clientId')
    async findOne(@Param('clientId', ParseIntPipe) clientId: number): Promise<Client> {
        let client = await this.manager.findOne(clientId);
        if(!client)
            throw new NotFoundException('Client not found');

        return client;
    }

    @Patch(':clientId')
    async update(
        @Param('clientId', ParseIntPipe) clientId: number,
        @Body() updateClientDto: ClientDTO,
    ): Promise<Client> {
        try{
            let updated = await this.manager.update(clientId, updateClientDto);
            return updated;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Delete(':clientId')
    async remove(@Param('clientId', ParseIntPipe) clientId: number): Promise<Client> {
        try{
            let updated = await this.manager.remove(clientId);
            return updated;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }
}