import { Injectable } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { DatabaseService } from "src/services/database/database.service";

export interface DashboardInfo {
    accounts: number;
    categories: number;
    products: number;
    orders: number;
    production: number;
    clients: number;
    links: number;
}

/**
 * Service for gallery
 */
@Injectable()
export class AppService {

    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(
        private readonly database:DatabaseService
    ){ }

    /**
     * Get general app information
     * 
     * @returns General information
     */
    async getDashboardInfo() : Promise<DashboardInfo>
    {
        let [accounts, categories, products, production, orders, clients, links] = await Promise.all([
            this.database.accounts.count(),
            this.database.categories.count(),
            this.database.products.count(),
            this.database.orders.count({where: {status: OrderStatus.PENDING}}),
            this.database.orders.count({where: {status: {
                in: [OrderStatus.PENDING, OrderStatus.READY, OrderStatus.DISPATCHED]
            } }}),
            this.database.clients.count(),
            this.database.reviewLinks.count({where : {updatedAt: null}})
        ]);

        return {
            accounts, 
            categories, 
            products,
            orders,
            production,
            clients,
            links
        };
    }

}