import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { AccountContent, AccountCreationDTO, AccountCredentialsUpdateDTO, AccountUpdateDTO, CreatedAccount, UpdatedAccount } from "./Accounts.Types";

export default class AccountsHttpProvider extends AxiosProvider<Array<AccountContent>> {
	async load(): Promise<Array<AccountContent>> {
		try {
			return await HttpProvider.get<null, Array<AccountContent>>("/accounts");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load accounts");
		}
	}

	async createAccount(account: AccountCreationDTO): Promise<CreatedAccount | null> {
		try {
			let created = await HttpProvider.post<AccountCreationDTO, CreatedAccount>("/accounts", account);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the account");
		}
		return null;
	}

	async updateAccount(userId: number, newAccount: AccountUpdateDTO): Promise<UpdatedAccount | null> {
		try {
			let updated = await HttpProvider.put<AccountUpdateDTO, UpdatedAccount>(`/accounts/${userId}`, newAccount);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the account");
		}

		return null;
	}

	async updateCredentials(
		userId: number, 
		newCredentials: AccountCredentialsUpdateDTO
	): Promise<UpdatedAccount|null> {
		try {
			let updated = await HttpProvider.put<AccountUpdateDTO, UpdatedAccount>(`/accounts/${userId}/credentials`, newCredentials);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the account credentials");
		}

		return null;
	}

	async deleteAccount(userId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<null, any>(`/accounts/${userId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the account");
		}

		return true;
	}
}