import { useEffect, useRef } from "react";
import { MdDelete, MdEditSquare, MdOutlineAdd } from "react-icons/md";

import useStores from "../hooks/useStores";
import { StoreStatus } from "../store/remote/Store";

import Loading from "../components/Loading";
import Error  from "../components/Error";
import Breadcrumbs from "../components/Breadcrumbs";
import { ReviewLink } from "../store/remote/reviews/Reviews.Types";
import NewLinkDialog from "./links/NewLinkDialog";

import { AgGridWrapper } from "../components/AgGridWrapper";
import { useGrid } from "../hooks/useGrid";

const ReviewLinks =() => {

	const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<ReviewLink>();

    const addModalRef = useRef<HTMLDialogElement>(null);
    //const editModalRef = useRef<HTMLDialogElement>(null);
    //const credentialsModalRef = useRef<HTMLDialogElement>(null);
    //const deleteModalRef = useRef<HTMLDialogElement>(null);

    const stores = useStores();

    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.reviewLinksStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if(stores.reviewLinksStore.content)
					setRowData(stores.reviewLinksStore.content)
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
									<div className="max-w-full">
										<AgGridWrapper<ReviewLink>
											rowData={rowData}
											columnDefs={[		
												{ field: "clientName" ,  headerName: "Client"},
												{ field: "url" ,  headerName: "Url", valueFormatter: params => import.meta.env.VITE_REVIEW_URL + params.value , flex: 3},
												{ field: "createdAt" ,  headerName: "Created", valueFormatter: params => params.value?.toLocaleDateString(), flex: 1 },
												{ field: "updatedAt" ,  headerName: "Review", valueFormatter: params => params.value?.toLocaleDateString(), flex: 1},
											]}
											onRowSelected={onRowSelected}
										/>
									</div>
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