import { BsStar, BsStarFill } from "react-icons/bs";
import { CommonProps } from "../../types/Common";


interface ReviewProps extends CommonProps {
    review : {
        clientName: string;
        rate: number;
        comment: string;
        date: Date;
    }
}

const ReviewInfo = (props: ReviewProps) => {

    let drawStar = (i : number) => {
        if(i <= props.review.rate)
            return <BsStarFill key={i} className="text-yellow-500 text-sm"/ >
        return <BsStar key={i} className="text-yellow-500 text-sm"/ >
    }
    
    return <>
        <div className="flex flex-wrap justify-center pt-32 pb-12">
            <div className="max-w-60 rounded-lg text-gray-600">
                <p className="italic pb-1">{props.review.comment}</p>
                <div className="inline-flex gap-1">
                    {[1,2,3,4,5].map(drawStar)}                    
                </div>
                <p className=" text-gray-500">{props.review.clientName} <span className="text-xs">/ {props.review.date.toDateString()}</span></p>
            </div>
        </div>
    </>
}

export default ReviewInfo;