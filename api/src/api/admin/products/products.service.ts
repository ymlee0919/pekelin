import { Injectable, NotFoundException } from "@nestjs/common";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";
import { DatabaseService } from "src/services/database/database.service";
import { FeatureDTO, ProductDTO, ProductSetDTO } from "./products.dto";
import { ImageSrc } from "src/api/common/types/common.types";
import { Product, CreatedProduct, UpdatedProduct, BasicProduct, BasicProductInfo, BasicFeature, FeatureStatus, UpdatedSet, CategorySource, ProductSet } from "./products.types";
import { name2url } from "src/services/utils/string.utils";
import { CloudService } from 'src/services/cloud/cloud.service';

import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';

const writeFile = promisify(fs.writeFile);

/**
 * Class to manage the unique settings record of the business
 */
@Injectable()
export class ProductsService {
    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(
        private readonly database: DatabaseService,
        private readonly cloudService: CloudService
    ) {}

    private async updateExpiryImages() {

        let now = Math.round(Date.now() / 60000);
        let time = now + 3600;

        let expires = await this.database.products.findMany({
            where: {
                expiry : {
                    lt : time
                }
            }
        });

        for(let i = 0; i < expires.length; i++){
            let remoteUrl = await this.cloudService.getSharedLink(expires[i].image);
            
            await this.database.products.update({
                where: {
                    productId: expires[i].productId
                }, data : {
                    remoteUrl, expiry: now + 72000
                }
            });
        }
    }

    async getList(): Promise<BasicProductInfo[]> {

        await this.updateExpiryImages();

        const productsWithVariantsCount = await this.database.products.findMany({
            select: {
                productId: true,
                name: true,
                gender: true,
                basePrice: true,
                price: true,
                remoteUrl: true,
                isBestSeller: true,
                isNew: true,
                isSet: true,
                visible: true,
                Category: {
                    select: {
                        category: true
                    }
                },
                _count: {
                    select: {
                        Variants: true,
                    }
                }
            },
            orderBy: [{
                Category : {
                    categoryId: 'asc'
                } }, {
                    name: 'asc'
                }
            ]
                
            
        });
        
        // Format the result to match the desired output
        const result = productsWithVariantsCount.map(product => ({
            productId: product.productId,
            name: product.name,
            gender: product.gender,
            category: product.Category.category,
            remoteUrl: product.remoteUrl,
            basePrice: product.basePrice,
            price: product.price,
            variants: product._count.Variants,
            isSet: product.isSet,
            isBestSeller: product.isBestSeller,
            isNew: product.isNew,
            visible: product.visible,
        }));

        return result;
    }

    /**
     * Get the list of images
     * 
     * @returns List of images
     */
    async getSetsSource() : Promise<Array<CategorySource>>
    {

        let list = await this.database.categories.findMany({
            orderBy: { category: 'asc'},
            select: {
                categoryId: true,
                category: true,
                Products: {
                    select : {
                        productId: true,
                        name: true
                    },
                    where: {
                        isSet: false
                    }
                }
            }
        });

        return list;
    }

    async getFullList(): Promise<Product[]> {
        let products = await this.database.products.findMany({
            include : {
                Category: true,
                Features: true
            }/*,
            where: {
                Category: {
                    url : categoryUrl
                }
            }*/
        })
        return products;
    }

    async get(productId: number) : Promise<Product | null> {
        let product = await this.database.products.findFirst({
            where: {productId}, 
            include : {
                Category: true,
                Features: true
            }
        });

        let { element1Id, element2Id, ...item } = product;

        return item;
    }

    async getSet(productId: number) : Promise<ProductSet | null> {
        let product = await this.database.products.findFirst({
            where: {productId}, 
            include : {
                Category: true,
                Features: true
            }
        });

        let {element1Id, element2Id, ...item} = product;

        let set = {
            product1: element1Id,
            product2: element2Id,
            ...item
        };

        return set;
    }

