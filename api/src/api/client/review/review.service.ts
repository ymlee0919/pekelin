import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { ReviewContent, ReviewLink } from "./review.types";

/**
 * Service for client review
 */
@Injectable()
export class ClientReviewService {

    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(
        private readonly database:DatabaseService
    ){ }

    async getAll() : Promise<ReviewContent[]> {
        let reviews = await this.database.reviews.findMany({
            select: {
                rate: true,
                comment: true,
                createdAt: true,
                Link: {
                    select : {
                        Client : {
                            select: {
                                name: true,
                                place: true
                            }
                        }
                    }
                }
            }
        });

        return reviews.map(review => {
            return {
                clientPlace: review.Link.Client.place,
                clientName: review.Link.Client.name,
                rate: review.rate,
                comment: review.comment,
                date: review.createdAt
            }
        });
    }

    async getReview(url: string) : Promise<ReviewLink> {

        let link = await this.database.reviewLinks.findFirst({
            where: { url }
        });

        if(!link)
            throw new NotFoundException("Invalid review link");

        let review = await this.database.reviewLinks.findFirst({
            where: { linkId: link.linkId },
            include: { Review : true, Client: true }
        });

        return {
            linkId: review.linkId,
            url: review.url,
            clientName: review.Client.name,
            Review: review.Review,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt
        }
    }

    async makeReview(url: string, rate: number, comment: string) : Promise<boolean> {
        
        // Validate the link exists
        let link = await this.database.reviewLinks.findFirst({
            where: { url }
        });

        if(!link)
            throw new NotFoundException("Invalid review link");

        // Validate the review is not made
        let count = await this.database.reviews.count({where : {
            linkId: link.linkId
        }});

        if(count)
            return false;
        

        // Create the review
        await this.database.$transaction(async (database) => {
            // Create the review
            await database.reviews.create({
                data: {
                    comment, rate, linkId: link.linkId, createdAt: new Date()
                }
            });

            // Update the link
            await database.reviewLinks.update({
                where: { linkId : link.linkId},
                data: { updatedAt: new Date() }
            })
        })

        return true;
    }

}