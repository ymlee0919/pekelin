import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { CreatedReviewLink, ReviewLink } from "./reviews.types";
import { name2url } from "src/services/utils/string.utils";


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

    async createLink(clientName: string) : Promise<CreatedReviewLink> {

        // Build the url
        let firstName = name2url(clientName.toLowerCase().split(' ')[0]);
        let today = new Date();
        let date = today.getFullYear().toString() 
                + today.getMonth().toString().padStart(2,'0') 
                + today.getDate().toString().padStart(2,'0');
        
        let url = firstName + date;

        let created = this.database.reviewLinks.create({
            data:
                {clientName, url}
        });

        return created;
    }

    async getList() : Promise<ReviewLink[]> {
        return await this.database.reviewLinks.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

}