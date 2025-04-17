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
import { CustomCellRendererProps } from "ag-grid-react";


const MainColRender = (params: CustomCellRendererProps<Client>) => {
	if(window.innerWidth >= 640)
		return params.data?.name;

	return <p>
		<strong>Name:</strong> {params.data?.name}<br></br>
		<strong>Place:</strong> {params.data?.place}<br></br>
		<strong>Phone:</strong> {params.data?.phone}
	</p>;
};


const Clients =() => {

	const [showDelete, setShowDelete] = useState<boolean>(false);
    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<Client>();

    const stores = useStores();

	const filter = (value : string) => {
		if(stores.clientsStore.content)
			setRowData(stores.clientsStore.content.filter((client) => {
				if(value.length <= 1)
					return true;
				return client.name.toLowerCase().includes(value.toLowerCase());
		}))
	}

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
										onFilterChange={filter}
									/>
									<div className="max-w-full">
										<AgGridWrapper<Client>
											rowData={rowData}
											columnDefs={[
												{ field: "name",
													headerName: window.innerWidth < 640 ? 'Client' : 'User', 
													cellRenderer: MainColRender
												},
												{ field: "place", hide: window.innerWidth < 640},
												{ field: "phone", hide: window.innerWidth < 640}
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