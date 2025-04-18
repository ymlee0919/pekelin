import { useCallback, useEffect, useState } from "react";

import useStores from "../../hooks/useStores";
import { StoreStatus } from "../../store/remote/Store";

import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import Breadcrumbs from "../../components/Breadcrumbs";
import { ReviewLink } from "../../store/remote/reviews/Reviews.Types";

import { AgGridWrapper } from "../../components/AgGridWrapper";
import { useGrid } from "../../hooks/useGrid";
import { RowDoubleClickedEvent } from "ag-grid-community";
import toast from "react-hot-toast";
import ReviewTBar from "./components/ReviewTBar";
import NewLinkModal from "./dialogs/NewLinkModal";
import ReviewModal from "./dialogs/ReviewModal";
import { CustomCellRendererProps } from "ag-grid-react";

import { setLinks } from "../../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 

const MainColRender = (params: CustomCellRendererProps<ReviewLink>) => {
	if(window.innerWidth >= 640)
		return params.data?.clientName;

	return <p>
		<strong>Client:</strong> {params.data?.clientName}<br></br>
		<strong>Place:</strong> {params.data?.place}<br></br>
		<strong>Url:</strong> {import.meta.env.VITE_REVIEW_URL + params.data?.url}<br></br>
		<strong>Created:</strong> {params.data?.createdAt.toLocaleDateString()}<br></br>
		<strong>Review:</strong> {params.data?.updatedAt?.toLocaleDateString()}
	</p>;
};

const ReviewLinks =() => {

	const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<ReviewLink>();
	const [showAdd, setShowAdd] = useState<boolean>(false);
	const [showInfo, setShowInfo] = useState<boolean>(false);

	const onRowDoubleClicked = useCallback((event: RowDoubleClickedEvent<ReviewLink>) => {
		if(event.node.data)	{
			let url = import.meta.env.VITE_REVIEW_URL + event.node.data.url;
			navigator.clipboard.writeText(url)
			.then(() => {
				toast.success('Url copied')
			})
			.catch(err => {
				toast.error("Failed to copy text: ", err);
			});
		}
	}, []);

    const stores = useStores();
	const dispatch = useDispatch();

    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.reviewLinksStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if(stores.reviewLinksStore.content) {
					setRowData(stores.reviewLinksStore.content);
					dispatch(setLinks(stores.reviewLinksStore.content.filter(item => !item.updatedAt).length));
				}
					
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
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.accountsStore.lastError} /> : ""}

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
									<ReviewTBar
										selectedItem={selectedItem}
										onClickAdd={() => {setShowAdd(true)}}
										onClickUpdate={() => {}}
										onClickDelete={() => {}}
										onClickInfo={() => {setShowInfo(true)}}
									 />
									<div className="max-w-full">
										<AgGridWrapper<ReviewLink>
											rowData={rowData}
											columnDefs={[		
												{ field: "clientName",
													headerName: window.innerWidth < 640 ? 'Review' : 'Client', 
													cellRenderer: MainColRender
												},
												{ field: "place",
													headerName: "Place", 
													hide: window.innerWidth < 640},
												{ field: "url",
													headerName: "Url",
													valueFormatter: params => import.meta.env.VITE_REVIEW_URL + params.value,
													flex: 3,
													hide: window.innerWidth < 640},
												{ field: "createdAt",
													headerName: "Created",
													valueFormatter: params => params.value?.toLocaleDateString(),
													flex: 1,
													hide: window.innerWidth < 640
												},
												{ field: "updatedAt",
													headerName: "Review",
													valueFormatter: params => params.value?.toLocaleDateString(),
													flex: 1,
													hide: window.innerWidth < 640
												},
											]}
											onRowSelected={onRowSelected}
											onRowDoubleClicked={onRowDoubleClicked}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					
					{showAdd &&
						<NewLinkModal onClose={() => {setShowAdd(false)} } reload={reload} />
					}
					{(showInfo && selectedItem) &&
						<ReviewModal onClose={() => {setShowInfo(false)} } review={selectedItem} />
					}
					
				</>
			) : (
				/** END OF Main component */

				""
			)}
		</>
	);
}

export default ReviewLinks;