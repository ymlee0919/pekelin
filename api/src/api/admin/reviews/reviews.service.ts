import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/services/database/database.service";
import { CreatedReviewLink, ReviewLink, ReviewLinkData } from "./reviews.types";
import { name2url } from "src/services/utils/string.utils";
import { InvalidOperationError } from "src/common/errors/invalid.error";
import { $Enums } from "@prisma/client";
import { NotFoundError } from "src/common/errors/notFound.error";
import { ReviewDTO } from "./reviews.dto";
import {v4 as uuidv4} from 'uuid';


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
        let list = await this.database.reviewLinks.findMany({
            include: {
                Client: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return list.map(item => { return {
            linkId: item.linkId,
            url: item.url,
            clientName: item.Client.name,
            place: item.Client.place,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }})
    }

    private buildLink(clientName: string) : string {
        let firstName = name2url(clientName.toLowerCase().split(' ')[0]);
        let rest = uuidv4().split('-').slice(0, -2).join('-');
        
        let url = firstName + rest;

        return url;
    }

    async createClientLink(clientId : number) : Promise<CreatedReviewLink> {
        let client = await this.database.clients.findUnique({where: {clientId}});
        if(!client)
            throw new NotFoundError("Client not found");

        // Check if the client already have a link
        let links = await this.database.reviewLinks.count({
            where: {
                clientId
            }
        })
        if(links > 0)
            throw new InvalidOperationError("The client already have a review link");

        // Build the url
        let url = this.buildLink(client.name);

        let created = await this.database.reviewLinks.create({
            data: {
                url,
                clientId: client.clientId,
            }, select: {
                linkId: true,
                url: true,
                createdAt: true,
                Client: true
            }
        });

        return {
            linkId: created.linkId,
            url: created.url,
            clientName: created.Client.name,
            createdAt: created.createdAt
        };

    }

    async createLink(clientName: string, place: string) : Promise<CreatedReviewLink> {

        // Build the url
        let url = this.buildLink(clientName)

        let created = await this.database.reviewLinks.create({
            data: {
                url,
                Client: {
                    create : {
                        name: clientName,
                        place: place
                    }
                }
            }, select: {
                linkId: true,
                url: true,
                createdAt: true,
                Client: true
            }
        });

        return {
            linkId: created.linkId,
            url: created.url,
            clientName: created.Client.name,
            createdAt: created.createdAt
        };
    }

    async get(linkId: number) : Promise<ReviewLinkData> {
        
        let link = await this.database.reviewLinks.findFirst({
            where: {linkId},
            include: {
                Review: true,
                Client: true
            }
        });

        return {
            linkId: link.linkId,
            url: link.url,
            clientName: link.Client.name,
            place: link.Client.place,
            createdAt: link.createdAt,
            Review: link.Review
        };
    }

    async updateReview(linkId: number, reviewDto: ReviewDTO) : Promise<ReviewLinkData> {
        let review = await this.database.reviews.findFirst({
            where: {
                linkId
            }
        });

        if(!review)
            throw new NotFoundError('Requested link do not exists or have not comment yet');

        await this.database.reviews.update({
            where: {
                reviewId: review.reviewId
            },
            data : {
                rate: reviewDto.rate,
                comment: reviewDto.comment
            }
        });

        return this.get(linkId);
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
        let deleted = await this.database.reviewLinks.delete({
            where: {linkId},
            include: {
                Client: true
            }
        })

        return  {
            linkId: deleted.linkId,
            url: deleted.url,
            clientName: deleted.Client.name,
            createdAt: deleted.createdAt
        };;
    }
}