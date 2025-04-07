import { CommonProps } from "../../../types/Common";
import { EmptyEvent} from "../../../types/Events";
import useStores from "../../../hooks/useStores";
import { Review, ReviewLink } from "../../../store/remote/reviews/Reviews.Types";
import { useEffect, useState } from "react";
import { StoreStatus } from "../../../store/remote/Store";
import ErrorMessage from "../../../components/ErrorMessage";
import { BsStar, BsStarFill } from "react-icons/bs";

export interface ReviewModalProps extends CommonProps {
    review: ReviewLink;
	onClose: EmptyEvent;
}

const InnerLoading = () => {
    return <>
        <div className="text-center w-full py-10">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
            <br></br>
            Loading...
        </div>
    </>
}

const ReviewModal = (props : ReviewModalProps) => {

    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [error, setError] = useState<string>("");
    const [review, setReview] = useState<Review|null>(null)

    const stores = useStores()

    const drawStar = (i : number) => {
        if(!review || !review.Review)
            return null;

        if(i <= review.Review?.rate)
            return <BsStarFill key={i} className="text-yellow-500 text-sm"/ >
        return <BsStar key={i} className="text-yellow-500 text-sm"/ >
    }
    
    useEffect(() => {
        setStatus(StoreStatus.LOADING);    
        stores.reviewLinksStore.getReview(props.review.linkId).then(
            (review: Review|null) => { setStatus(StoreStatus.READY); setReview(review);}
        ).catch((reason) => { setError(reason) });
    }, []);

    return <>
        <dialog className="modal modal-open">
            <div className="modal-box bg-base-200">
                <h3 className="font-bold text-lg pb-2">Review information</h3>
                {status == StoreStatus.LOADING && <InnerLoading />}
			    {status == StoreStatus.ERROR && <ErrorMessage text={error} />}

			    {(status == StoreStatus.READY && review) && <>
                    <p><strong>Client:</strong> {review.clientName}</p>
                    <p><strong>Place:</strong> {review.place}</p>
                    <p><strong>Link:</strong> {import.meta.env.VITE_REVIEW_URL + review.url}</p>
                    <br></br>
                    <fieldset>
                        <legend>Review</legend>
                        <p><strong>Stars:</strong> <span className="inline-flex gap-1">
                            {[1,2,3,4,5].map(drawStar)}                    
                        </span></p>
                        <p><strong>Comment:</strong> {review.Review?.comment}</p>
                        <p><strong>Date:</strong> {review.Review && new Date(review.Review.createdAt.toString()).toLocaleDateString()}</p>
                    </fieldset>
                    <br></br>
                </>}
                
                <div className="modal-action">
                    {/*<button type="submit" className="btn btn-info btn-sm mr-5">Add</button>*/}
                    <a className="btn btn-sm" onClick={props.onClose}>Close</a>
                </div>
            </div>
        </dialog>
    </>
};

export default ReviewModal;