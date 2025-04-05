import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import ReviewsHttpProvider from "./Reviews.HttpProvider";
import { CreatedReviewLink, Review, ReviewDTO, ReviewLink } from "./Reviews.Types";

export default class ReviewLinksStore extends Store<Array<ReviewLink>> {
	private _provider: ReviewsHttpProvider;

	constructor() {
		super();
		this._provider = new ReviewsHttpProvider();
	}

	protected getData(): Promise<Array<ReviewLink>> {
		return this._provider.load();
	}

	protected get provider(): ReviewsHttpProvider {
		return this._provider as ReviewsHttpProvider;
	}

	async getReview(linkId: number): Promise<Review> {
		let review = await this.provider.get(linkId);
		return review;
	}

	async create(name: string, place: string): Promise<EventResult<CreatedReviewLink | null>> {
		try {
			let created = await this.provider.createLink(name, place);

			return {
				success: true,
				message: "Link successfully created",
				info: created,
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async updateReview(linkId: number | string, review: ReviewDTO) : Promise<EventResult<Review | null>> {
		try {
			let link = (typeof linkId == "number") ? linkId : parseInt(linkId);
			let created = await this.provider.updateReview(link, review);

			return {
				success: true,
				message: "Review successfully updated",
				info: created,
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async delete(linkId: number): Promise<EventResult<ReviewLink | null>> {
		try {
			let deleted = await this.provider.deleteLink(linkId);

			return {
				success: true,
				message: "Link successfully deleted",
				info: deleted
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}
}

