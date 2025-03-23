import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import ReviewsHttpProvider from "./Reviews.HttpProvider";
import { CreatedReviewLink, ReviewLink } from "./Reviews.Types";

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

	async create(name: string, place: string): Promise<EventResult<CreatedReviewLink | null>> {
		try {
			let created = await this.provider.createLink(name, place);

			return {
				success: true,
				message: "Account successfully created",
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
}

