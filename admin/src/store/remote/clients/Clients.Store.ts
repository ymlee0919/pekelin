import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import {ClientsHttpProvider} from "./Clients.HttpProvider";
import { Client, ClientDTO } from "./Clients.Types";
import { CreatedReviewLink } from "../reviews/Reviews.Types";

export default class ClientsStore extends Store<Array<Client>> {
	private _provider: ClientsHttpProvider;

	constructor() {
		super();
		this._provider = new ClientsHttpProvider();
	}

	protected getData(): Promise<Array<Client>> {
		return this._provider.load();
	}

	protected get provider(): ClientsHttpProvider {
		return this._provider as ClientsHttpProvider;
	}

	async get(clientId: number): Promise<Client> {

		let client = await this.provider.get(clientId);
		return client;
	}

	async create(newClient: ClientDTO): Promise<EventResult<Client | null>> {
		
		let created = await this.provider.createClient(newClient);
		
		return {
			success: true,
			message: "Client successfully created",
			info: created,
		};
	}

	async createReviewLink(clientId: number): Promise<EventResult<CreatedReviewLink | null>> {
		
		let created = await this.provider.createReviewLink(clientId);
		
		return {
			success: true,
			message: "Link successfully created",
			info: created,
		};
	}

	async update(
		clientId: string | number,
		newClient: ClientDTO
	): Promise<EventResult<Client | null>> {

		let id = typeof clientId == "string" ? parseInt(clientId) : clientId;
		let updated = await this.provider.updateClient(id, newClient);

		return {
			success: true,
			message: "Client successfully updated",
			info: updated,
		};
	}


	async delete(clientId: string | number): Promise<EventResult> {
		
		let id = typeof clientId == "string" ? parseInt(clientId) : clientId;
		await this.provider.deleteClient(id);

		return {
			success: true,
			message: "Client successfully deleted",
		};
	}
}