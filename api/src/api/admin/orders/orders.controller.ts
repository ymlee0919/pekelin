import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    BadRequestException,
    NotFoundException,
    Query,
  } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CustomParseIntPipe } from 'src/services/pipes/customParseInt.pipe';
import { InvalidOperationError } from 'src/api/common/errors/invalid.error';
import { CreateOrderDTO, OrdersFilterDTO, OrderStatusDTO, UpdateOrderDTO } from './orders.dto';
import { Order, OrderContent, OrderEntity } from './orders.types';
import { NotFoundError } from 'src/api/common/errors/notFound.error';

@Controller('api/orders')
export class OrdersController {
    constructor(
        private readonly manager: OrdersService,
    ) {}
  
    @Get()
    findAll(@Query() filterDto: OrdersFilterDTO) : Promise<OrderContent[]> {
        const { status } = filterDto;
        return this.manager.findAll(!!status ? filterDto : null);
    }
  
    @Get(':orderId')
    async findOne(@Param('orderId', CustomParseIntPipe) orderId: number) : Promise<Order>{
        try {
            return await this.manager.findOne(orderId);
        }
        catch(error) {
            if(error instanceof NotFoundError){
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException(error);
        }
        
    }

    @Post()
    async create( @Body() order: CreateOrderDTO, ) : Promise<OrderEntity>  {
        
        try {
            let created = await this.manager.create(order);
            return created;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            if(error instanceof NotFoundError){
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException(error);
        }
    }
  
    
    @Patch(':orderId')
    async update(
        @Param('orderId', CustomParseIntPipe) orderId: number,
        @Body() order: UpdateOrderDTO,
    ) : Promise<OrderEntity> {
        try {
            let updated = await this.manager.update(orderId, order);
            return updated;

        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            if(error instanceof NotFoundError){
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException(error);
        }
    }
  
    @Delete(':orderId')
    async remove(@Param('orderId', CustomParseIntPipe) orderId: number) : Promise<OrderEntity>{
        try {
            let order = await this.manager.remove(orderId);
            return order;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            if(error instanceof NotFoundError){
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException(error);
        }
        
    }
  
    @Patch(':orderId/status')
    async updateStatus(
        @Param('orderId', CustomParseIntPipe) orderId: number,
        @Body() orderStatus: OrderStatusDTO,
    ): Promise<OrderEntity> {
        try {
            let order = await this.manager.updateStatus(orderId, orderStatus);
            return order;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            if(error instanceof NotFoundError){
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException(error);
        }
    }
}