import { useEffect, useState} from "react";

import useStores from "../../hooks/useStores";
import { StoreStatus } from "../../store/remote/Store";

import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import Breadcrumbs from "../../components/Breadcrumbs";
import { OrderContent } from "../../store/remote/orders/Orders.Types";

//import { setOrders } from "../../store/local/slices/globalSlice";
//import { useDispatch } from "react-redux"; 

import { AgGridWrapper } from "../../components/AgGridWrapper";
import { useGrid } from "../../hooks/useGrid";
import OrdersTBar from "./components/OrdersTBar";
import DeleteOrderModal from "./dialogs/DeleteOrderModal";
import { RowDoubleClickedEvent } from "ag-grid-community";
import OrderInfoModal from "./dialogs/OrderInfoModal";

const Orders =() => {

	const [showDelete, setShowDelete] = useState<boolean>(false);
	const [showInfo, setShowInfo] = useState<boolean>(false);
    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<OrderContent>();
	//const dispatch = useDispatch();

    const stores = useStores();

	// General functions
    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.ordersStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.ordersStore.content){
					//dispatch(setOrders(stores.ordersStore.content.length));
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
									/>
									<div className="max-w-full">
										<AgGridWrapper<OrderContent>
											rowData={rowData}
											columnDefs={[
												{ field: "client", flex: 3},
												{ field: "title", flex: 5},
												{ field: "createdAt", valueFormatter: params => new Date(params.value || Date.now).toLocaleDateString()},
												{ field: "status"}
											]}
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