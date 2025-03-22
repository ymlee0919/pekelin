import { MouseEvent, useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { MdDelete, MdOutlineAdd, MdEditSquare, MdFiberNew, MdOutlineStar, MdOutlineRemoveRedEye } from "react-icons/md";

import useStores from "../hooks/useStores";

import { StoreStatus } from "../store/remote/Store";

import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import Error  from "../components/Error";
import toast from "react-hot-toast";
import { BasicVariantInfo } from "../store/remote/variants/Variants.Types";
import { useSelector } from 'react-redux'; 
import { RootState } from "../store/local/store"; 

import { setCurrentProduct } from "../store/local/slices/productSlice";
import { useDispatch } from "react-redux"; 

const ProductVariants = () => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	let [selected, setSelected] = useState<number|null>(null);
	let [selectedName, setSelectedName] = useState<string|null>(null);

	const dispatch = useDispatch();
	const stores = useStores();
	const params = useParams();
	const product = useSelector((state: RootState) => state.currentProduct.product);
	const productId = parseInt(params.productId ?? '0' );

	let modalRef = useRef<HTMLDialogElement>(null);

	let reload = () => {
		setStatus(StoreStatus.LOADING);

		stores.variantsStore.load({ productId })
		.then( (newStatus: StoreStatus) => { 
				setStatus(newStatus);
			}
		);
	}

	useEffect(() => {
		if(!!product && product.productId == productId)
			reload();
		else {
			stores.singleProductsStore.load({ productId }).then(
				(status: StoreStatus) => {
					if(status == StoreStatus.READY && stores.singleProductsStore.content) {
						dispatch(setCurrentProduct(stores.singleProductsStore.content));
						reload();
					}
				}
			);
		}

		return () => { stores.variantsStore.release(); stores.singleProductsStore.release(); }
	}, []);

	const onChangeView = async () => {
		if(selected) {
			let loadingToast = toast.loading("Updating product variant...");
			let result = await stores.variantsStore.changeVisibility(productId, selected);
			toast.dismiss(loadingToast);

			if (result.success) {
				toast.success(result.message);
				reload();
			} else {
				toast.error(result.message);
			}
		}
	}

	const onDelete = async () => {
		if(selected) {
			let loadingToast = toast.loading("Deleting product variant...");
			let result = await stores.variantsStore.delete(productId, selected);
			toast.dismiss(loadingToast);

			if (result.success) {
				modalRef.current?.close();
				toast.success(result.message);
				reload();
			} else {
				toast.error(result.message);
			}
		}
	}

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: '/', label: 'Dashboard' },
					{ url: '/products', label: 'Products' },
					{ url: `/products/${product?.productId}`, label: product?.name || 'Product' },
					{ url: '.', label: 'Variants' },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ''}
			{status == StoreStatus.ERROR ? <Error text={stores.variantsStore.lastError} /> : ''}
			{status == StoreStatus.READY ? 
				/** Main component */
					<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Variants of {product?.name}</span>
						</div>
						<div className="panel-content p-5">
							<div className="flex">
								<img className="flex-none shadow-md w-28 h-28 rounded-md mr-5 mb-5" src={(import.meta.env.VITE_IMG_URL ?? '') + product?.remoteUrl}></img>
								<div className="flex-1">
									<p className="border-b text-2xl">{product?.name}</p>
									<div className="flex">
										<span className="text-sm flex-1">{product?.Category.category}</span>
										<span className="flex-none bg-red-500 text-white px-2 py-1 mt-2 rounded-md"> ${product?.price}</span>
									</div>
								</div>
							</div>

							<div className="overflow-x-auto">
								<div className="border-2 border-solid border-gray-300">
									<div className="navbar bg-gray-300 min-h-1 p-1">
										<div className="flex-1">
											<NavLink to={`/products/${product?.productId}/variants/new`} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
												<MdOutlineAdd /> Add
											</NavLink>
												
											<NavLink to={`/products/${product?.productId}/variants/${selected}/edit`} className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
														selected ?? "btn-disabled"
													}`}>
												<MdEditSquare /> Edit
											</NavLink>

											<a
												className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
													selected ?? "btn-disabled"
												}`}
												onClick={() => {modalRef.current?.showModal() }}
											>
												<MdDelete /> Delete
											</a>

											<a
												className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
													selected ?? "btn-disabled"
												}`}
												onClick={onChangeView}
											>
												<MdOutlineRemoveRedEye /> Show/Hide
											</a>

										</div>
									</div>
									<table className="table table-grid">
										{/* head */}
										<thead>
											<tr>
												<th className="w-20">Image</th>
												<th>Product</th>
												<th>Description</th>
											</tr>
										</thead>
										<tbody>
											{/* rows */}
											{stores.variantsStore.content?.length == 0 ? (
												<tr className="text-center">
													<td colSpan={3} data-label="User">
														<div className="m-3">
															No product variants registered
														</div>
													</td>
												</tr>
											) : (
												stores.variantsStore.content?.map((variant: BasicVariantInfo) => {
													return (<tr 
													key={variant.variantId}
													data-id={variant.variantId}
													data-label={variant.name}
													className={`hover ${variant.variantId == selected ? "bg-base-300 font-semibold" : ""}  ${!variant.visible && 'bg-base-300 line-through'}`}
													onClick={(e: MouseEvent<HTMLTableRowElement>) => {
														setSelected(parseInt(e.currentTarget.getAttribute("data-id") ?? "0"))
														setSelectedName(e.currentTarget.getAttribute("data-label") ?? "-")
														}}
													>
														<td data-label="Image" className="w-20"><img src={(import.meta.env.VITE_IMG_URL ?? '') + variant.remoteUrl} className="w-12"></img></td>
														<td data-label="Product" >
															<div className="flex gap-2">
																{variant.name} 
																{variant.isNew && <MdFiberNew className="text-blue-500 text-lg" />} 
																{variant.isBestSeller && <MdOutlineStar className="text-yellow-400 text-lg" />}
															</div>
														</td>
														<td data-label="Description" >{variant.description}</td>
													</tr>);
												})
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

				<dialog ref={modalRef} className="modal">
					<div className="modal-box bg-base-200">
						<h3 className="font-bold text-lg">Delete variant</h3>
						<br></br>
						<p className="italic">{selectedName}</p>
						<br></br>
						<p>Are you sure you want to delete the selected variant?</p>
						<div className="modal-action">
							<a className="btn btn-info btn-sm mr-5" onClick={onDelete}>Yes, delete</a>
							<a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>No, close</a>
						</div>
					</div>
				</dialog>
				</>
				
				/** END OF Main component */
			:''}
		</>
	);
}

export default ProductVariants;