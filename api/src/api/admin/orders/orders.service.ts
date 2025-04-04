import { Injectable} from '@nestjs/common';
import { DatabaseService } from "src/services/database/database.service";
import { CreateOrderDTO, OrdersFilterDTO, OrderStatusDTO, UpdateOrderDTO } from './orders.dto';
import { Order, OrderContent, OrderEntity } from './orders.types';
import { ImageSrc } from 'src/api/common/types/common.types';
import { NotFoundError } from 'src/api/common/errors/notFound.error';

@Injectable()
export class OrdersService {
    constructor(
        private database: DatabaseService
    ) {}

    private async validateOrderExists(orderId: number) {
        const order = await this.database.orders.findUnique({
            where: { orderId },
        });
    
        if (!order) {
            throw new NotFoundError(`Order not found`);
        }
    }
    
    private async validateClientExists(clientId: number) {
        const client = await this.database.clients.findUnique({
            where: { clientId },
        });
    
        if (!client) {
            throw new NotFoundError(`Client not found`);
        }
    }

    private async validateProductVariantExists(variantId: number) {
        const variant = await this.database.productVariants.findUnique({
            where: { variantId },
        });
    
        if (!variant) {
            throw new NotFoundError(`Product variant not found`);
        }
    }

    async findAll(filter: OrdersFilterDTO|null): Promise<OrderContent[]> {
        
        let orders = await this.database.orders.findMany({
            include: {
                Client: {
                    select: {
                        name: true
                    }
                }
            },
            where : (filter && filter.status ? {status: filter.status} : undefined),
            orderBy: [
                { createdAt: 'desc' },
                { clientId: 'asc'}
            ]
        });

        let result = orders.map((order) => {
            return {
                orderId: order.orderId,
                clientId: order.clientId,
                client: order.Client.name,
                name: order.name,
                title: order.title,
                details: order.details,
                note: order.note,
                image: order.productImage,
                status: order.status,
                createdAt: order.createdAt
            }
        });

        return result;
    }

    async findOne(orderId: number): Promise<Order> {
        const order = await this.database.orders.findUnique({
            where: { orderId },
            include: {
                Client: {
                    select: {
                        name: true,
                        place: true,
                        phone: true
                    }
                },
            }
        });

        if (!order) {
            throw new NotFoundError(`Order not found`);
        }

        return order;
        
    }

    // Generate order name [MonthYear-00N]
    async generateOrderName(): Promise<string> {
        const currentDate = new Date();
        const monthName = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = currentDate.getFullYear().toString().slice(-2);

        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const orderCount = await this.database.orders.count({
            where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
            },
        });

        const nextOrderNumber = (orderCount + 1).toString().padStart(3, '0');

        return `${monthName}${year}-${nextOrderNumber}`;
    }

    async create(newOrder: CreateOrderDTO) : Promise<OrderEntity> {
        
        // Validate the product variant and the client
        await this.validateClientExists(newOrder.clientId);
        let orderName = await this.generateOrderName();

        let order = {name: orderName, ...newOrder}

        return await this.database.orders.create({
            data: order
        })
    }

    async update(orderId: number, newOrder: UpdateOrderDTO) : Promise<OrderEntity>{
        
        let currentOrder = await this.database.orders.findUnique({where: {orderId}});
        if(!currentOrder)
            throw new NotFoundError("Order not found")
        
        // Validate the product variant and the client
        if(newOrder.clientId)
            await this.validateClientExists(newOrder.clientId);

        let order: OrderEntity = await this.database.orders.update({
            where: { orderId },
            data: newOrder,
        });

        console.log(newOrder);

        return order;
    }

    async remove(orderId: number) : Promise<OrderEntity>{
        await this.validateOrderExists(orderId);

        return await this.database.orders.delete({
            where: { orderId },
        });
    }

    async updateStatus(orderId: number, orderStatusDto: OrderStatusDTO) : Promise<OrderEntity> {
        await this.validateOrderExists(orderId);

        return await this.database.orders.update({
            where: { orderId },
            data: {
                status: orderStatusDto.status,
            },
        });
    }
}