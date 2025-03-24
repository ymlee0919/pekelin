import { useEffect, useRef} from "react";

import useStores from "../hooks/useStores";
import { StoreStatus } from "../store/remote/Store";

import Loading from "../components/Loading";
import Error  from "../components/Error";
import Breadcrumbs from "../components/Breadcrumbs";
import DeleteAccountDialog from "./account/dialogs/DeleteAccountDialog";
import { AccountContent } from "../store/remote/accounts/Accounts.Types";

import { setAccounts } from "../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 
import { errorToEventResult } from "../types/Errors";
import { EventResult } from "../types/Events";

import { AgGridWrapper } from "../components/AgGridWrapper";
import { useGrid } from "../hooks/useGrid";
import AccountsTBar from "./account/components/AccountsTBar";


const Accounts =() => {

    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<AccountContent>();

	const dispatch = useDispatch();
    const deleteModalRef = useRef<HTMLDialogElement>(null);

    const stores = useStores();

	const onDelete = async () : Promise<EventResult> => {
		if(selectedItem) {
			try {
				let result = await stores.accountsStore.delete(selectedItem?.userId ?? 0);
				if (result.success) reload();
				return result;
			}
			catch (error) {
				return errorToEventResult(error, "Unable to delete the account");
			}
		}
		
		return {
            message: 'Not selected category',
            success: false,
            errorCode: 100
        }
	}

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
			{status == StoreStatus.ERROR ? <Error text={stores.accountsStore.lastError} /> : ""}

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
										onClickDelete={() => {deleteModalRef.current?.showModal();}}
									/>
									<div className="max-w-full">
										<AgGridWrapper<AccountContent>
											rowData={rowData}
											columnDefs={[
												{ field: "user"},
												{ field: "name"},
												{ field: "email"}
											]}
											onRowSelected={onRowSelected}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<DeleteAccountDialog
						ref={deleteModalRef}
						user={selectedItem?.user ?? ""}
						onApply={onDelete}
					/>
				</>
			) : (
				/** END OF Main component */

				""
			)}
		</>
	);
}

export default Accounts;