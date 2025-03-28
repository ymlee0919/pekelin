import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { StoreStatus } from "../../../store/remote/Store";

// Define types for form data and permissions
interface RoleFormValues {
  name: string;
  details: string;
}

interface Permission {
  id: number;
  module: string;
  details: string;
}

const EditRole: React.FC = () => {

	const { roleId } = useParams<{ roleId: string }>(); // Extract roleId from URL params
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<RoleFormValues>();

	const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

	// Fetch role data and available permissions
	useEffect(() => {
		const fetchRoleAndPermissions = async () => {
		try {
			// Fetch role details
			const roleResponse = await axios.get(`/api/roles/${roleId}`);
			const { name, details, permissions: rolePermissions } = roleResponse.data;

			// Set form default values and selected permissions
			reset({ name, details });
			setSelectedPermissions(rolePermissions.map((perm: Permission) => perm.id));

			// Fetch all permissions
			const permissionsResponse = await axios.get<Permission[]>("/api/permissions");
			setPermissions(permissionsResponse.data);
		} catch (error) {
			console.error("Failed to fetch role or permissions", error);
		}
		};

		fetchRoleAndPermissions();
	}, [roleId, reset]);

	// Handle form submission
	const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
		try {
		const payload = { ...data, permissionIds: selectedPermissions };
		await axios.patch(`/api/roles/${roleId}`, payload);
		alert("Role updated successfully!");
		navigate("/roles"); // Redirect to roles list page
		} catch (error) {
		console.error("Failed to update role", error);
		alert("Error updating role.");
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

	return (
		<div className="p-6 max-w-4xl mx-auto bg-base-100 shadow-lg rounded-lg">
			<h1 className="text-2xl font-bold mb-4">Update Role</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Role Name */}
				<div className="form-control mb-4">
					<label className="label">
						<span className="label-text font-semibold">Role Name</span>
					</label>
					<input
						type="text"
						{...register("name", { required: "Role name is required" })}
						className="input input-bordered"
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
						className="textarea textarea-bordered"
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
					<table className="table table-zebra w-full">
						<thead>
						<tr>
							<th>Permission Name</th>
							<th>Details</th>
							<th>Action</th>
						</tr>
						</thead>
						<tbody>
						{permissions.map((permission) => (
							<tr key={permission.id}>
							<td>{permission.module}</td>
							<td>{permission.details}</td>
							<td>
								<input
								type="checkbox"
								checked={selectedPermissions.includes(permission.id)}
								onChange={() => togglePermission(permission.id)}
								className="checkbox"
								/>
							</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>

				{/* Submit Button */}
				<div className="form-control mt-6">
					<button className="btn btn-primary">Update Role</button>
				</div>
			</form>
		</div>
	);
};

export default EditRole;