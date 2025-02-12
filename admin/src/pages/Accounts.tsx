import { MouseEvent, useState, useEffect, useRef } from "react";
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
import { AccountContent, AccountCreationDTO, AccountCredentialsUpdateDTO, AccountUpdateDTO } from "../store/remote/accounts/Accounts.Types";

import { setAccounts } from "../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 


const Accounts =() => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    let [selectedItem, setSelectedItem] = useState<AccountContent|undefined>();
	const dispatch = useDispatch();

    const addModalRef = useRef<HTMLDialogElement>(null);
    const editModalRef = useRef<HTMLDialogElement>(null);
    const credentialsModalRef = useRef<HTMLDialogElement>(null);
    const deleteModalRef = useRef<HTMLDialogElement>(null);

    const stores = useStores();

    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(undefined);
        
        stores.accountsStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.accountsStore.content)
					dispatch(setAccounts(stores.accountsStore.content.length));
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
								<div className="border-2 border-solid border-gray-300">
									<div className="navbar bg-gray-300 min-h-1 p-1">
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
									<table className="table table-grid">
										{/* head */}
										<thead>
											<tr>
												<th>User</th>
												<th>Name</th>
												<th>Email</th>
											</tr>
										</thead>
										<tbody>
											{/* rows */}
											{stores.accountsStore.content?.length == 0 ? (
												<tr className="text-center">
													<td colSpan={3} data-label="User">
														<div className="m-3">
															No user registered
														</div>
													</td>
												</tr>
											) : (
												stores.accountsStore.content?.map((account) => (
													<tr
														className={`hover ${
															account.userId == selectedItem?.userId ? "active" : ""
														}`}
														data-id={account.userId}
														key={account.userId}
														onClick={(e: MouseEvent<HTMLTableRowElement>) => {
															setSelectedItem(
																stores.accountsStore.get(
																	parseInt(
																		e.currentTarget.getAttribute("data-id") ?? "0"
																	)
																)
															);
														}}
													>
														<td data-label="User">{account.user}</td>
														<td data-label="Name">{account.name}</td>
														<td data-label="Name">{account.email}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<NewAccountDialog
						ref={addModalRef}
						onChange={async (account: AccountCreationDTO) => {
							let result = await stores.accountsStore.create(account);
							if (result.success) reload();
							return result;
						}}
					/>

					<CredentialsAccountDialog
						ref={credentialsModalRef}
						user={selectedItem?.user ?? ""}
						onChange={async (account: AccountCredentialsUpdateDTO) => {
							let result = await stores.accountsStore.updateCredentials(
								selectedItem?.userId ?? 0,
								account
							);
							if (result.success) reload();
							return result;
						}}
					/>

					<EditAccountDialog
						ref={editModalRef}
						name={selectedItem?.name ?? ""}
						email={selectedItem?.email ?? ""}
						onChange={async (account: AccountUpdateDTO) => {
							let result = await stores.accountsStore.update(selectedItem?.userId ?? 0, account);
							if (result.success) reload();
							return result;
						}}
					/>

					<DeleteAccountDialog
						ref={deleteModalRef}
						user={selectedItem?.user ?? ""}
						onChange={async () => {
							let result = await stores.accountsStore.delete(selectedItem?.userId ?? 0);
							if (result.success) reload();
							return result;
						}}
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