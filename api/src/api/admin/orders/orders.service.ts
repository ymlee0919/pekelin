import { Injectable} from '@nestjs/common';
import { DatabaseService } from "src/services/database/database.service";
import { OrderDTO, OrderStatusDTO } from './orders.dto';
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

    async findAll(): Promise<OrderContent[]> {
        let orders = await this.database.orders.findMany({
            include: {
                Client: {
                    select: {
                        name: true
                    }
                }
            },
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
                title: order.title,
                details: order.details,
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

    async create(newOrder: OrderDTO) : Promise<OrderEntity> {
        
        // Validate the product variant and the client
        await this.validateClientExists(newOrder.clientId);

        return await this.database.orders.create({
            data: newOrder
        })
    }

    async update(orderId: number, newOrder: OrderDTO) : Promise<OrderEntity>{
        
        let currentOrder = await this.database.orders.findUnique({where: {orderId}});
        if(!currentOrder)
            throw new NotFoundError("Order not found")
        
        // Validate the product variant and the client
        await this.validateClientExists(newOrder.clientId);

        let order: OrderEntity = await this.database.orders.update({
            where: { orderId },
            data: newOrder,
        });

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