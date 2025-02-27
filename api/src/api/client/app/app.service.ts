import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { DataBase } from "./app.types";

/**
 * Service for gallery
 */
@Injectable()
export class ClientAppService {

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
    async getInfo() : Promise<DataBase>
    {
        let database = await this.database.categories.findMany({
            // Categories
            select: {
                categoryId: true,
                category: true,
                description: true,
                url: true,
                remoteUrl: true,
                expiry: true,
                // Product information
                Products : {
                    select : {
                        productId: true,
                        categoryId: true,
                        name: true,
                        url: true,
                        description: true,
                        price: true,
                        isNew: true,
                        isBestSeller: true,
                        remoteUrl: true,
                        expiry: true,
                        Features: {
                            select: {
                                title: true,
                                content: true,
                            }
                        },
                        // Variants
                        Variants : {
                            select: {
                                variantId: true,
                                productId: true,
                                name: true,
                                description: true,
                                isBestSeller: true,
                                isNew: true,
                                remoteUrl: true,
                                expiry: true,
                                Features: {
                                    select: {
                                        title: true,
                                        content: true,
                                    }
                                },
                            },
                            where: {
                                visible: true
                            }
                        }
                    },where : {
                        visible: true
                    }
                }
            }
        });

        return database;
    }

}