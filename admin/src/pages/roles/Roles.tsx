import { useEffect, useState} from "react";

import useStores from "../../hooks/useStores";
import { StoreStatus } from "../../store/remote/Store";

import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Role } from "../../store/remote/roles/Roles.Types";

import { AgGridWrapper } from "../../components/AgGridWrapper";
import { useGrid } from "../../hooks/useGrid";
import RoleTBar from "./components/RolesTBar";
import DeleteRoleModal from "./dialogs/DeleteRoleModal";
import { CustomCellRendererProps } from "ag-grid-react";

const ColPermissions = (params: CustomCellRendererProps<Role>) => (
	<div className="flex gap-1">
		{params.data?.modules && params.data?.modules.map(module => module.module).join(', ')} 
	</div>
);

const Roles =() => {

	const [showDelete, setShowDelete] = useState<boolean>(false);
    const { rowData, setRowData, status, setStatus, selectedItem, setSelectedItem, onRowSelected } = useGrid<Role>();

    const stores = useStores();

	// General functions
    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.rolesStore.load(null).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
				if (newStatus == StoreStatus.READY && stores.rolesStore.content){
					setRowData(stores.rolesStore.content)
				}
			}
		);
    }
    
	useEffect(() => {
		reload();
		return () => {stores.rolesStore.release()}
	}, []);

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Roles" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.rolesStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="panel">
						<div className="panel-header">
							<span className="title">Roles</span>
						</div>
						<div className="panel-content no-padding">
							<div className="overflow-x-auto">
								<div className="border-2 border-solid border-gray-200">
									<RoleTBar 
										selectedItem={selectedItem} 
										onClickDelete={() => {setShowDelete(true)}}
									/>
									<div className="max-w-full">
										<AgGridWrapper<Role>
											rowData={rowData}
											columnDefs={[
												{ field: "role"},
												{ field: "details"},
												{ 
													field: "modules", 
													headerName: 'Permissions',
													cellRenderer: ColPermissions
												}
											]}
											onRowSelected={onRowSelected}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{(selectedItem && showDelete) &&
						<DeleteRoleModal 
							role={selectedItem}
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

export default Roles;