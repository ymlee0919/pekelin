import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { MdDelete, MdEdit, MdFiberNew, MdOutlineAdd, MdOutlineRemoveRedEye, MdOutlineStar, MdVisibilityOff} from "react-icons/md";

import useStores from "../../../hooks/useStores";

import { StoreStatus } from "../../../store/remote/Store";

import Breadcrumbs from "../../../components/Breadcrumbs";
import Loading from "../../../components/Loading";
import Error  from "../../../components/Error";
import { BasicVariantInfo } from "../../../store/remote/variants/Variants.Types";
import { Product, ProductFeature } from "../../../store/remote/products/Products.Types";

import { setCurrentProduct } from "../../../store/local/slices/productSlice";
import { useDispatch } from "react-redux"; 
import toast from "react-hot-toast";
import DeleteVariantModal from "../../variants/dialogs/DeleteVariantModal";

const ProductInfo = () => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	let [product, setProduct] = useState<Product|null>(null);
	let [variant, setVariant] = useState<BasicVariantInfo|null>(null);

	const dispatch = useDispatch();
	const stores = useStores();
	const params = useParams();
	const productId = parseInt(params.productId ?? '0');

	const handleVisibilityBtnClick = async (variantId: number) => {
		let loadingToast = toast.loading("Updating product variant...");
			let result = await stores.variantsStore.changeVisibility(productId, variantId);
			toast.dismiss(loadingToast);

			if (result.success) {
				toast.success(result.message);
				reload();
			} else {
				toast.error(result.message);
		}
	}

	let reload = () => {
		setStatus(StoreStatus.LOADING);

		stores.variantsStore.load({ productId }).then(
			(newStatus: StoreStatus) => { 
				setStatus(newStatus);
			}
		);
	}

	useEffect(() => {
		stores.singleProductsStore.load({ productId }).then(
			(productStatus: StoreStatus) => { 
				if(productStatus == StoreStatus.READY) {
					// Set loaded product
					if(stores.singleProductsStore.content){
						setProduct(stores.singleProductsStore.content);
						dispatch(setCurrentProduct(stores.singleProductsStore.content));
					}
					reload();
				}
				else {
					setStatus(productStatus);
				}
			}
		);

		return () => { stores.variantsStore.release(); stores.singleProductsStore.release(); }
	}, []);

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: '/', label: 'Dashboard' },
					{ url: '/products', label: 'Products' },
					{ url: '.', label: product?.name || 'Product' }
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ''}
			{status == StoreStatus.ERROR ? <Error text={stores.variantsStore.lastError} /> : ''}
			{status == StoreStatus.READY ? 
				/** Main component */
					<>
					<div className="panel">
						<div className="panel-header">
							<span className="title gap-2">
								{product?.name} 
								{product?.isNew && <MdFiberNew className="text-white text-lg" />} 
								{product?.isBestSeller && <MdOutlineStar className="text-white text-lg" />}
							</span>
						</div>
						<div className="panel-content p-5">
							<div className="flex">
								<img className="flex-none shadow-md w-40 h-40 rounded-md mr-5 mb-5" src={(import.meta.env.VITE_IMG_URL ?? '') + product?.remoteUrl}></img>
								<div className="flex-1">
									<p className="border-b text-2xl">
										{product?.name} 
										<NavLink to={`/products/${product?.productId}/${product?.isSet ? 'edit-set' : 'edit'}`} className="btn btn-info btn-xs btn-ghost mx-2">
											<MdEdit className="text-xl" />
										</NavLink>
									</p>
									<div className="flex">
										<span className="text-sm flex-1">{product?.Category.category}</span>
										<span className="flex-none bg-red-500 text-white px-2 py-1 mt-2 rounded-md"> ${product?.price}</span>
									</div>
									
									<div >
										<p className="mb-1 italic">{product?.description}</p>
										{product?.Features.map((feature : ProductFeature) => {
											return <>
											<p key={feature.featureId} className="pl-2">
												<strong>{feature.title}: </strong>
												<span> {feature.content}</span>
											</p> 
											</>
										})}
									</div>
								</div>
							</div>
							<br></br>
							<fieldset>
								<legend>Variants</legend>
								<div className="text-right">
									<NavLink
										className="btn btn-primary btn-sm"
										to={`/products/${product?.productId}/variants/new`}
									>
										<MdOutlineAdd className="text-xl" /> Add
									</NavLink>
									<br></br>
								</div>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
									{stores.variantsStore.content?.length == 0 ? (
										<p className="text-center">No product variants registered</p>
									) : (
										stores.variantsStore.content?.map((variant: BasicVariantInfo) => {
											return (
												<div key={variant.variantId} className={`card card-compact ${variant.visible ? 'bg-base-100' : 'bg-base-200'} shadow-xl`}>
													<figure>
														<img
															src={(import.meta.env.VITE_IMG_URL ?? '') + variant.remoteUrl}
															alt={variant.name}
														></img>
													</figure>
													<div className="card-body">
														<h2 className="card-title">
															<div className="flex gap-2">
																{variant.name} 
																{variant.isNew && <MdFiberNew className="text-blue-500 text-lg" />} 
																{variant.isBestSeller && <MdOutlineStar className="text-yellow-400 text-lg" />}
															</div>
														</h2>
														<p>{variant.description}</p>
														<div className="card-actions flex">
															<div className="flex-1">
																<button
																	className="btn btn-success btn-xs btn-outline btn-ghost mx-2"
																	onClick={ () => {handleVisibilityBtnClick(variant.variantId)}}
																>
																	{variant.visible && <MdVisibilityOff className="text-lg" />} 
																	{!variant.visible && <MdOutlineRemoveRedEye className="text-lg" />} 
																</button>
															</div>
															<div className="flex-none">
																<NavLink to={`/products/${product?.productId}/variants/${variant.variantId}/edit`} className="btn btn-info btn-xs btn-outline btn-ghost">
																	<MdEdit className="text-lg" />
																</NavLink>
																<button
																	className="btn btn-error btn-xs btn-outline btn-ghost mx-2"
																	onClick={() => setVariant(variant)}
																>
																	<MdDelete className="text-lg" />
																</button>
															</div>
														</div>
													</div>
												</div>
											);
										})
									)}
								</div>

							</fieldset>
								
						</div>
					</div>

					{variant && 
						<DeleteVariantModal 
							variant={variant}
							reload={reload}
							onClose={() => setVariant(null)}
						/>
					}
				</>
				
				/** END OF Main component */
			:''}
		</>
	);
}

export default ProductInfo;