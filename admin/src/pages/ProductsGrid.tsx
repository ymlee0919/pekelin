import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

import type { ColDef, RowSelectedEvent, RowDoubleClickedEvent, GridOptions } from "ag-grid-community";
import type { CustomCellRendererProps } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz, Theme, RowSelectionOptions } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

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

const myTheme = themeQuartz.withParams({
    borderRadius: 'none',
    headerTextColor: '#454545',
    selectedRowBackgroundColor: '#e6e6e6',
    fontSize: '13px',
    rowHoverColor: '#f6f6f6',
    backgroundColor: '#f3f4f6'
});

const gridOptions : GridOptions<BasicProductInfo> = {
    rowClassRules: {
      'bg-red-50': (params) => params.data?.visible === false,
      'italic': (params) => params.data?.visible === false,
    }
};

const ProductsGrid = () => {

    const [rowData, setRowData] = useState<BasicProductInfo[]|null>(null);

    const [colDefs, setColDefs] = useState<ColDef<BasicProductInfo>[]>([
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
    ]);

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	let [selected, setSelected] = useState<number|null>(null);

    const defaultColDef: ColDef = {
        flex: 2,
        autoHeight: true,
        cellClass: "text-gray-500"
    };

    const rowSelection = useMemo<RowSelectionOptions>(() => { 
        return {
            mode: 'singleRow',
            checkboxes: false,
            enableClickSelection: true,
        };
    }, []);

    const theme = useMemo<Theme | "legacy">(() => {
        return myTheme;
      }, []);

    const onRowSelected = useCallback((event: RowSelectedEvent<BasicProductInfo>) => {
        if(event.node.isSelected()) {
            setSelected(event.node.data?.productId || null);
            setSelectedName(event.node.data?.name || '-');
            setIsSet(event.node.data?.isSet || false);
        }
      }, []);

      const onRowDoubleClicked = useCallback((event: RowDoubleClickedEvent<BasicProductInfo>) => {
        let id = event.node.data?.productId || 0;
        navigate(`/products/${id}`);        
      }, []);
	
    let [selectedName, setSelectedName] = useState<string|null>(null);
	let [isSet, setIsSet] = useState<boolean>(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const stores = useStores();
	let modalRef = useRef<HTMLDialogElement>(null);

	let reload = () => {
		setStatus(StoreStatus.LOADING);
        setSelected(null);
        setSelectedName(null);
        setIsSet(false);

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
									<div className="max-w-full h-80">
                                        <AgGridReact
                                            className="rounded-none"
                                            rowData={rowData}
                                            columnDefs={colDefs}
                                            gridOptions={gridOptions}
                                            theme={theme}
                                            defaultColDef={defaultColDef}
                                            rowSelection={rowSelection}
                                            onRowSelected={onRowSelected}
                                            onRowDoubleClicked={onRowDoubleClicked}
                                        />
                                    </div>
								</div>
							</div>
						</div>
					</div>

				<dialog ref={modalRef} className="modal">
					<div className="modal-box bg-base-200">
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

export default ProductsGrid;