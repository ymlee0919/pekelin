import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { InvalidOperationError } from "src/common/errors/invalid.error";

import { name2url } from "src/services/utils/string.utils";
import { ImageSrc } from "src/common/types/common.types";
import { CategoryInfo, CreatedCategory, UpdatedCategory } from "./categories.types";
import { CategoryDTO } from "./categories.dto";
import { CloudService } from 'src/services/cloud/cloud.service';

/**
 * Service for categories
 */
@Injectable()
export class CategoriesService {

    private static defaultSelection = {
        categoryId: true, category: true, description: true, url: true, icon: true, remoteUrl: true, expiry: true
    }
    
    /**
     * Constructor of the class
     * @param database Database provider category
     */
    constructor(
        private readonly database:DatabaseService,
        private readonly cloudService: CloudService
    ){}

    private async updateExpiryImages() {

        let now = Math.round(Date.now() / 60000);
        let time = now + 3600;

        let expires = await this.database.categories.findMany({
            where: {
                expiry : {
                    lt : time
                }
            }
        });

        for(let i = 0; i < expires.length; i++){
            let remoteUrl = await this.cloudService.getSharedLink(expires[i].icon);
            
            await this.database.categories.update({
                where: {
                    categoryId: expires[i].categoryId
                }, data : {
                    remoteUrl, expiry: now + 72000
                }
            });
        }
    }

    /**
     * Get the list of images
     * 
     * @returns List of images
     */
    async getList() : Promise<Array<CategoryInfo>|null>
    {
        await this.updateExpiryImages();

        let list = await this.database.categories.findMany({
            orderBy: { category: 'asc'},
            select: CategoriesService.defaultSelection
        });

        return list;
    }

    private async existsCategory(categoryName: string) : Promise<boolean> {
        let categories = await this.database.categories.count({
          where: {
            category: {
              equals: categoryName.toLowerCase(),
              //mode: 'insensitive',
            },
          },
        });

        return categories > 0;
    }

    /**
     * Add new category to database
     * 
     * @param category New category
     * @param image Image (Local, remote & expiry)
     * @returns True if success, otherwise throw an exception
     */
    async addCategory(category: CategoryDTO, image: ImageSrc) : Promise<CreatedCategory>
    {
        // Validate if new category exists
        let exists = await this.existsCategory(category.category);
        if(exists)
            throw new InvalidOperationError(`The category ${category.category} already exists`);

        // Create the newone
        let created = await this.database.categories.create({
            data : {
                category: category.category,
                description: category.description,
                icon: image.local,
                remoteUrl: image.remote,
                expiry: image.expiryRemote,
                url: name2url(category.category)
            }, select : {
                createdAt: true, ...CategoriesService.defaultSelection
            }
        });

        return created;
    }

    /**
     * Update the category information
     * 
     * @param categoryId Service id to update
     * @param newCategory New category
     * @param newImage New image
     * @returns True if value is updated
     */
    async updateCategory(categoryId: number, newCategory: CategoryDTO, newImage?: ImageSrc) : Promise<UpdatedCategory> 
    {
        let currentCategory = await this.database.categories.findFirst({where : {
            categoryId : categoryId
        }});

        // Validate the category exists
        if(!currentCategory)
            throw new InvalidOperationError('The category you want to update do not exist');

        // Validate the new category name do not exists
        if(currentCategory.category.toLowerCase() != newCategory.category.toLowerCase()){
            let exists = await this.existsCategory(newCategory.category);
            if(exists)
                throw new InvalidOperationError(`The category ${newCategory.category} already exists`);
        }

        let data : Partial<UpdatedCategory> = {
            category: newCategory.category,
            description: newCategory.description,
            url: name2url(newCategory.category),
            updatedAt: new Date()
        };

        if(newImage) {
            data.icon = newImage.local;
            data.remoteUrl = newImage.remote;
            data.expiry = newImage.expiryRemote;
        }

        let updated : UpdatedCategory = await this.database.categories.update({
            where: {
                categoryId: currentCategory.categoryId
            }, data, 
            select: {
                updatedAt: true, ...CategoriesService.defaultSelection
            }
        });

        updated.oldImage = currentCategory.icon;

        return updated;
    }

    /**
     * Remove a category given the id
     * 
     * @param categoryId Id icon to be deleted
     * @returns True if the record was deleted. Throw exception if the imageId do not exists
     * @throws InvalidOperationError
     */
    async deleteCategory(categoryId: number) : Promise<CategoryInfo> 
    {
        let deleted = await this.database.categories.delete({ where: { categoryId }});
        if(!deleted)
            throw new InvalidOperationError('Category not foud');

        return deleted;
    }

}