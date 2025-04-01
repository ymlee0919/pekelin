import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {MdFiberNew, MdOutlineStar } from "react-icons/md";

import useStores from "../../hooks/useStores";

import { StoreStatus } from "../../store/remote/Store";

import Breadcrumbs from "../../components/Breadcrumbs";
import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import toast from "react-hot-toast";
import { BasicVariantInfo } from "../../store/remote/variants/Variants.Types";
import { useSelector } from 'react-redux'; 
import { RootState } from "../../store/local/store"; 

import { setCurrentProduct } from "../../store/local/slices/productSlice";
import { useDispatch } from "react-redux"; 

import type { CustomCellRendererProps } from 'ag-grid-react';
import { GridOptions} from "ag-grid-community";

import { AgGridWrapper } from "../../components/AgGridWrapper";
import { useGrid } from "../../hooks/useGrid";
import VariantsTBar from "./components/VariantsTBar";
import DeleteVariantModal from "./dialogs/DeleteVariantModal";

const ColImage = (params: CustomCellRendererProps<BasicVariantInfo>) => (
	<span className="h-20">
		{params.value && (
			<img     
				src={(import.meta.env.VITE_IMG_URL ?? '') + params.value}
				className="h-14 p-1"
			/>
		)}
	</span>
);

const ColName = (params: CustomCellRendererProps<BasicVariantInfo>) => (
	<div className="flex gap-1">
		{params.data?.name} 
		{params.data?.isNew && <MdFiberNew className="text-blue-500 text-lg mt-2" />} 
		{params.data?.isBestSeller && <MdOutlineStar className="text-yellow-400 text-lg mt-2" />}
	</div>
);

const gridOptions : GridOptions<BasicVariantInfo> = {
	rowClassRules: {
	  'bg-red-50': (params) => params.data?.visible === false,
	  'italic': (params) => params.data?.visible === false,
	},
};

const ProductVariants = () => {

	const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<BasicVariantInfo>();
	const [showDelete, setShowDelete] = useState<boolean>(false);

	const dispatch = useDispatch();
	const stores = useStores();
	const params = useParams();
	const product = useSelector((state: RootState) => state.currentProduct.product);
	const productId = parseInt(params.productId ?? '0' );

	let reload = () => {
		setStatus(StoreStatus.LOADING);
		setSelectedItem(null);

		stores.variantsStore.load({ productId })
		.then( (newStatus: StoreStatus) => { 
				setStatus(newStatus);
				if(stores.variantsStore.content)
					setRowData(stores.variantsStore.content)
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
		if(selectedItem) {
			let loadingToast = toast.loading("Updating product variant...");
			let result = await stores.variantsStore.changeVisibility(productId, selectedItem.variantId);
			toast.dismiss(loadingToast);

			if (result.success) {
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
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.variantsStore.lastError} /> : ''}
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
								<div className="border-2 border-solid border-gray-200">
									<VariantsTBar
										selectedItem={selectedItem}
										onClickChangeVisibility={onChangeView}
										onClickDelete={() => { setShowDelete(true)}}
									/>
									<div className="max-w-full">
										<AgGridWrapper<BasicVariantInfo>
											rowData={rowData}
											columnDefs={[
												{ field: "remoteUrl" ,  headerName: "Image", cellRenderer: ColImage, flex: 1, sortable: false},
												{ field: "name" ,  headerName: "Variant", cellRenderer: ColName, flex: 2},
												{ field: "description", flex: 3},
											]}
											gridOptions={gridOptions}
											onRowSelected={onRowSelected}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{(selectedItem && showDelete) &&
						<DeleteVariantModal 
							variant={selectedItem}
							reload={reload}
							onClose={() => setShowDelete(false)}
						/>
					}
				</>
				
				/** END OF Main component */
			:''}
		</>
	);
}

export default ProductVariants;