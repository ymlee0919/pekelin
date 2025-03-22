import { MouseEvent, useState, useEffect, useRef } from "react";
import { MdDelete, MdEditSquare, MdOutlineAdd } from "react-icons/md";

import useStores from "../hooks/useStores";
import { StoreStatus } from "../store/remote/Store";

import Loading from "../components/Loading";
import Error  from "../components/Error";
import Breadcrumbs from "../components/Breadcrumbs";
import { ReviewLink } from "../store/remote/reviews/Reviews.Types";
import NewLinkDialog from "./links/NewLinkDialog";


const ReviewLinks =() => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    let [selectedItem, setSelectedItem] = useState<ReviewLink|undefined>();

    const addModalRef = useRef<HTMLDialogElement>(null);
    //const editModalRef = useRef<HTMLDialogElement>(null);
    //const credentialsModalRef = useRef<HTMLDialogElement>(null);
    //const deleteModalRef = useRef<HTMLDialogElement>(null);

    const stores = useStores();

    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(undefined);
        
        stores.reviewLinksStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
			}
		);
    }
    
	useEffect(() => {
		reload();
		return () => {stores.reviewLinksStore.release()}
	}, []);

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Review links" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <Error text={stores.accountsStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Review links</span>
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
													//editModalRef.current?.showModal();
												}}
											>
												<MdEditSquare /> Edit
											</a>

											<a
												className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
													selectedItem ?? "btn-disabled"
												}`}
												onClick={() => {
													//deleteModalRef.current?.showModal();
												}}
											>
												<MdDelete /> Delete
											</a>
										</div>
									</div>
									<table className="table table-grid">
										{/* head */}
										<thead>
											<tr>
												<th>Client</th>
												<th>Url</th>
												<th>Creation date</th>
												<th>Review date</th>
											</tr>
										</thead>
										<tbody>
											{/* rows */}
											{stores.reviewLinksStore.content?.length == 0 ? (
												<tr className="text-center">
													<td colSpan={4} data-label="User">
														<div className="m-3">
															No links registered
														</div>
													</td>
												</tr>
											) : (
												stores.reviewLinksStore.content?.map((link) => (
													<tr
														className={`hover ${
															link.linkId == selectedItem?.linkId ? "bg-base-300 font-semibold" : ""
														}`}
														data-id={link.linkId}
														key={link.linkId}
														onClick={(e: MouseEvent<HTMLTableRowElement>) => {
															let id = parseInt(
																e.currentTarget.getAttribute("data-id") ?? "0"
															)
															setSelectedItem(
																stores.reviewLinksStore.content?.find((link) => {
																	link.linkId == id
																})
															);
														}}
													>
														<td data-label="Client">{link.clientName}</td>
														<td data-label="Url">{import.meta.env.VITE_REVIEW_URL}{link.url}</td>
														<td data-label="Created">{link.createdAt.toLocaleDateString()}</td>
														<td data-label="Review">{link.updatedAt?.toLocaleDateString()}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					
					<NewLinkDialog
						ref={addModalRef}
						onChange={async (clientName: string) => {
							let result = await stores.reviewLinksStore.create(clientName);
							if (result.success) reload();
							return result;
						}}
					/>

					{/*
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
					*/}
				</>
			) : (
				/** END OF Main component */

				""
			)}
		</>
	);
}

export default ReviewLinks;