    async createProduct(product: ProductDTO, image: ImageSrc) : Promise<CreatedProduct> {

        // Validate the category exists
        let category = await this.database.categories.findFirst({
            where: {
                categoryId: parseInt(product.categoryId.toString())
            }
        });

        if(!category)
            throw new InvalidOperationError('The selected category do not exists');

        // Extract features
        let features : BasicFeature[] = [];
        product.features.forEach((feature: FeatureDTO) => {
            if(feature.status != FeatureStatus.Deleted)
                features.push({ title: feature.title, content: feature.content })
        });

        let created = await this.database.products.create({
            data: {
                categoryId: product.categoryId,
                price: product.price,
                gender: (product.gender == "M" ? "M" : "F"),
                basePrice: product.basePrice,
                name: product.name,
                url: name2url(product.name),
                isBestSeller: product.isBestSeller,
                isNew: product.isNew,
                visible: product.visible,
                description: product.description,
                image: image.local,
                remoteUrl: image.remote,
                expiry: image.expiryRemote,
                isSet: false,
                createdAt: new Date(),
                Features: {
                    createMany:{
                        data: features
                    }
                }
            }
        });

        return created;
    }

    async createProductSet(product: ProductSetDTO, image: ImageSrc) : Promise<CreatedProduct> {

        // Validate the category exists
        let category = await this.database.categories.findFirst({
            where: {
                categoryId: product.categoryId
            }
        });

        if(!category)
            throw new InvalidOperationError('The selected category do not exists');

        // Validate the products exists
        let product1 = await this.database.products.findFirst({
            where: {
                categoryId: product.categoryId,
                productId: product.product1
            }
        });
        if(!product1)
            throw new InvalidOperationError('The first product do not exists');

        let product2 = await this.database.products.findFirst({
            where: {
                categoryId: product.categoryId,
                productId: product.product2
            }
        });
        if(!product2)
            throw new InvalidOperationError('The second product do not exists');

        // Extract features
        let features : BasicFeature[] = [];
        product.features.forEach((feature: FeatureDTO) => {
            if(feature.status != FeatureStatus.Deleted)
                features.push({ title: feature.title, content: feature.content })
        });

        let created = await this.database.products.create({
            data: {
                categoryId: product.categoryId,
                price: product.price,
                gender: (product.gender == "M" ? "M" : "F"),
                basePrice: product.basePrice,
                name: product.name,
                url: name2url(product.name),
                isBestSeller: product.isBestSeller,
                isNew: product.isNew,
                visible: product.visible,
                description: product.description,
                image: image.local,
                remoteUrl: image.remote,
                expiry: image.expiryRemote,
                createdAt: new Date(),
                isSet: true,
                element1Id: product1.productId,
                element2Id: product2.productId,
                Features: {
                    createMany:{
                        data: features
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

        let updated : UpdatedProduct = await this.database.$transaction(async (database) => {

            let data : Partial<UpdatedProduct> = {
                categoryId: newProduct.categoryId,
                price: newProduct.price,
                basePrice: newProduct.basePrice,
                name: newProduct.name,
                gender: (newProduct.gender == "M" ? "M" : "F"),
                url: name2url(newProduct.name),
                isBestSeller: newProduct.isBestSeller,
                isNew: newProduct.isNew,
                visible: newProduct.visible,
                description: newProduct.description,
                updatedAt: new Date()
            };

            if(image) {
                data.image = image.local;
                data.remoteUrl = image.remote;
                data.expiry = image.expiryRemote;
            }

            let record = await database.products.update({
                where: { productId }, data
            });

            // Update each feature
            for( let feature of newProduct.features){

                switch(feature.status) {
                    case FeatureStatus.New:
                        await database.productFeatures.create({data : {
                            productId, title: feature.title, content: feature.content, createdAt: new Date()
                        }})
                        break;

                    case FeatureStatus.Updated:
                        await database.productFeatures.update({
                            where: {
                                featureId : feature.featureId, productId
                            },
                            data : {
                                title: feature.title, content: feature.content, updatedAt: new Date()
                            }
                        })
                        break;

                    case FeatureStatus.Deleted:
                        await database.productFeatures.delete({
                            where: {
                                featureId : feature.featureId, productId
                            }});
                        break;

                    default: break;
                }
            }

            return record;
        });

        updated.oldImage = oldProduct.image;

        return updated;
    }

    async updateProductSet(productId: number, 
        newProduct: ProductSetDTO,
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

        // Validate the products exists
        let product1 = await this.database.products.findFirst({
            where: {
                categoryId: newProduct.categoryId,
                productId: newProduct.product1
            }
        });
        if(!product1)
            throw new InvalidOperationError('The first product do not exists');

        let product2 = await this.database.products.findFirst({
            where: {
                categoryId: newProduct.categoryId,
                productId: newProduct.product2
            }
        });
        if(!product2)
            throw new InvalidOperationError('The second product do not exists');

        let updated = await this.database.$transaction(async (database) => {

            let data : Partial<UpdatedSet> = {
                categoryId: newProduct.categoryId,
                price: newProduct.price,
                basePrice: newProduct.basePrice,
                name: newProduct.name,
                gender: (newProduct.gender == "M" ? "M" : "F"),
                url: name2url(newProduct.name),
                isBestSeller: newProduct.isBestSeller,
                isNew: newProduct.isNew,
                visible: newProduct.visible,
                description: newProduct.description,
                element1Id: newProduct.product1,
                element2Id: newProduct.product2,
                updatedAt: new Date()
            };

            if(image) {
                data.image = image.local;
                data.remoteUrl = image.remote;
                data.expiry = image.expiryRemote;
            }

            let record = await database.products.update({
                where: { productId }, data
            });

            // Update each feature
            for( let feature of newProduct.features){

                switch(feature.status) {
                    case FeatureStatus.New:
                        await database.productFeatures.create({data : {
                            productId, title: feature.title, content: feature.content, createdAt: new Date()
                        }})
                        break;

                    case FeatureStatus.Updated:
                        await database.productFeatures.update({
                            where: {
                                featureId : feature.featureId, productId
                            },
                            data : {
                                title: feature.title, content: feature.content, updatedAt: new Date()
                            }
                        })
                        break;

                    case FeatureStatus.Deleted:
                        await database.productFeatures.delete({
                            where: {
                                featureId : feature.featureId, productId
                            }});
                        break;

                    default: break;
                }
            }

            return record;
        });

        return updated;
    }

    async changeVisibility(productId: number) : Promise<UpdatedProduct> {
        // Validate the selected product already exists
        let product = await this.database.products.findFirst({
            where: { productId },
            select: { productId: true, visible: true}
        });

        if(!product)
            throw new NotFoundException("The selected product do not exists");

        let record = await this.database.products.update({
            where: { productId }, 
            data : {
                visible: !product.visible,
                updatedAt: new Date()
            }
        });

        return record;
    }

    async deleteProduct(productId: number) : Promise<BasicProduct>{

        // Validate there are not features types inside it
        let count = await this.database.productVariants.count({
            where: {
                productId
            }
        });

        if(!!count)
            throw new InvalidOperationError('The product you want to delete have variants inside. Can not be deleted.')

        let deleted = await this.database.$transaction(async (database) => {
            await database.productFeatures.deleteMany({
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

    /**
         * Get general app information
         * 
         * @returns General information
         */
        async save() : Promise<boolean>
        {
            //await this.updateExpiryImages();
            
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
                                },
                                orderBy: {
                                    name: 'asc'
                                }
                            }
                        },where : {
                            visible: true
                        },
                        orderBy: {
                            name: 'asc'
                        }
                    }
                },
                orderBy: {
                    category: 'asc'
                }
            });

            const jsonData = JSON.stringify(database, null, 2);

            let outputPath = join(__dirname, '../../../../../', '/public/info/db.json');
            await writeFile(outputPath, jsonData);
    
            return true;
        }
}