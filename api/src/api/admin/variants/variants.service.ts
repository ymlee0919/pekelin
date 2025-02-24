import { Injectable, NotFoundException } from "@nestjs/common";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";
import { DatabaseService } from "src/services/database/database.service";
import { ImageSrc } from "src/api/common/types/common.types";
import { name2url } from "src/services/utils/string.utils";
import { BasicFeature, BasicVariant, BasicVariantInfo, CreatedVariant, UpdatedVariant, Variant } from "./variants.types";
import { VariantDTO } from "./variants.dto";
import { FeatureDTO } from "../products/products.dto";
import { FeatureStatus } from "../products/products.types";

/**
 * Class to manage the unique settings record of the business
 */
@Injectable()
export class VariantsService {
    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(private readonly database: DatabaseService) {}

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

        let result = await this.database.productVariants.findMany({
            where: {
                productId
            }
        });

        return result;

    }

    async get(productId: number, variantId: number) : Promise<Variant | null> {
        let result =  await this.database.productVariants.findFirst({
            where: {productId}, 
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

        let updated = await this.database.$transaction(async (database) => {

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

        return updated;
    }

    async deleteVariant(productId: number, variantId: number) : Promise<BasicVariant>{

        // Validate variant exists
        let count = await this.database.productVariants.count({
            where: {
                productId, variantId
            }
        });

        if(!!count)
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