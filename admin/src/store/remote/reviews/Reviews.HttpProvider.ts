import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { CreatedReviewLink, CreationReviewLink, ReviewLink, ReviewLinkInfo, Review } from "./Reviews.Types";

export default class ReviewsHttpProvider extends AxiosProvider<Array<ReviewLink>> {
	async load(): Promise<Array<ReviewLink>> {
		try {
			let links = await HttpProvider.get<null, Array<ReviewLinkInfo>>("/reviews");
			let result = links.map((info: ReviewLinkInfo) => {
				return {
					linkId : info.linkId,
					url: info.url,
					clientName: info.clientName,
					place: info.place,
					createdAt: new Date(info.createdAt),
					updatedAt: (!!info.updatedAt) ? new Date(info.updatedAt) : undefined
				}
			});

			return result;
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load links");
		}
	}

	async get(linkId: number): Promise<Review> {
		try {
			let review = await HttpProvider.get<null, Review>(`/reviews/${linkId}`);
			return review;
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load review");
		}
	}

	async createLink(clientName: string, place: string): Promise<CreatedReviewLink | null> {
		try {
			let created = await HttpProvider.post<CreationReviewLink, CreatedReviewLink>("/reviews", {
				name: clientName, place
			});
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the review link");
		}
		return null;
	}

	async deleteLink(linkId: number): Promise<ReviewLink | null> {
		try {
			let deleted = await HttpProvider.delete<null, ReviewLink>(`/reviews/${linkId}`);
			return deleted;
		} catch (error: any) {
			this.handleError(error, "Unable to delete the review link");
		}
		return null;
	}
}