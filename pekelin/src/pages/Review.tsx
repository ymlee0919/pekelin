import { useEffect, useState } from "react";
import { StoreStatus } from "../main/Loader";
import { useSearchParams } from "react-router-dom";
import HttpProvider from "../services/HttpProvider";
import Loading from "../components/main/Loading";
import Error from "../components/main/Error";
import ReviewForm from "../components/review/ReviewForm";
import ReviewInfo from "../components/review/ReviewInfo";

interface ReviewContent {
	reviewId: number;
	rate: number;
	comment: string;
	createdAt: Date;
}

interface ReviewLink {
	linkId : number;
	url: string;
	clientName: string;
	Review?: ReviewContent;
	createdAt: Date;
	updatedAt?: Date;
}

const Review = () => {

    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    
    const [review, setReview] = useState<ReviewLink|null>(null);
    const [searchParams] = useSearchParams();
    const url = searchParams.get('link');

    useEffect(() => {
        setStatus(StoreStatus.LOADING);

        HttpProvider.get<any, ReviewLink>('/review/' + url).then((review: ReviewLink) => {
            review.createdAt = new Date(review.createdAt.toString())
            setReview(review);
            setStatus(StoreStatus.READY);
        }).catch(() => {
            setStatus(StoreStatus.ERROR);
        })
    }, [url]);

    return <>
        {status == StoreStatus.LOADING ? <Loading /> : ""}
        {status == StoreStatus.ERROR ? <Error text={"No hemos podido cargar su enlace"} /> : ""}
        {status == StoreStatus.READY ? <>
            {!!review && <>
                {!review.Review 
                    ? <ReviewForm url={review.url} clientName={review.clientName} />
                    : <ReviewInfo review={{
                        clientName: review.clientName,
                        comment: review.Review.comment,
                        rate: review.Review.rate,
                        date: review.createdAt
                    }} />
                }
            </>}
            
        </> : ""}
    </>

}

export default Review;