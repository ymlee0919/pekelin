import { Injectable } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { DatabaseService } from "src/services/database/database.service";

export interface DashboardInfo {
    accounts: number;
    categories: number;
    products: number;
    orders: number;
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
        let [accounts, categories, products, orders] = await Promise.all([
            this.database.accounts.count(),
            this.database.categories.count(),
            this.database.products.count(),
            this.database.orders.count({where: {status: OrderStatus.PENDING}})
        ]);

        return {
            accounts, 
            categories, 
            products,
            orders
        };
    }

}