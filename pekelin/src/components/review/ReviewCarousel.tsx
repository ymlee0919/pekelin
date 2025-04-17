import Slider from "react-slick";
import { useEffect, useState } from "react";
import { StoreStatus } from "../../main/Loader";
import HttpProvider from "../../services/HttpProvider";
import ReviewInfo from "./ReviewInfo";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface ReviewContent {
	clientName: string;
	clientPlace: string;
	rate: number;
	comment: string;
    date: Date;
}

const ReviewCarousel = () => {

    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [reviews, setReviews] = useState<ReviewContent[]>([]);

    const settings = {
        className: "center",
        centerMode: false,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 1,
        speed: 500,
        dots: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    useEffect(() => {
        setStatus(StoreStatus.LOADING);

        HttpProvider.get<any, ReviewContent[]>('/review').then((reviews) => {
            setReviews(reviews);
            setStatus(StoreStatus.READY);
        }).catch(() => {
            setStatus(StoreStatus.ERROR);
        })
    }, []);

    return <>
        {status == StoreStatus.LOADING ? 
        <div className="show bg-white translate-middle flex align-items-center justify-content-center">
            <div className="content text-center justify-center">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
                <br></br>
                Cargando comentarios ...
            </div>
        </div>
         : null}
        {status == StoreStatus.ERROR && ""}
        {status == StoreStatus.READY ?
            <>
            <div className="pt-10 px-12">
            <div className="slider-container">
                <p className="text-center text-2xl mt-5 text-sky-900">Lo que dicen nuestros clientes</p>
                <div className="flex flex-wrap">
                    <div className="lg:w-5/12 md:w-6/12 w-11/12">
                        <img src="/reviews.jpg" className="w-full"></img>
                    </div>
                    <div className="lg:w-6/12 md:w-5/12 w-11/12">
                        <Slider {...settings}>
                            {reviews.map((content, index) => {
                                content.date = new Date(content.date.toString())
                                return <ReviewInfo className="shadow-md" key={index} review={content} />
                            })}
                        </Slider>
                    </div>
                </div>
                
            </div>
            </div>
            </>
         : null}
    </>

}

export default ReviewCarousel;