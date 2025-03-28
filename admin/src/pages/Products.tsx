import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdEdit, MdOutlineStar, MdFiberNew } from "react-icons/md";

import useStores from "../hooks/useStores";

import { StoreStatus } from "../store/remote/Store";

import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import ErrorMessage  from "../components/ErrorMessage";
import toast from "react-hot-toast";
import { BasicProductInfo } from "../store/remote/products/Products.Types";

import { setProducts } from "../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 

import type { CustomCellRendererProps } from 'ag-grid-react';
import { GridOptions, RowDoubleClickedEvent} from "ag-grid-community";

import { AgGridWrapper } from "../components/AgGridWrapper";
import { useGrid } from "../hooks/useGrid";
import ProductsTBar from "./products/components/ProductsTBar";
import DeleteProductModal from "./products/dialogs/DeleteProductModal";

export interface ProductInfoForm {
	price: number,
	name: string,
	showHome: boolean,
	items: number,
	main: boolean
}

const ColImage = (params: CustomCellRendererProps<BasicProductInfo>) => (
    <span className="h-20">
        {params.value && (
            <img     
                src={(import.meta.env.VITE_IMG_URL ?? '') + params.value}
                className="w-16 p-1"
            />
        )}
    </span>
);

const ColName = (params: CustomCellRendererProps<BasicProductInfo>) => (
    <div className="flex gap-1">
        {params.data?.name} 
        {params.data?.isNew && <MdFiberNew className="text-blue-500 text-lg mt-2" />} 
        {params.data?.isBestSeller && <MdOutlineStar className="text-yellow-400 text-lg mt-2" />}
        {params.data?.isSet && <span className="text-xs absolute right-1 top-3">(Set)</span>}
    </div>
);

const ColVariants = (params: CustomCellRendererProps<BasicProductInfo>) => (
    <>
        {params.value} 
        <NavLink to={`/products/${params.node.data?.productId}/variants`} className="btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none">
            <MdEdit />
        </NavLink>
    </>
);

const gridOptions : GridOptions<BasicProductInfo> = {
    rowClassRules: {
      'bg-red-50': (params) => params.data?.visible === false,
      'italic': (params) => params.data?.visible === false,
    }
};

const Products = () => {

	const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<BasicProductInfo>();
	const [showDelete, setShowDelete] = useState<boolean>(false);
    
	const onRowDoubleClicked = useCallback((event: RowDoubleClickedEvent<BasicProductInfo>) => {
		let id = event.node.data?.productId || 0;
		navigate(`/products/${id}`);        
	}, []);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const stores = useStores();

	const onChangeView = async () => {
		if(selectedItem) {
			let loadingToast = toast.loading("Updating product...");
			let result = await stores.productsStore.changeVisibility(selectedItem.productId);
			toast.dismiss(loadingToast);

			if (result.success) {
				toast.success(result.message);
				reload();
			} else {
				toast.error(result.message);
			}
		}
	}

	let reload = () => {
		setStatus(StoreStatus.LOADING);
        setSelectedItem(null);

		stores.productsStore.load(null).then(
			(newStatus: StoreStatus) => { 
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.productsStore.content){
                    dispatch(setProducts(stores.productsStore.content.length));
                    setRowData(stores.productsStore.content)
                }
			}
		);
	}

	useEffect(() => {
		reload();
		return () => { stores.productsStore.release() }
	}, []);

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Products" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ''}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.productsStore.lastError} /> : ''}
			{status == StoreStatus.READY ? 
				/** Main component */
					<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Products</span>
						</div>
						<div className="panel-content no-padding">
							<div className="overflow-x-auto">
								<div className="border-2 border-solid border-gray-200">
									<ProductsTBar
										selectedItem={selectedItem}
										onClickChangeVisibility={onChangeView}
										onClickDelete={() => {setShowDelete(true)}}
									/>

									<div className="max-w-full">
                                        <AgGridWrapper<BasicProductInfo>
                                            rowData={rowData}
                                            columnDefs={[
												{ field: "remoteUrl",  
													headerName: "Image", 
													cellRenderer: ColImage, 
													flex: 1, 
													sortable: false,
													hide: window.innerWidth < 768
												},
												{ field: "name" ,  headerName: "Product", cellRenderer: ColName, flex: 3},
												{ field: "category"},
												{ field: "price", 
													headerName: "Salling Price", 
													valueFormatter: params => '$ ' + params.value
												 },
												{ field: "basePrice", 
													valueFormatter: params => '$' + params.value,
													hide: window.innerWidth < 768
												},
												{ field: "variants", cellRenderer: ColVariants },
											]}
                                            gridOptions={gridOptions}
                                            onRowSelected={onRowSelected}
                                            onRowDoubleClicked={onRowDoubleClicked}
                                        />
                                    </div>
								</div>
							</div>
						</div>
					</div>

				{ (selectedItem && showDelete) && 
					<DeleteProductModal 
						product={selectedItem} 
						onClose={() => setShowDelete(false)} 
						reload={reload} /> 
				}
				</>
				
				/** END OF Main component */
			:''}
		</>
	);
}

export default Products;