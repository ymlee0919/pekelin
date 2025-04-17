import { useEffect, useState} from "react";

import useStores from "../../hooks/useStores";
import { StoreStatus } from "../../store/remote/Store";

import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import Breadcrumbs from "../../components/Breadcrumbs";
import { OrderContent, OrderStatus } from "../../store/remote/orders/Orders.Types";

import { setOrders } from "../../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 

import { AgGridWrapper } from "../../components/AgGridWrapper";
import { useGrid } from "../../hooks/useGrid";
import OrdersTBar from "./components/OrdersTBar";
import DeleteOrderModal from "./dialogs/DeleteOrderModal";
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import OrderInfoModal from "./dialogs/OrderInfoModal";
import { errorToEventResult } from "../../types/Errors";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";
import { CustomCellRendererProps } from "ag-grid-react";


const gridOptions : GridOptions<OrderContent> = {
	rowClassRules: {
	  'bg-red-200 text-red-600 font-semibold': (params) => params.data?.status == OrderStatus.CANCELLED,
	  'bg-green-200 text-green-700 font-semibold': (params) => params.data?.status == OrderStatus.DELIVERED,
	  'bg-blue-100 italic': (params) => params.data?.status == OrderStatus.READY,
	  'bg-orange-200': (params) => params.data?.status == OrderStatus.DISPATCHED,
	}
};

const MainColRender = (params: CustomCellRendererProps<OrderContent>) => {
	if(window.innerWidth >= 640)
		return params.data?.name;

	return <p>
		<strong>Order:</strong> {params.data?.name}<br></br>
		<strong>Client:</strong> {params.data?.client}<br></br>
		<strong>Title:</strong> {params.data?.title}<br></br>
		<strong>Created:</strong> {new Date( params.data?.createdAt || Date.now() ).toLocaleDateString() }<br></br>
		<strong>Status:</strong> {params.data?.status}
	</p>;
};

const Orders =() => {

	const [showDelete, setShowDelete] = useState<boolean>(false);
	const [showInfo, setShowInfo] = useState<boolean>(false);
    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<OrderContent>();
	const dispatch = useDispatch();

    const stores = useStores();

	const changeStatus = async (status: OrderStatus) : Promise<EventResult> => {
		try {
			return await stores.ordersStore.setStatus(selectedItem?.orderId || 0, status);
		}
		catch (error) {
			return errorToEventResult(error, "Unable to delete the order");
		}
	}

	const onChangeStatus = async (status: OrderStatus) => {
		let loadingToast = toast.loading('Updating order...');
        let result = await changeStatus(status);
        toast.dismiss(loadingToast);

        if(result.success) {
            toast.success(result.message);
            reload();
        }
        else 
            toast.error(result.message);
	}

	// General functions
    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.ordersStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.ordersStore.content){
					let pending = stores.ordersStore.content.filter((order: OrderContent) => {
						return order.status == OrderStatus.PENDING
					}).length;
					dispatch(setOrders(pending));
					setRowData(stores.ordersStore.content)
				}
					
			}
		);
    }
    
	useEffect(() => {
		reload();
		return () => {stores.ordersStore.release()}
	}, []);

	const onRowDoubleClicked = (event: RowDoubleClickedEvent<OrderContent>) => {
		if(event.node.data)	{
			setSelectedItem(event.node.data);
			setShowInfo(true);
		}
	};

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Orders" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.ordersStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Orders</span>
						</div>
						<div className="panel-content no-padding">
							<div className="overflow-x-auto">
								<div className="border-2 border-solid border-gray-200">
									<OrdersTBar 
										selectedItem={selectedItem} 
										onClickDelete={() => {setShowDelete(true)}}
										onClickStatus={onChangeStatus}
									/>
									<div className="max-w-full">
										<AgGridWrapper<OrderContent>
											rowData={rowData}
											columnDefs={[
												{ field: "name", headerName: "Order", cellRenderer: MainColRender},
												{ field: "client", flex: 3, hide: window.innerWidth < 640},
												{ field: "title", flex: 5, hide: window.innerWidth < 640},
												{ field: "createdAt", hide: window.innerWidth < 640, valueFormatter: params => new Date(params.value || Date.now).toLocaleDateString()},
												{ field: "status", hide: window.innerWidth < 640}
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

					{(selectedItem && showDelete) &&
						<DeleteOrderModal 
							order={selectedItem}
							reload={reload}
							onClose={() => setShowDelete(false)}
						/>
					}

					{(selectedItem && showInfo) &&
						<OrderInfoModal
							orderId={selectedItem.orderId}
							onClose={() => setShowInfo(false)}
						/>
					}
				</>
			) : (
				/** END OF Main component */

				""
			)}
		</>
	);
}

export default Orders;