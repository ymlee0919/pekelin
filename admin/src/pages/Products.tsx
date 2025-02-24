import { MouseEvent, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDelete, MdOutlineAdd, MdEditSquare, MdEdit } from "react-icons/md";

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

	const dispatch = useDispatch();
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

	const onDelete = async () => {
		if(selected) {
			let loadingToast = toast.loading("Deleting product...");
			let result = await stores.productsStore.delete(selected);
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
											<NavLink to={"/products/new"} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
												<MdOutlineAdd /> Add
											</NavLink>
												
											<NavLink to={`/products/${selected}/edit`} className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
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

										</div>
									</div>
									<table className="table table-grid">
										{/* head */}
										<thead>
											<tr>
												<th className="w-20">Image</th>
												<th>Product</th>
												<th>Category</th>
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
												stores.productsStore.content?.map((product: BasicProductInfo) => {
													return (<tr 
													key={product.productId}
													data-id={product.productId}
													data-label={product.name}
													className={`hover ${product.productId == selected ? "active" : ""}`}
													onClick={(e: MouseEvent<HTMLTableRowElement>) => {
														setSelected(parseInt(e.currentTarget.getAttribute("data-id") ?? "0"))
														setSelectedName(e.currentTarget.getAttribute("data-label") ?? "-")
														}}
													>
														<td data-label="Image" className="w-20"><img src={product.remoteUrl} className="w-12"></img></td>
														<td data-label="Product" >{product.name}</td>
														<td data-label="Category" >{product.category}</td>
														<td data-label="Base price">$ {product.basePrice}</td>
														<td data-label="Selling price">$ {product.price}</td>
														<td data-label="Variants">
															{product.variants} 
															<NavLink to={`/products/${product.productId}/variants`} className="btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none">
																<MdEdit />
															</NavLink>
														</td>
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