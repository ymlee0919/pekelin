import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { CreatedReviewLink, ReviewLink } from "./reviews.types";
import { name2url } from "src/services/utils/string.utils";
import { Review } from "src/api/client/review/review.types";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";
import { $Enums } from "@prisma/client";


/**
 * Servie for accounts
 */
@Injectable()
export class ReviewsService {

    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(private readonly database:DatabaseService){}

    async getList() : Promise<ReviewLink[]> {
        return await this.database.reviewLinks.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async createLink(clientName: string, place: string) : Promise<CreatedReviewLink> {

        // Build the url
        let firstName = name2url(clientName.toLowerCase().split(' ')[0]);
        let today = new Date();
        let date = today.getFullYear().toString() 
                + today.getMonth().toString().padStart(2,'0') 
                + today.getDate().toString().padStart(2,'0');
        
        let url = firstName + date;

        let created = this.database.reviewLinks.create({
            data:
                {clientName, place, url}
        });

        return created;
    }

    async get(linkId: number) : Promise<ReviewLink> {
        
        let link = await this.database.reviewLinks.findFirst({
            where: {linkId},
            include: {
                Review: true
            }
        });

        return link;
    }

    async deleteLink(linkId: number) : Promise<ReviewLink> {
        
        // Validate the link exists
        let link = await this.database.reviewLinks.findFirst({
            where: {linkId}
        });

        if(!link)
            throw new InvalidOperationError("Link not found");

        // Validate the link was not used
        if(link.status != $Enums.Status.READY)
            throw new InvalidOperationError("Can not delete the link");

        // Delete from database
        await this.database.reviewLinks.delete({
            where: {linkId}
        })

        return link;
    }
}