import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import {RolesHttpProvider, PermissionsHttpProvider} from "./Roles.HttpProvider";
import { Module, Role, RoleDTO } from "./Roles.Types";

export class RolesStore extends Store<Array<Role>> {
	private _provider: RolesHttpProvider;

	constructor() {
		super();
		this._provider = new RolesHttpProvider();
	}

	protected getData(): Promise<Array<Role>> {
		return this._provider.load();
	}

	protected get provider(): RolesHttpProvider {
		return this._provider as RolesHttpProvider;
	}

	async get(roleId: number): Promise<Role> {

		let role = await this.provider.get(roleId);
		return role;
	}

	async create(newRole: RoleDTO): Promise<EventResult<Role | null>> {
		
		let created = await this.provider.createRole(newRole);
		
		return {
			success: true,
			message: "Role successfully created",
			info: created,
		};
	}

	async update(
		roleId: string | number,
		newRole: RoleDTO
	): Promise<EventResult<Role | null>> {

		let id = typeof roleId == "string" ? parseInt(roleId) : roleId;
		let updated = await this.provider.updateRole(id, newRole);

		return {
			success: true,
			message: "Role successfully updated",
			info: updated,
		};
	}


	async delete(roleId: string | number): Promise<EventResult> {
		
		let id = typeof roleId == "string" ? parseInt(roleId) : roleId;
		await this.provider.deleteRole(id);

		return {
			success: true,
			message: "Role successfully deleted",
		};
	}
}

export class PermissionsStore extends Store<Array<Module>> {
	private _provider: PermissionsHttpProvider;

	constructor() {
		super();
		this._provider = new PermissionsHttpProvider();
	}

	protected getData(): Promise<Array<Module>> {
		return this._provider.load();
	}

	protected get provider(): PermissionsHttpProvider {
		return this._provider as PermissionsHttpProvider;
	}
}