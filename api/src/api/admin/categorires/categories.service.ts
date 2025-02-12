import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";

import { name2url } from "src/services/utils/string.utils";
import { ImageSrc } from "src/api/common/types/common.types";
import { CategoryInfo, CreatedCategory, UpdatedCategory } from "./categories.types";

/**
 * Service for categories
 */
@Injectable()
export class CategoriesService {

    private static defaultSelection = {
        categoryId: true, category: true, url: true, icon: true, remoteUrl: true, expiry: true
    }
    
    /**
     * Constructor of the class
     * @param database Database provider category
     */
    constructor(
        private readonly database:DatabaseService
    ){}

    /**
     * Get the list of images
     * 
     * @returns List of images
     */
    async getList() : Promise<Array<CategoryInfo>|null>
    {
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
              mode: 'insensitive',
            },
          },
        });

        return categories > 0;
    }

    /**
     * Add new category to database
     * 
     * @param category New category name
     * @param image Image (Local, remote & expiry)
     * @returns True if success, otherwise throw an exception
     */
    async addCategory(category: string, image: ImageSrc) : Promise<CreatedCategory>
    {
        // Validate if new category exists
        let exists = await this.existsCategory(category);
        if(exists)
            throw new InvalidOperationError(`The category ${category} already exists`);

        console.log(image);

        // Create the newone
        let created = await this.database.categories.create({
            data : {
                category: category,
                icon: image.local,
                remoteUrl: image.remote,
                expiry: image.expiryRemote,
                url: name2url(category)
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
     * @param newCategoryName New category name
     * @param newImage New image
     * @returns True if value is updated
     */
    async updateCategory(categoryId: number, newCategoryName: string, newImage?: ImageSrc) : Promise<UpdatedCategory> 
    {
        let currentService = await this.database.categories.findFirst({where : {
            categoryId : categoryId
        }});

        // Validate the category exists
        if(!currentService)
            throw new InvalidOperationError('The category you want to update do not exist');

        // Validate the new category name do not exists
        if(currentService.category.toLowerCase() != newCategoryName.toLowerCase()){
            let exists = await this.existsCategory(newCategoryName);
            if(exists)
                throw new InvalidOperationError(`The category ${newCategoryName} already exists`);
        }

        let data : Partial<UpdatedCategory> = {
            category: newCategoryName,
            url: name2url(newCategoryName),
            updatedAt: new Date()
        };

        if(newImage) {
            data.icon = newImage.local;
            data.remoteUrl = newImage.remote;
            data.expiry = newImage.expiryRemote;
        }

        let updated = await this.database.categories.update({
            where: {
                categoryId: currentService.categoryId
            }, data, 
            select: {
                updatedAt: true, ...CategoriesService.defaultSelection
            }
        });

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