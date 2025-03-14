import { MouseEvent, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdDelete, MdOutlineAdd, MdEditSquare, MdEdit, MdOutlineStar, MdFiberNew, MdOutlineRemoveRedEye, MdExpandMore } from "react-icons/md";

import useStores from "../hooks/useStores";

import { StoreStatus } from "../store/remote/Store";

import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import Error  from "../components/Error";
import toast from "react-hot-toast";
import { BasicProductInfo } from "../store/remote/products/Products.Types";

import { setProducts } from "../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 

export interface ProductInfoForm {
	price: number,
	name: string,
	showHome: boolean,
	items: number,
	main: boolean
}

const Products = () => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	let [selected, setSelected] = useState<number|null>(null);
	let [selectedName, setSelectedName] = useState<string|null>(null);
	let [isSet, setIsSet] = useState<boolean>(false);
	let [category, setCategory] = useState<string>('All');

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const stores = useStores();
	let modalRef = useRef<HTMLDialogElement>(null);

	let reload = () => {
		setStatus(StoreStatus.LOADING);
		stores.productsStore.load(null).then(
			(newStatus: StoreStatus) => { 
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.productsStore.content)
					dispatch(setProducts(stores.productsStore.content.length));
			}
		);
	}

	useEffect(() => {
		reload();
		return () => { stores.productsStore.release() }
	}, []);

	const onChangeView = async () => {
		if(selected) {
			let loadingToast = toast.loading("Updating product...");
			let result = await stores.productsStore.changeVisibility(selected);
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

	const onDelete = async () => {
		if(selected) {
			let loadingToast = toast.loading("Deleting product...");
			let result = await stores.productsStore.delete(selected);
			toast.dismiss(loadingToast);

			if (result.success) {
				modalRef.current?.close();
				toast.success(result.message);
				setSelected(null);
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
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Products" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ''}
			{status == StoreStatus.ERROR ? <Error text={stores.productsStore.lastError} /> : ''}
			{status == StoreStatus.READY ? 
				/** Main component */
			
				
					<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Products</span>
						</div>
						<div className="panel-content no-padding">
							<div className="overflow-x-auto">
								<div className="border-2 border-solid border-gray-300">
									<div className="navbar bg-gray-300 min-h-1 p-1">
										<div className="flex-1">
											<div>
												<NavLink to={"/products/new"} className="btn btn-ghost text-slate-500 btn-sm text-sm rounded-none mr-0">
													<MdOutlineAdd /> Add
												</NavLink>
												<div className="dropdown rounded-none">
													<div tabIndex={0} role="button" className="btn btn-ghost text-slate-500 btn-sm text-sm ml-0 mr-2 border-l-base-300 rounded-none"><MdExpandMore /></div>
													<ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-none z-[1] w-52 p-0 shadow">
														<li className="m-0 p-0">
															<NavLink to={"/products/new-set"} className="rounded-none">New set</NavLink>
														</li>
													</ul>
												</div>
											</div>
											<NavLink to={`/products/${selected}/${isSet? 'edit-set' : 'edit'}`} className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
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
												<th>
													<span className="pr-3">Category</span>
													<div className="dropdown">
														<div tabIndex={0} role="button"><small className="underline">({category})</small></div>
														<ul tabIndex={0} className="font-normal dropdown-content menu bg-base-100 z-[1] w-52 p-2 shadow">
															<li className="rounded-none">
																<a className="rounded-none" onClick={() => {
																	setCategory('All')
																}}>All</a>
															</li>
														{
															stores.productsStore.Categories.map((productCategory: string, index: number) => {
																return (<li className="rounded-none" key={`category-${index}`}>
																	<a className="rounded-none" onClick={() => {
																		setCategory(productCategory)
																	}}>{productCategory}</a>
																</li>)
															})
														}
														</ul>
													</div>
												</th>
												<th>Base price</th>
												<th>Selling Price</th>
												<th>Variants</th>
											</tr>
										</thead>
										<tbody>
											{/* rows */}
											{stores.productsStore.content?.length == 0 ? (
												<tr className="text-center">
													<td colSpan={5} data-label="User">
														<div className="m-3">
															No products registered
														</div>
													</td>
												</tr>
											) : (
												stores.productsStore.content?.filter((product: BasicProductInfo) => {
														return (category == 'All' || product.category == category)
													}).map((product: BasicProductInfo) => {
														return (<tr 
															key={product.productId}
															data-id={product.productId}
															data-label={product.name}
															data-set={product.isSet ? '1' : '0'}
															className={`hover ${product.productId == selected ? "active" : ""} ${!product.visible && 'bg-base-300 line-through'}`}
															onClick={(e: MouseEvent<HTMLTableRowElement>) => {
																	setSelected(parseInt(e.currentTarget.getAttribute("data-id") ?? "0"));
																	setSelectedName(e.currentTarget.getAttribute("data-label") ?? "-");
																	setIsSet(e.currentTarget.getAttribute("data-set") == '1');
																}}
															onDoubleClick={(e: MouseEvent<HTMLTableRowElement>) => {
																	let id = e.currentTarget.getAttribute("data-id") ?? "0";
																	navigate(`/products/${id}`);
																}}
															>
																<td data-label="Image" className="w-20">
																	<img src={(import.meta.env.VITE_IMG_URL ?? '') + product.remoteUrl} className="w-12"></img>
																</td>
																<td data-label="Product" >
																	<div className="flex gap-2">
																		{product.name} 
																		{product.isNew && <MdFiberNew className="text-blue-500 text-lg" />} 
																		{product.isBestSeller && <MdOutlineStar className="text-yellow-400 text-lg" />}
																		{product.isSet && <span className="text-xs">(Set)</span>}
																	</div>
																</td>
																<td data-label="Category" >{product.category}</td>
																<td data-label="Base price">$ {product.basePrice}</td>
																<td data-label="Selling price">$ {product.price}</td>
																<td data-label="Variants">
																	{product.variants} 
																	<NavLink to={`/products/${product.productId}/variants`} className="btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none">
																		<MdEdit />
																	</NavLink>
																</td>
															</tr>
														);
													})
												)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

				<dialog ref={modalRef} className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Delete product</h3>
						<br></br>
						<p className="italic">{selectedName}</p>
						<br></br>
						<p>Are you sure you want to delete the selected product?</p>
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

export default Products;