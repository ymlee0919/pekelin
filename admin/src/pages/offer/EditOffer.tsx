import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { MdOutlineCheck, MdClose} from "react-icons/md";
import { useForm } from "react-hook-form";

import Breadcrumbs from "../../components/Breadcrumbs";
import OfferItems from "./OfferItems";

import { StoreStatus } from "../../store/remote/Store";
import useStores from "../../hooks/useStores";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import toast from "react-hot-toast";
import { OfferInfo } from "../../store/remote/offers/OfferInfo";
import { useSelector } from 'react-redux'; 
import { RootState } from "../../store/local/store"; 
import { EmptyEvent } from "../../types/Events";
import { OfferInfoForm } from "../Offers";

/**
 * Page for new offer
 */
const EditOffer = () => {

    // Create the reducer for update the component
    
    let [status, setStatus] = useState(StoreStatus.LOADING);

	const refOffer = useRef<OfferInfo>(new OfferInfo());
	const navigate = useNavigate();
	const currency = useSelector((state: RootState) => state.global.currency);

	const {register, clearErrors, setError, setValue, reset, handleSubmit, formState: { errors }} = useForm<OfferInfoForm>();
    
    const onItemsUpdated = () => {
        setValue("items", refOffer.current.Items.length);
        if(refOffer.current.Items.length)
            clearErrors("main");
        else
            setError("main", {message: 'The offer must cost more than 1 ' + currency})
    }

	const submitRef = useRef<EmptyEvent>();

    const params = useParams();
    const stores = useStores();
	const [showHome, setShowHome] = useState<boolean>(false);

    useEffect(() => {
        stores.singleOffersStore.load({offerId: parseInt(params.id ?? '0')})
            .then( (newStatus : StoreStatus) => {
				if(stores.singleOffersStore.content)
				{
					refOffer.current = new OfferInfo(stores.singleOffersStore.content);
					setValue("price", stores.singleOffersStore.content.price);
					setValue("showHome", stores.singleOffersStore.content.showHome);
					setValue("name", stores.singleOffersStore.content.name);
					setValue("main", stores.singleOffersStore.content.main);

					setShowHome(stores.singleOffersStore.content.showHome);
				}
					
                setStatus(newStatus);
            })
		
			reset();
			submitRef.current = handleSubmit(onSumbit);
        
        // Unmount the component and create a new offer info for new page
        return () => {stores.singleOffersStore.release()}
    }, []);

	const onSumbit = async (data: OfferInfoForm) => {
		if (stores.singleOffersStore.content) {

			refOffer.current.name = data.name;
			refOffer.current.price = data.price;

			let loadingToast = toast.loading("Updating offer...");
			let result = await stores.offersStore.update(
				stores.singleOffersStore.content.offerId,
				refOffer.current.DTO
			);
			toast.dismiss(loadingToast);

			if (result.success) {
				toast.success(result.message);
				navigate('/offers');
			} else {
				toast.error(result.message);
			}
		}
	};

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: "/offers", label: "Offers" },
					{ url: ".", label: "Edit offer" },
				]}
			/>
			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <Error text={stores.singleOffersStore.lastError} /> : ""}

			<br></br>

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Edit offer</span>
						</div>
						<div className="panel-content">
							<form>
								<div className="flex flex-wrap gap-3">
									<div className="w-full md:w-3/12 sm:w-5/12">
										<label className="form-control w-full max-w-xs">
											<div className="label">
												<span className="label-text">Offer name</span>
											</div>
											<input 
												{...register("name", {
													required: true, 
													minLength: {
														value: 8, message: 'The name must contains 8 characters minimun'}
													}
												)} 
												type="text" 
												placeholder="Name of the offer" 
												className="input input-bordered w-full max-w-xs"
											/>
											{errors.name && 
												<div className="label">
													<span className="label-text text-red-500 text-sm">{errors.name.message}</span>
												</div>}
										</label>
									</div>

									<div className="w-full md:w-2/12 sm:w-3/12">
										<label className="form-control w-full max-w-xs">
											<div className="label">
											<span className="label-text">Offer price <small>({currency})</small></span>
											</div>
											<input 
												type="number" 
												placeholder="Price for the offer" 
												className="input input-bordered w-full max-w-xs"
												{...register("price", {
													required: true, 
													valueAsNumber: true,
													min: {
														value: 1, message: 'The offer must cost more than 1 ' + currency}
													}
												)} 
											/>
											{errors.price && 
												<div className="label">
													<span className="label-text text-red-500 text-sm">{errors.price.message}</span>
												</div>}
										</label>
									</div>

									<div className="md:w-2/12 sm:w-4/12 xs:w-6/12">
										<div className="form-control w-full max-w-xs">
											<div className="label">
												<span className="label-text">Show in home page</span>
											</div>
											<label className="label cursor-pointer">
												<span className="label-text">No</span>
												<input
													type="checkbox"
													className="toggle"
													value={'yes'}
													defaultChecked={stores.singleOffersStore.content?.showHome}
													{...register("showHome")}
													onChange={(e) => {
														setShowHome(e.target.checked);
														refOffer.current.showHome = e.target.checked;
													}} />
												<span className="label-text">Yes</span>
											</label>
										</div>
									</div>
									{showHome && 
										<div className="md:w-2/12 sm:w-4/12">
											<div className="form-control w-full max-w-xs">
												<div className="label">
													<span className="label-text">Best seller</span>
												</div>
												<label className="label cursor-pointer">
													<span className="label-text">No</span>
													<input
														type="checkbox"
														className="toggle"
														value={'yes'}
														{...register("main")}
														onChange={(e) => {
															refOffer.current.main = e.target.checked;
														}}
														/>
													<span className="label-text">Yes</span>
												</label>
											</div>
										</div>
									}
								</div>
								<br></br>
							</form>		
							<OfferItems offer={refOffer}  onUpdate={onItemsUpdated} />
							{errors.items && 
								<div className="label">
									<span className="label-text text-red-500 text-sm">{errors.items.message}</span>
								</div>}
						</div>
							
						<div className="panel-footer text-right">
							{!!stores.singleOffersStore.content && (
								<button 
									className="btn btn-primary btn-sm" 
									type="submit"
									onClick={() => {if(submitRef.current) submitRef.current()}}
								>
									<MdOutlineCheck className="text-xl" />
									Apply
								</button>
							)}
							&nbsp;
							<NavLink to={"/offers"} className="btn bg-base-300 btn-sm">
								<MdClose className="text-xl" />
								Cancel
							</NavLink>
						</div>
					</div>
				</>
			) : (
				/** END OF Main component */
				<></>
			)}
		</>
	);
}

export default EditOffer;