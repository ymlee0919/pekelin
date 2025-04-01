import { useEffect, useState} from "react";

import useStores from "../../hooks/useStores";
import { StoreStatus } from "../../store/remote/Store";

import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Client } from "../../store/remote/clients/Clients.Types";

import { AgGridWrapper } from "../../components/AgGridWrapper";
import { useGrid } from "../../hooks/useGrid";
import ClientsTBar from "./components/ClientsTBar";
import DeleteClientModal from "./dialogs/DeleteClientModal";


const Clients =() => {

	const [showDelete, setShowDelete] = useState<boolean>(false);
    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<Client>();

    const stores = useStores();

	// General functions
    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.clientsStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.clientsStore.content){
					setRowData(stores.clientsStore.content)
				}
					
			}
		);
    }
    
	useEffect(() => {
		reload();
		return () => {stores.clientsStore.release()}
	}, []);

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Clients" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.clientsStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Clients</span>
						</div>
						<div className="panel-content no-padding">
							<div className="overflow-x-auto">
								<div className="border-2 border-solid border-gray-200">
									<ClientsTBar 
										selectedItem={selectedItem} 
										onClickDelete={() => {setShowDelete(true)}}
									/>
									<div className="max-w-full">
										<AgGridWrapper<Client>
											rowData={rowData}
											columnDefs={[
												{ field: "name"},
												{ field: "place"},
												{ field: "phone"}
											]}
											onRowSelected={onRowSelected}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{(selectedItem && showDelete) &&
						<DeleteClientModal 
							client={selectedItem}
							reload={reload}
							onClose={() => setShowDelete(false)}
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

export default Clients;