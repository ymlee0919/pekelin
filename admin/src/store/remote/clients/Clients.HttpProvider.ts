import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { CreatedReviewLink } from "../reviews/Reviews.Types";
import { Client, ClientDTO } from "./Clients.Types";

export class ClientsHttpProvider extends AxiosProvider<Array<Client>> {
	
	async load(): Promise<Array<Client>> {
		try {
			return await HttpProvider.get<null, Array<Client>>("/clients");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load clients");
		}
	}

	async get(clientId: number): Promise<Client> {
		try {
			return await HttpProvider.get<null, Client>(`/clients/${clientId}`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the requested client");
		}
	}

	async createClient(client: ClientDTO): Promise<Client | null> {
		try {
			let created = await HttpProvider.post<ClientDTO, Client>("/clients", client);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the client");
		}
		return null;
	}

	async createReviewLink(clientId: number): Promise<CreatedReviewLink | null> {
		try {
			let created = await HttpProvider.put<{clientId:number}, CreatedReviewLink>("/reviews", {clientId});
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the client review link");
		}
		return null;
	}

	async updateClient(clientId: number, newClient: ClientDTO): Promise<Client | null> {
		try {
			let updated = await HttpProvider.patch<ClientDTO, Client>(`/clients/${clientId}`, newClient);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the client");
		}

		return null;
	}

	async deleteClient(clientId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<null, any>(`/clients/${clientId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the client");
		}

		return true;
	}
}
