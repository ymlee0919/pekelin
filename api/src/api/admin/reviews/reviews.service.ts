import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";
import { CreatedReviewLink, ReviewLink } from "./reviews.types";


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
        let firstName = clientName.toLowerCase().split(' ')[0];
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