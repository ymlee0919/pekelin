// Import Swiper React components
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

// import required modules
import { EffectCards } from 'swiper/modules';
import { ProductInfo } from '../database/database.types';
import { CommonProps } from '../types/Common';
import db from '../database/db';
import { useState } from 'react';
import Swiper from 'swiper';
import RequestBtn from './RequestBtn';

export interface CarouselProps extends CommonProps {
	product: ProductInfo
}

const SetBuilder = (props: CarouselProps) => {

	let [v1, setVariant1] = useState<number>(0);
	let [v2, setVariant2] = useState<number>(0);

	const variants1 = db.getProductVariants(props.product.product1 || 0);
	const variants2 = db.getProductVariants(props.product.product2 || 0);

	if(variants1.length == 0 || variants2.length == 0)
		return <></>;

	const productName = () => {

		return props.product.name 
			+ ' con ' 
			+ variants1[v1].name.toLowerCase() + ' y '
			+ variants2[v2].name.toLowerCase();
	}

	return (
		<div className="py-8 px-7">
			<p className="text-xl my-5 text-sky-900 px-7">Crea tu propio juego</p>
			<div className="flex flex-wrap gap-2">
				<div className="w-full md:w-5/12 sm:w-11/12">
					<div className='px-5 mx-5 pb-5'>
						<SwiperReact
							effect={'cards'}
							grabCursor={true}
							modules={[EffectCards]}
							className="mySwiper"
							onSlideChange={(swiper: Swiper) => {
								setVariant1(swiper.activeIndex);
							}}
						>
							{variants1.map((variant) => (
							<SwiperSlide key={variant.variantId}>
								<div className="aspect-square w-full flex items-center justify-center">
									<img src={variant.remoteUrl} alt="Product Name" className="h-full w-full object-contain bg-kids p-1"></img>
								</div>
							</SwiperSlide>
							))}
						</SwiperReact>

						<SwiperReact
							effect={'cards'}
							grabCursor={true}
							modules={[EffectCards]}
							className="mySwiper"
							onSlideChange={(swiper: Swiper) => {
								setVariant2(swiper.activeIndex);
							}}
						>
							{variants2.map((variant) => (
							<SwiperSlide key={variant.variantId}>
								<div className="aspect-square w-full flex items-center justify-center">
									<img src={variant.remoteUrl} alt="Product Name" className="h-full w-full object-contain bg-kids p-1"></img>
								</div>
							</SwiperSlide>
							))}
						</SwiperReact>
					</div>
				</div>
				
				<div className="w-full md:w-6/12 sm:w-11/12">
					<p className="text-sm my-1 text-sky-900 px-7 text-center">{productName()}</p>
					
					<div className="pt-4 text-center">
						<RequestBtn product={productName()} gender={props.product.gender} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default SetBuilder;