import { useEffect, useRef} from "react";
import { MdDelete, MdEditSquare, MdKey, MdOutlineAdd } from "react-icons/md";

import useStores from "../hooks/useStores";
import { StoreStatus } from "../store/remote/Store";

import Loading from "../components/Loading";
import Error  from "../components/Error";
import Breadcrumbs from "../components/Breadcrumbs";
import NewAccountDialog from "./account/NewAccountDialog";
import DeleteAccountDialog from "./account/DeleteAccountDialog";
import EditAccountDialog from "./account/EditAccountDialog";
import CredentialsAccountDialog from "./account/CredentialsAccountDialog";
import { AccountContent, AccountCreationDTO, AccountCredentialsUpdateDTO, AccountUpdateDTO, CreatedAccount, UpdatedAccount } from "../store/remote/accounts/Accounts.Types";

import { setAccounts } from "../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 
import { ErrorList, errorToEventResult } from "../types/Errors";
import { EventResult } from "../types/Events";

import { AgGridWrapper } from "../components/AgGridWrapper";
import { useGrid } from "../hooks/useGrid";


const Accounts =() => {

    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<AccountContent>();

	const dispatch = useDispatch();

    const addModalRef = useRef<HTMLDialogElement>(null);
    const editModalRef = useRef<HTMLDialogElement>(null);
    const credentialsModalRef = useRef<HTMLDialogElement>(null);
    const deleteModalRef = useRef<HTMLDialogElement>(null);

    const stores = useStores();

	// Components functions
	const onAdd = async (account: AccountCreationDTO) : Promise<EventResult<CreatedAccount | ErrorList | null>> => {
		try {
			let result = await stores.accountsStore.create(account);
			if (result.success) reload();
			return result;
		} catch (error) {
			return errorToEventResult(error, "Unable to create the account");
		}
	}

	const onUpdateCredentials = async (account: AccountCredentialsUpdateDTO) => {
		try {
			let result = await stores.accountsStore.updateCredentials(
				selectedItem?.userId ?? 0,
				account
			);
			if (result.success) reload();
			return result;
		} catch (error) {
			return errorToEventResult(error, "Unable to update credentials");
		}
	}

	const onUpdate = async (account: AccountUpdateDTO) : Promise<EventResult<UpdatedAccount | ErrorList | null>> => {
		if(selectedItem) {
			try {
				let result = await stores.accountsStore.update(selectedItem?.userId ?? 0, account);
				if (result.success) reload();
				return result;
			} catch (error) {
				return errorToEventResult(error, "Unable to update the account");
			}
		}
		
		return {
            message: 'Not selected account',
            success: false,
            errorCode: 100
        }
	}

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
									<div className="navbar bg-gray-200 min-h-1 p-1">
										<div className="flex-1">
											<a
												className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none"
												onClick={() => {
													addModalRef.current?.showModal();
												}}
											>
												<MdOutlineAdd /> Add
											</a>

											<a
												className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
													selectedItem ?? "btn-disabled"
												}`}
												onClick={() => {
													editModalRef.current?.showModal();
												}}
											>
												<MdEditSquare /> Edit
											</a>

											<a
												className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
													selectedItem ?? "btn-disabled"
												}`}
												onClick={() => {
													deleteModalRef.current?.showModal();
												}}
											>
												<MdDelete /> Delete
											</a>

											<a
												className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
													selectedItem ?? "btn-disabled"
												}`}
												onClick={() => {
													credentialsModalRef.current?.showModal();
												}}
											>
												<MdKey /> Credentials
											</a>
										</div>
									</div>
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

					<NewAccountDialog
						ref={addModalRef}
						onApply={onAdd}
					/>

					<CredentialsAccountDialog
						ref={credentialsModalRef}
						user={selectedItem?.user ?? ""}
						onApply={onUpdateCredentials}
					/>

					<EditAccountDialog
						ref={editModalRef}
						name={selectedItem?.name ?? ""}
						email={selectedItem?.email ?? ""}
						onApply={onUpdate}
					/>

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