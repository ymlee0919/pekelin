import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";

export interface DashboardInfo {
    accounts: number;
    categories: number;
    products: number;
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
        let [accounts, categories, products] = await Promise.all([
            this.database.accounts.count(),
            this.database.categories.count(),
            this.database.products.count()
        ]);

        return {
            accounts, 
            categories, 
            products
        };
    }

}