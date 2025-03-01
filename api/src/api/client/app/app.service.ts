import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { DataBase } from "./app.types";
import { CloudService } from 'src/services/cloud/cloud.service';

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
        private readonly database:DatabaseService,
        private readonly cloudService: CloudService
    ){ }

    private async updateExpiryImages() {

        let now = Math.round(Date.now() / 60000);
        let time = now + 3600;

        // Update categories
        let categories = await this.database.categories.findMany({
            where: { expiry : { lt : time } }
        });

        for(let i = 0; i < categories.length; i++){
            let remoteUrl = await this.cloudService.getSharedLink(categories[i].icon);
            
            await this.database.categories.update({
                where: {
                    categoryId: categories[i].categoryId
                }, data : {
                    remoteUrl, expiry: now + 72000
                }
            });
        }

        // Update products
        let products = await this.database.products.findMany({
            where: { expiry : { lt : time } }
        });
        
        for(let i = 0; i < products.length; i++){
            let remoteUrl = await this.cloudService.getSharedLink(products[i].image);
            
            await this.database.products.update({
                where: {
                    productId: products[i].productId
                }, data : {
                    remoteUrl, expiry: now + 72000
                }
            });
        }

        // Update variants
        let variants = await this.database.productVariants.findMany({
            where: { expiry : { lt : time } }
        });
        
        for(let i = 0; i < variants.length; i++){
            let remoteUrl = await this.cloudService.getSharedLink(variants[i].image);
            
            await this.database.productVariants.update({
                where: {
                    variantId: variants[i].variantId
                }, data : {
                    remoteUrl, expiry: now + 72000
                }
            });
        }
    }

    /**
     * Get general app information
     * 
     * @returns General information
     */
    async getInfo() : Promise<DataBase>
    {
        await this.updateExpiryImages();
        
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
                        gender: true,
                        url: true,
                        description: true,
                        price: true,
                        isSet: true,
                        isNew: true,
                        element1Id: true,
                        element2Id: true,
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