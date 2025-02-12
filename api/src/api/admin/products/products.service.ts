import { Injectable, NotFoundException } from "@nestjs/common";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";
import { DatabaseService } from "src/services/database/database.service";
import { ProductDTO } from "./products.dto";
import { ImageSrc } from "src/api/common/types/common.types";
import { Product, CreatedProduct, UpdatedProduct, BasicProduct } from "./products.types";
import { name2url } from "src/services/utils/string.utils";

/**
 * Class to manage the unique settings record of the business
 */
@Injectable()
export class ProductsService {
    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(private readonly database: DatabaseService) {}


    async getList(): Promise<Product[]> {
        let products = await this.database.products.findMany({
            include : {
                Category: true,
                Features: true
            }
        })
        return products;
    }

    async get(productId: number) : Promise<Product | null> {
        return await this.database.products.findFirst({
            where: {productId}, 
            include : {
                Category: true,
                Features: true
            }
        });
    }

    async createProduct(product: ProductDTO, image: ImageSrc) : Promise<CreatedProduct> {

        // Validate the category exists
        let category = await this.database.categories.findFirst({
            where: {
                categoryId: product.categoryId
            }
        });

        if(!category)
            throw new InvalidOperationError('The selected category do not exists');

        

        let created = await this.database.products.create({
            data: {
                categoryId: product.categoryId,
                price: product.price,
                name: product.name,
                url: name2url(product.name),
                isBestSeller: product.bestSeller,
                isNew: product.new,
                visible: product.visible,
                description: product.description,
                image: image.local,
                remoteUrl: image.remote,
                expiry: image.expiryRemote,
                Features: {
                    createMany:{
                        data: product.features
                    }
                }
            }
        });

        return created;
    }

    async updateProduct(productId: number, 
        newProduct: ProductDTO,
        image?: ImageSrc
    ) : Promise<UpdatedProduct> {

        // Validate the selected product already exists
        let oldProduct = await this.database.products.findFirst({
            where: { productId },
        });

        if(!oldProduct)
            throw new NotFoundException("The selected product do not exists");

        // Validate the new category exists
        let category = await this.database.categories.findFirst({
            where : {
                categoryId : newProduct.categoryId
            }
        })

        if(!category)
            throw new NotFoundException("Selected category do not exists");

        // Delete frist the items and insert them again
        let updated = await this.database.$transaction(async (database) => {

            await database.features.deleteMany({where: {
                productId
            }});

            let data : Partial<BasicProduct> = {
                categoryId: newProduct.categoryId,
                price: newProduct.price,
                name: newProduct.name,
                url: name2url(newProduct.name),
                isBestSeller: newProduct.bestSeller,
                isNew: newProduct.new,
                visible: newProduct.visible,
                description: newProduct.description,
            };

            if(image) {
                data.image = image.local;
                data.remoteUrl = image.remote;
                data.expiry = image.expiryRemote;
            }

            let record = await database.products.update({
                where: { productId },
                data: {
                    ...data,
                    Features: {
                        createMany: {
                            data: newProduct.features,
                        },
                    },
                }
            });
            return record;
        });

        return updated;
    }

    async deleteProduct(productId: number) : Promise<BasicProduct>{

        // Validate there are not product types inside it
        let count = await this.database.productTypes.count({
            where: {
                productId
            }
        });

        if(!!count)
            throw new InvalidOperationError('The product you want to delete have variants inside. Can not be deleted.')

        let deleted = await this.database.$transaction(async (database) => {
            await database.features.deleteMany({
                where: {
                    productId
                }
            });

            return await database.products.delete({
                where : {
                    productId
                }
            })
        });

        return deleted;
    }
}