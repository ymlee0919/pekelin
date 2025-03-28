import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { Module, Role, RoleDTO } from "./Roles.Types";

export class RolesHttpProvider extends AxiosProvider<Array<Role>> {
	
	async load(): Promise<Array<Role>> {
		try {
			return await HttpProvider.get<null, Array<Role>>("/roles");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load roles");
		}
	}

	async get(roleId: number): Promise<Role> {
		try {
			return await HttpProvider.get<null, Role>(`/roles/${roleId}`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the requested role");
		}
	}

	async createRole(role: RoleDTO): Promise<Role | null> {
		try {
			let created = await HttpProvider.post<RoleDTO, Role>("/roles", role);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the role");
		}
		return null;
	}

	async updateRole(roleId: number, newRole: RoleDTO): Promise<Role | null> {
		try {
			let updated = await HttpProvider.patch<RoleDTO, Role>(`/roles/${roleId}`, newRole);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the role");
		}

		return null;
	}

	async deleteRole(roleId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<null, any>(`/roles/${roleId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the role");
		}

		return true;
	}
}

export class PermissionsHttpProvider extends AxiosProvider<Array<Module>> {
	async load(): Promise<Array<Module>> {
		try {
			return await HttpProvider.get<null, Array<Module>>("/roles/permissions");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load permissions");
		}
	}
}