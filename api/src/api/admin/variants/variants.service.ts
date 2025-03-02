import { Injectable, NotFoundException } from "@nestjs/common";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";
import { DatabaseService } from "src/services/database/database.service";
import { ImageSrc } from "src/api/common/types/common.types";
import { BasicFeature, BasicVariant, BasicVariantInfo, CreatedVariant, UpdatedVariant, Variant } from "./variants.types";
import { VariantDTO } from "./variants.dto";
import { FeatureDTO } from "../products/products.dto";
import { FeatureStatus } from "../products/products.types";
import { CloudService } from 'src/services/cloud/cloud.service';

/**
 * Class to manage the unique settings record of the business
 */
@Injectable()
export class VariantsService {
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

        let expires = await this.database.productVariants.findMany({
            where: {
                expiry : {
                    lt : time
                }
            }
        });

        for(let i = 0; i < expires.length; i++){
            let remoteUrl = await this.cloudService.getSharedLink(expires[i].image);
            
            await this.database.productVariants.update({
                where: {
                    variantId: expires[i].variantId
                }, data : {
                    remoteUrl, expiry: now + 72000
                }
            });
        }
    }

    async validateProductExistence(productId: number) : Promise<boolean> {
        let count = await this.database.products.count({
            where: {
                productId
            }
        });

        if(!count)
            throw new InvalidOperationError("The requested product do not exists");

        return true;
    }

    async getList(productId: number): Promise<BasicVariant[]> {
        
        await this.validateProductExistence(productId);

        await this.updateExpiryImages();

        let result = await this.database.productVariants.findMany({
            where: {
                productId
            },
            orderBy: {
                name: 'asc'
            }
        });

        return result;

    }

    async get(productId: number, variantId: number) : Promise<Variant | null> {
        let result =  await this.database.productVariants.findFirst({
            where: {productId, variantId}, 
            include : {
                Product: true,
                Features: true
            }
        });

        return result;
    }

    async createVariant(productId: number, variant: VariantDTO, image: ImageSrc) : Promise<CreatedVariant> {

        // Validate the category exists
        await this.validateProductExistence(productId);

        // Extract features
        let features : BasicFeature[] = [];
        variant.features.forEach((feature: FeatureDTO) => {
            if(feature.status != FeatureStatus.Deleted)
                features.push({ title: feature.title, content: feature.content })
        });

        let created = await this.database.productVariants.create({
            data: {
                productId: productId,
                name: variant.name,
                isBestSeller: variant.isBestSeller,
                isNew: variant.isNew,
                visible: variant.visible,
                description: variant.description,
                image: image.local,
                remoteUrl: image.remote,
                expiry: image.expiryRemote,
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

    async updateVariant(productId: number, 
        variantId: number,
        newVariant: VariantDTO,
        image?: ImageSrc
    ) : Promise<UpdatedVariant> {

        // Validate the selected product already exists
        let oldVariant = await this.database.productVariants.findFirst({
            where: { variantId, productId },
        });

        if(!oldVariant)
            throw new NotFoundException("The selected variant do not exists");

        let updated : UpdatedVariant = await this.database.$transaction(async (database) => {

            let data : Partial<UpdatedVariant> = {
                name: newVariant.name,
                isBestSeller: newVariant.isBestSeller,
                isNew: newVariant.isNew,
                visible: newVariant.visible,
                description: newVariant.description,
                updatedAt: new Date()
            };

            if(image) {
                data.image = image.local;
                data.remoteUrl = image.remote;
                data.expiry = image.expiryRemote;
            }

            let record = await database.productVariants.update({
                where: { variantId }, data
            });

            // Update each feature
            for( let feature of newVariant.features){

                switch(feature.status) {
                    case FeatureStatus.New:
                        await database.variantsFeatures.create({data : {
                            variantId, title: feature.title, content: feature.content, createdAt: new Date()
                        }})
                        break;

                    case FeatureStatus.Updated:
                        await database.variantsFeatures.update({
                            where: {
                                featureId : feature.featureId, variantId
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

        updated.oldImage = oldVariant.image;

        return updated;
    }

    async changeVisibility(productId: number, variantId: number) : Promise<UpdatedVariant> {
        
        // Validate the selected variant already exists
        let variant = await this.database.productVariants.findFirst({
            where: { productId, variantId },
            select: { variantId: true, visible: true}
        });

        if(!variant)
            throw new NotFoundException("The selected variant do not exists");

        let record = await this.database.productVariants.update({
            where: { variantId }, 
            data : {
                visible: !variant.visible,
                updatedAt: new Date()
            }
        });

        return record;
    }

    async deleteVariant(productId: number, variantId: number) : Promise<BasicVariant>{

        // Validate variant exists
        let count = await this.database.productVariants.count({
            where: {
                productId, variantId
            }
        });

        if(!count)
            throw new InvalidOperationError('The product variant you want to delete do not exsits.')

        let deleted = await this.database.$transaction(async (database) => {
            await database.variantsFeatures.deleteMany({
                where: {
                    variantId
                }
            });

            return await database.productVariants.delete({
                where : {
                    variantId
                }
            })
        });

        return deleted;
    }
}