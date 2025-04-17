import { useEffect, useState} from "react";

import useStores from "../../hooks/useStores";
import { StoreStatus } from "../../store/remote/Store";

import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import Breadcrumbs from "../../components/Breadcrumbs";
import { AccountContent } from "../../store/remote/accounts/Accounts.Types";

import { setAccounts } from "../../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 

import { AgGridWrapper } from "../../components/AgGridWrapper";
import { useGrid } from "../../hooks/useGrid";
import AccountsTBar from "./components/AccountsTBar";
import DeleteAccountModal from "./dialogs/DeleteAccountModal";
import { CustomCellRendererProps } from "ag-grid-react";

const MainColRender = (params: CustomCellRendererProps<AccountContent>) => {
	if(window.innerWidth >= 640)
		return params.data?.user;

	return <p>
		<strong>User:</strong> {params.data?.user}<br></br>
		<strong>Name:</strong> {params.data?.name}<br></br>
		<strong>Email:</strong> {params.data?.email}<br></br>
		<strong>Role:</strong> {params.data?.role}
	</p>;
};

const Accounts =() => {

	const [showDelete, setShowDelete] = useState<boolean>(false);
    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<AccountContent>();
	const dispatch = useDispatch();

    const stores = useStores();

	// General functions
    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.accountsStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.accountsStore.content){
					dispatch(setAccounts(stores.accountsStore.content.length));
					setRowData(stores.accountsStore.content)
				}
					
			}
		);
    }
    
	useEffect(() => {
		reload();
		return () => {stores.accountsStore.release()}
	}, []);

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Accounts" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.accountsStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Accounts</span>
						</div>
						<div className="panel-content no-padding">
							<div className="overflow-x-auto">
								<div className="border-2 border-solid border-gray-200">
									<AccountsTBar 
										selectedItem={selectedItem} 
										onClickDelete={() => {setShowDelete(true)}}
									/>
									<div className="max-w-full">
										<AgGridWrapper<AccountContent>
											rowData={rowData}
											columnDefs={[
												{ field: "user", 
													headerName: window.innerWidth < 640 ? 'Account' : 'User', 
													cellRenderer: MainColRender
												},
												{ field: "name", hide: window.innerWidth < 640},
												{ field: "email", hide: window.innerWidth < 640},
												{ field: "role", flex: 1, hide: window.innerWidth < 640},
											]}
											onRowSelected={onRowSelected}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{(selectedItem && showDelete) &&
						<DeleteAccountModal 
							account={selectedItem}
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

export default Accounts;