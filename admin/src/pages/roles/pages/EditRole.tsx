import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { StoreStatus } from "../../../store/remote/Store";
import { MdClose, MdOutlineCheck } from "react-icons/md";
import RouterTable from "../../../router/router.table";
import { Module, Role } from "../../../store/remote/roles/Roles.Types";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import useStores from "../../../hooks/useStores";
import toast from "react-hot-toast";
import { EventResult } from "../../../types/Events";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import Breadcrumbs from "../../../components/Breadcrumbs";

// Define types for form data and permissions
interface RoleFormValues {
  name: string;
  details: string;
}

const EditRole: React.FC = () => {

    // Extract roleId from URL params
	const { roleId } = useParams<{ roleId: string }>();
	const navigate = useNavigate();
	const stores = useStores();

	const { register, handleSubmit, setValue, setError, formState: { errors }} = useForm<RoleFormValues>();

	const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	const [error, setLoadingError] = useState<string>("");
	const [permissions, setPermissions] = useState<Module[]>([]);
	const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

	// Handle form submission
	const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
		const payload = { ...data, permissionIds: selectedPermissions };

        let loadingToast = toast.loading("Updating role...");
        let result : EventResult;
        try {
            result = await stores.rolesStore.update(roleId || 0, payload);
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to update the role");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);
            navigate(RouterTable.roles.root);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof RoleFormValues, { message: errors[key][0] }  )
                    }
                })
            }
		}
	};

	// Toggle permission selection
	const togglePermission = (permissionId: number) => {
		setSelectedPermissions((prev) =>
		prev.includes(permissionId)
			? prev.filter((id) => id !== permissionId)
			: [...prev, permissionId]
		);
	};

	// Fetch permissions from the backend
	const load = () => {
		setStatus(StoreStatus.LOADING);
		
		// Load permissions
		stores.permissionsStore.load(null).then(
			(newStatus: StoreStatus) => {
				if (newStatus == StoreStatus.READY && stores.permissionsStore.content){
					setPermissions(stores.permissionsStore.content);

					// Load selected role
					stores.rolesStore.get(parseInt(roleId || '0')).then((role: Role) => {
						setStatus(StoreStatus.READY)
						setValue("name", role.role);
						setValue("details", role.details);
						setSelectedPermissions((role.modules || []).map((perm: Module) => perm.moduleId));
					}).catch(
						(reason) => { {
								setStatus(StoreStatus.ERROR);
								setLoadingError(reason instanceof Error ? reason.message : "Unable to load the selected role")
							}
						}	
					) 
				} else {
					setStatus(StoreStatus.ERROR);
					setLoadingError(stores.permissionsStore.lastError || "Unable to load permissions")
				}
			}
		);
	}
	
		
	useEffect(() => {
		if(typeof roleId == "undefined") {
			setLoadingError("Invalid role");
			setStatus(StoreStatus.ERROR)
		} 
		else 
			load();

		return () => {stores.permissionsStore.release()}
	}, []);

	return (
        <>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: RouterTable.roles.root, label: "Roles" },
					{ url: ".", label: "Edit" },
				]}
			/>
			
            {status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={error} /> : ""}

			{status == StoreStatus.READY ? (
                <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="panel">
                        <div className="panel-header">
                            <span className="title">Edit role</span>
                        </div>
                        <div className="panel-content">
                            {/* Role Name */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-semibold">Role Name</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Role name is required" })}
                                    className="input input-bordered lg:w-4/12"
                                    placeholder="Enter role name"
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name.message}</span>
                                )}
                            </div>
                            {/* Role Details */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-semibold">Role Details</span>
                                </label>
                                <textarea
                                    {...register("details", { required: "Role details are required" })}
                                    className="textarea textarea-bordered lg:w-6/12"
                                    placeholder="Enter role details"
                                />
                                {errors.details && (
                                    <span className="text-red-500 text-sm">{errors.details.message}</span>
                                )}
                            </div>
                            {/* Permissions List */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-semibold">Permissions</span>
                                </label>
                                <table className="table table-zebra w-full bg-base-100">
                                    <thead className="bg-base-300 rounded-t-2xl">
                                    <tr className="rounded-t-2xl">
                                        <th className="rounded-ss-2xl">Module</th>
                                        <th className="rounded-se-2xl">Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {permissions.map((module) => (
                                        <tr key={module.moduleId}>
                                        <td className="inline-flex">
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes(module.moduleId)}
                                                onChange={() => togglePermission(module.moduleId)}
                                                className="checkbox checkbox-info checkbox-sm mr-2"
                                            />
                                            {module.module}
                                        </td>
                                        <td>{module.details}</td>
                                        </tr>
                                    ))}
                                    {permissions.length > 0 || <tr><td colSpan={3} className="text-center">No permisions</td></tr>}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div className="panel-footer text-right">
                        {!!permissions.length &&
                            <button className="btn btn-primary btn-sm mx-4" type="submit">
                                <MdOutlineCheck className="text-xl" /> Apply
                            </button>}
                            <Link to={RouterTable.roles.root} className="btn bg-base-300 btn-sm mt-0">
                                <MdClose className="text-xl" /> Cancel
                            </Link>
                        </div>
                    </div>
                </form>
             </>
            ) : null }
        </>
    );
};

export default EditRole;